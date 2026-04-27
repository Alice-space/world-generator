"""WorldPainter asset preparation powered by ImageMagick.

T005 optimization: sequential convert calls that previously wrote intermediate
files are merged into single chained convert commands using ``-write`` for any
branch-points where an intermediate file is still needed later.
"""

import logging
import multiprocessing as mp
import subprocess
from pathlib import Path

import pebble

from .config import GeneratorConfig
from .tools import calculateTiles

logger = logging.getLogger(__name__)


def run_magick(config: GeneratorConfig, tile: str) -> None:
    logger.info("Magick for %s", tile)
    std_out = ""
    std_err = ""
    image_output_folder = config.image_exports_dir
    tile_folder = image_output_folder / tile
    tile_folder.mkdir(parents=True, exist_ok=True)
    (tile_folder / "heightmap").mkdir(parents=True, exist_ok=True)

    if (tile_folder / f"{tile}_terrain_reduced_colors.png").exists():
        logger.info("Skipping Magick for %s", tile)
        return

    # Validate required input files up-front so failures surface immediately
    # instead of silently producing intermediate files but no final output.
    palette = config.magick_terrain_palette_path
    if not palette.exists():
        raise FileNotFoundError(
            f"Magick palette not found at {palette}. "
            f"Ensure scripts_folder_path/wpscript/terrain/Standard.png exists "
            f"(usually symlinked from the source repo's Data/wpscript/terrain/)."
        )
    terrain_input = tile_folder / f"{tile}_terrain.png"
    if not terrain_input.exists():
        raise FileNotFoundError(
            f"Required terrain input missing: {terrain_input}. "
            f"QGIS image_export must complete before run_magick."
        )

    def _run(args: list[str | Path]) -> subprocess.CompletedProcess[str]:
        result = subprocess.run(
            [str(arg) for arg in args], capture_output=True, text=True
        )
        nonlocal std_out, std_err
        std_out += result.stdout
        std_err += result.stderr
        if result.returncode != 0:
            raise RuntimeError(
                f"convert failed (exit {result.returncode}) for tile {tile}: "
                f"{result.stderr.strip()[:500]}"
            )
        return result

    threshold_arg = f"{config.magick_water_threshold_pct}%%"

    # ---------------------------------------------------------------------------
    # T005 Merge 1: water mask pipeline
    # Original: copy → draw-point → negate+threshold → transparent (4 calls)
    # Merged:   1 call with intermediate -write for water_temp (not needed later)
    # water.png → draw black point → negate+threshold → transparent → water_mask.png
    # ---------------------------------------------------------------------------
    _run(
        [
            "convert",
            tile_folder / f"{tile}_water.png",
            "-draw", "point 1,1",
            "-fill", "black",
            "-negate",
            "-threshold", threshold_arg,
            "-transparent", "black",
            tile_folder / f"{tile}_water_mask.png",
        ]
    )

    # ---------------------------------------------------------------------------
    # T005 Merge 2: river mask pipeline (same pattern as water)
    # Original: copy → draw-point → negate+threshold → transparent (4 calls)
    # Merged:   1 call
    # ---------------------------------------------------------------------------
    _run(
        [
            "convert",
            tile_folder / f"{tile}_river.png",
            "-draw", "point 1,1",
            "-fill", "black",
            "-negate",
            "-threshold", threshold_arg,
            "-transparent", "black",
            tile_folder / f"{tile}_river_mask.png",
        ]
    )

    # Composite water_mask over river_mask → water_transparent.png
    _run(
        [
            "composite",
            "-gravity", "center",
            tile_folder / f"{tile}_water_mask.png",
            tile_folder / f"{tile}_river_mask.png",
            tile_folder / f"{tile}_water_transparent.png",
        ]
    )

    # ---------------------------------------------------------------------------
    # T005 Merge 3: exported → removed_invalid → edges (2 calls → 1 call)
    # Use -write to save _removed_invalid.png at the branch point.
    # ---------------------------------------------------------------------------
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_exported.png",
            "-transparent", "black",
            "-depth", "16",
            "-write", str(tile_folder / "heightmap" / f"{tile}_removed_invalid.png"),
            "-channel", "A",
            "-morphology", "EdgeIn", config.magick_morphology_kernel,
            "-depth", "16",
            tile_folder / "heightmap" / f"{tile}_edges.png",
        ]
    )

    # 构建高程金字塔：连续缩小 N 次后再用 Gaussian 放大回原尺寸，用于填充无效像素
    pyramid_step = "( +clone -resize 50%% )"
    cond = (pyramid_step + " ") * config.magick_pyramid_levels
    cond = cond.strip().split()
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_edges.png",
            *cond,
            "-layers", "RemoveDups",
            "-filter", config.magick_pyramid_filter,
            "-resize", f"{config.blocks_per_tile}x{config.blocks_per_tile}!",
            "-reverse",
            "-background", "None",
            "-flatten",
            "-alpha", "off",
            "-depth", "16",
            tile_folder / "heightmap" / f"{tile}_invalid_filled.png",
        ]
    )

    # ---------------------------------------------------------------------------
    # T005 Merge 4: invalid_filled + removed_invalid → unsmoothed → water_blacked
    # (2 calls → 1 call using -write to save unsmoothed at the branch point)
    # ---------------------------------------------------------------------------
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_invalid_filled.png",
            tile_folder / "heightmap" / f"{tile}_removed_invalid.png",
            "-compose", "over",
            "-composite",
            "-depth", "16",
            "-write", str(tile_folder / "heightmap" / f"{tile}_unsmoothed.png"),
            tile_folder / f"{tile}_water_transparent.png",
            "-compose", "over",
            "-composite",
            "-depth", "16",
            tile_folder / "heightmap" / f"{tile}_water_blacked.png",
        ]
    )

    # ---------------------------------------------------------------------------
    # T005 Merge 5: water_blacked → water_removed → water_edges (2 calls → 1 call)
    # ---------------------------------------------------------------------------
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_water_blacked.png",
            "-transparent", "white",
            "-depth", "16",
            "-write", str(tile_folder / "heightmap" / f"{tile}_water_removed.png"),
            "-channel", "A",
            "-morphology", "EdgeIn", config.magick_morphology_kernel,
            "-depth", "16",
            tile_folder / "heightmap" / f"{tile}_water_edges.png",
        ]
    )

    cond = (
        f'( +clone -channel A -morphology EdgeIn {config.magick_morphology_kernel} +channel'
        f' +write sparse-color:{tile_folder / "heightmap" / f"{tile}vf.txt"}'
        f' -sparse-color Voronoi @{tile_folder / "heightmap" / f"{tile}vf.txt"}'
        f"  -alpha off -depth 16 )"
    ).split()
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_water_edges.png",
            *cond,
            "-compose", "DstOver",
            "-composite",
            tile_folder / "heightmap" / f"{tile}_water_filled.png",
        ]
    )

    # ---------------------------------------------------------------------------
    # T005 Merge 6: water_filled level adjust + composite with water_removed → final
    # Original: level-adjust in-place, then composite (2 calls → 1 call)
    # ---------------------------------------------------------------------------
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_water_filled.png",
            "-level",
            f"{config.magick_water_level_adjust_pct}%%,{100.0 + config.magick_water_level_adjust_pct}%%",
            tile_folder / "heightmap" / f"{tile}_water_removed.png",
            "-compose", "over",
            "-composite",
            "-depth", "16",
            tile_folder / "heightmap" / f"{tile}.png",
        ]
    )

    _run(
        [
            "convert",
            tile_folder / f"{tile}.png",
            "-blur", str(config.magick_terrain_blur_radius),
            tile_folder / f"{tile}.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / f"{tile}_climate.png",
            "-sample", f"{config.magick_climate_sample_pct}%%",
            "-magnify",
            "-define", "png:color-type=6",
            tile_folder / f"{tile}_climate.png",
        ]
    )
    # 海洋温度图：先缩小到指定比例，再连续放大 N 次（每次 ×2）
    magnify_args = ["-magnify"] * config.magick_ocean_temp_magnify_times
    _run(
        [
            "convert",
            tile_folder / f"{tile}_ocean_temp.png",
            "-sample", f"{config.magick_ocean_temp_sample_pct}%%",
            *magnify_args,
            tile_folder / f"{tile}_ocean_temp.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / f"{tile}_terrain.png",
            "-dither", "None",
            "-remap", config.magick_terrain_palette_path,
            tile_folder / f"{tile}_terrain_reduced_colors.png",
        ]
    )
    if std_out.strip():
        logger.info("Magick for %s output: %s", tile, std_out.strip())
    if std_err.strip():
        logger.error("Magick for %s error: %s", tile, std_err.strip())


def magick_convert(config: GeneratorConfig) -> None:
    degree_per_tile = config.degree_per_tile
    pool = pebble.ProcessPool(
        max_workers=config.threads,
        max_tasks=1,
        context=mp.get_context("forkserver"),
    )
    for x_min in range(-180, 180, degree_per_tile):
        for y_min in range(-90, 90, degree_per_tile):
            tile = calculateTiles(x_min, y_min + degree_per_tile)
            pool.schedule(run_magick, [config, tile])
    pool.close()
    pool.join()
    logger.info("magickConvert done")


__all__ = ["run_magick", "magick_convert"]
