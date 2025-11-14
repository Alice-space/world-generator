"""WorldPainter asset preparation powered by ImageMagick."""

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

    def _run(args: list[str | Path]) -> subprocess.CompletedProcess[str]:
        result = subprocess.run(
            [str(arg) for arg in args], capture_output=True, text=True
        )
        nonlocal std_out, std_err
        std_out += result.stdout
        std_err += result.stderr
        return result

    _run(
        [
            "convert",
            tile_folder / f"{tile}_water.png",
            tile_folder / f"{tile}_water_temp.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / f"{tile}_river.png",
            tile_folder / f"{tile}_river_temp.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / f"{tile}_water_temp.png",
            "-draw",
            "point 1,1",
            "-fill",
            "black",
            tile_folder / f"{tile}_water_temp.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / f"{tile}_river_temp.png",
            "-draw",
            "point 1,1",
            "-fill",
            "black",
            tile_folder / f"{tile}_river_temp.png",
        ]
    )
    _run(
        [
            "convert",
            "-negate",
            tile_folder / f"{tile}_water_temp.png",
            "-threshold",
            "1%%",
            tile_folder / f"{tile}_water_mask.png",
        ]
    )
    _run(
        [
            "convert",
            "-negate",
            tile_folder / f"{tile}_river_temp.png",
            "-threshold",
            "1%%",
            tile_folder / f"{tile}_river_mask.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / f"{tile}_water_mask.png",
            "-transparent",
            "black",
            tile_folder / f"{tile}_water_mask.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / f"{tile}_river_mask.png",
            "-transparent",
            "black",
            tile_folder / f"{tile}_river_mask.png",
        ]
    )
    _run(
        [
            "composite",
            "-gravity",
            "center",
            tile_folder / f"{tile}_water_mask.png",
            tile_folder / f"{tile}_river_mask.png",
            tile_folder / f"{tile}_water_transparent.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_exported.png",
            "-transparent",
            "black",
            "-depth",
            "16",
            tile_folder / "heightmap" / f"{tile}_removed_invalid.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_removed_invalid.png",
            "-channel",
            "A",
            "-morphology",
            "EdgeIn",
            "Diamond",
            "-depth",
            "16",
            tile_folder / "heightmap" / f"{tile}_edges.png",
        ]
    )
    cond = """( +clone -resize 50%% ) ( +clone -resize 50%% ) ( +clone -resize 50%% ) ( +clone -resize 50%% ) ( +clone -resize 50%% ) ( +clone -resize 50%% ) ( +clone -resize 50%% ) ( +clone -resize 50%% ) ( +clone -resize 50%% ) ( +clone -resize 50%% )""".split()
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_edges.png",
            *cond,
            "-layers",
            "RemoveDups",
            "-filter",
            "Gaussian",
            "-resize",
            f"{config.blocks_per_tile}x{config.blocks_per_tile}!",
            "-reverse",
            "-background",
            "None",
            "-flatten",
            "-alpha",
            "off",
            "-depth",
            "16",
            tile_folder / "heightmap" / f"{tile}_invalid_filled.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_invalid_filled.png",
            tile_folder / "heightmap" / f"{tile}_removed_invalid.png",
            "-compose",
            "over",
            "-composite",
            "-depth",
            "16",
            tile_folder / "heightmap" / f"{tile}_unsmoothed.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_unsmoothed.png",
            tile_folder / f"{tile}_water_transparent.png",
            "-compose",
            "over",
            "-composite",
            "-depth",
            "16",
            tile_folder / "heightmap" / f"{tile}_water_blacked.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_water_blacked.png",
            "-transparent",
            "white",
            "-depth",
            "16",
            tile_folder / "heightmap" / f"{tile}_water_removed.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_water_removed.png",
            "-channel",
            "A",
            "-morphology",
            "EdgeIn",
            "Diamond",
            "-depth",
            "16",
            tile_folder / "heightmap" / f"{tile}_water_edges.png",
        ]
    )
    cond = f'( +clone -channel A -morphology EdgeIn Diamond +channel +write sparse-color:{tile_folder / "heightmap" / f"{tile}vf.txt"} -sparse-color Voronoi @{tile_folder / "heightmap" / f"{tile}vf.txt"}  -alpha off -depth 16 )'.split()
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_water_edges.png",
            *cond,
            "-compose",
            "DstOver",
            "-composite",
            tile_folder / "heightmap" / f"{tile}_water_filled.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_water_filled.png",
            "-level",
            "0.002%%,100.002%%",
            tile_folder / "heightmap" / f"{tile}_water_filled.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / "heightmap" / f"{tile}_water_filled.png",
            tile_folder / "heightmap" / f"{tile}_water_removed.png",
            "-compose",
            "over",
            "-composite",
            "-depth",
            "16",
            tile_folder / "heightmap" / f"{tile}.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / f"{tile}.png",
            "-blur",
            "5",
            tile_folder / f"{tile}.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / f"{tile}_climate.png",
            "-sample",
            "50%%",
            "-magnify",
            "-define",
            "png:color-type=6",
            tile_folder / f"{tile}_climate.png",
        ]
    )
    _run(
        [
            "convert",
            tile_folder / f"{tile}_ocean_temp.png",
            "-sample",
            "12.5%%",
            "-magnify",
            "-magnify",
            "-magnify",
            tile_folder / f"{tile}_ocean_temp.png",
        ]
    )
    scripts_folder_path = config.scripts_folder_path
    _run(
        [
            "convert",
            tile_folder / f"{tile}_terrain.png",
            "-dither",
            "None",
            "-remap",
            scripts_folder_path / "wpscript" / "terrain" / "Standard.png",
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
