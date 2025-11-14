"""ImageMagick conversion stage."""

from __future__ import annotations

import logging
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path
from typing import TYPE_CHECKING

from ..adapters.magick import convert, magick_run
from ..core.settings import Config
from ..utils.tiles import iter_tiles

if TYPE_CHECKING:
    from typing import Any  # pragma: no cover

logger = logging.getLogger(__name__)


def stage_magick_convert(cfg: Config) -> None:
    logger.info("ImageMagick conversions ...")
    bpt = cfg.blocks_per_tile
    out_root = Path(cfg.scripts_folder_path, "image_exports")
    hdir = Path(cfg.scripts_folder_path, "image_exports")
    hdir.mkdir(parents=True, exist_ok=True)
    work = []
    for _, _, tile in iter_tiles():
        folder = Path(out_root, tile)
        # Example water processing
        if not (folder / f"{tile}_terrain_reduced_colors.png").exists():
            work.append(tile)

    def _pipe(tile: str) -> None:
        folder = Path(out_root, tile)
        # 'water' to mask
        water_src = folder / f"{tile}_water.png"
        water_tmp = folder / f"{tile}_water_temp.png"
        water_mask = folder / f"{tile}_water_mask.png"
        convert(water_src, water_tmp)
        magick_run(
            ["convert", water_tmp, "-draw", "point 1,1", "-fill", "black", water_tmp]
        )
        magick_run(["convert", "-negate", water_tmp, "-threshold", "1%%", water_mask])
        magick_run(["convert", water_mask, "-transparent", "black", water_mask])
        # 'river' to mask
        river_src = folder / f"{tile}_river.png"
        river_tmp = folder / f"{tile}_river_temp.png"
        river_mask = folder / f"{tile}_river_mask.png"
        convert(river_src, river_tmp)
        magick_run(
            ["convert", river_tmp, "-draw", "point 1,1", "-fill", "black", river_tmp]
        )
        magick_run(["convert", "-negate", river_tmp, "-threshold", "1%%", river_mask])
        magick_run(["convert", river_mask, "-transparent", "black", river_mask])
        # combine masks into transparent overlay
        water_trans = folder / f"{tile}_water_transparent.png"
        magick_run(
            ["composite", "-gravity", "center", water_mask, river_mask, water_trans]
        )
        # heightmap edge fill
        hdir = folder / "heightmap"
        h_edges = hdir / f"{tile}_edges.png"
        h_valid_removed = hdir / f"{tile}_removed_invalid.png"
        h_filled = hdir / f"{tile}_invalid_filled.png"
        supported = folder / f"{tile}_height_supported.png"
        flats = folder / f"{tile}_flats_processed.png"
        terrain_reduced = folder / f"{tile}_terrain_reduced_colors.png"
        # 16-bit, remove black transparency; optionally fill holes via morphology
        magick_run(
            [
                "convert",
                hdir / f"{tile}_exported.png",
                "-transparent",
                "black",
                "-depth",
                "16",
                h_valid_removed,
            ]
        )
        magick_run(
            [
                "convert",
                h_valid_removed,
                "-channel",
                "A",
                "-morphology",
                "EdgeIn",
                "Diamond",
                "-depth",
                "16",
                h_edges,
            ]
        )
        # Downsample-deduplicate smooth
        cond = (
            ["("]
            + ["+clone", "-resize", "50%%"] * 10
            + [
                "-layers",
                "RemoveDups",
                "-filter",
                "Gaussian",
                "-resize",
                f"{bpt}x{bpt}!",
                "-reverse",
                "-background",
                "None",
                "-flatten",
                "-alpha",
                "off",
                ")",
            ]
        )
        cmd = ["convert", h_edges] + cond + ["-depth", "16", h_filled]
        magick_run(cmd)
        # composite support map (land/water mask) over height
        magick_run(
            ["composite", "-gravity", "center", water_trans, h_filled, supported]
        )
        # Mask out deep water on flats
        flats_src = folder / f"{tile}_flats.png"
        flats_masked = folder / f"{tile}_flats_masked.png"
        magick_run(
            ["composite", "-gravity", "center", flats_src, water_trans, flats_masked]
        )
        # Replace flats in alpha channel
        magick_run(
            [
                "convert",
                supported,
                flats_masked,
                "-compose",
                "CopyOpacity",
                "-composite",
                flats,
            ]
        )
        # Reduce colors if using HQ terrain
        if cfg.use_heigh_quality_terrain:
            magick_run(
                [
                    "convert",
                    folder / f"{tile}_terrain.png",
                    "+dither",
                    "-colors",
                    "256",
                    terrain_reduced,
                ]
            )

    with ProcessPoolExecutor(max_workers=cfg.threads) as pool:
        futs = [pool.submit(_pipe, tile) for tile in work]
        for f in as_completed(futs):
            try:
                f.result()
            except Exception as e:
                logger.error("Magick tile processing failed: %s", e)
                raise
    logger.info("ImageMagick conversions completed")
