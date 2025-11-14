"""WorldPainter automation helpers."""

import logging
import multiprocessing as mp
import subprocess

import pebble

from .config import GeneratorConfig
from .tools import calculateTiles

logger = logging.getLogger(__name__)


def run_world_painter(config: GeneratorConfig, tile: str) -> None:
    logger.info("WorldPainter for %s", tile)
    scripts_folder = config.scripts_folder_path
    script_js = scripts_folder / "wpscript.js"

    exports_folder = scripts_folder / "wpscript" / "exports" / tile
    world_file = scripts_folder / "wpscript" / "worldpainter_files" / f"{tile}.world"
    world_file.parent.mkdir(parents=True, exist_ok=True)
    exports_folder.parent.mkdir(parents=True, exist_ok=True)
    if world_file.exists():
        logger.info("Skipping WorldPainter for %s", tile)
        return

    args = [
        "wpscript",
        str(script_js),
        str(scripts_folder),
        tile[0:1],
        str(int(tile[1:3])),
        tile[3:4],
        str(int(tile[4:7])),
        str(config.blocks_per_tile),
        str(config.degree_per_tile),
        str(config.height_ratio),
        "True",
        "False",
        "False",
        "False",
        "False",
        "False",
        "False",
        "True",
        "True",
        "True",
        "True",
        "False",
        "True",
        "True",
        "True",
        "False",
        "True",
        "True",
        "True",
        "1-19",
        "0",
        "-64",
        "2032",
        "True",
        tile,
        "ecoregions",
        "8",
        "False",
        "False",
        "False",
        "False",
        "False",
    ]
    result = subprocess.run(args, capture_output=True, text=True)
    logger.info("WorldPainter for %s output: %s", tile, result.stdout.strip())
    if result.stderr.strip():
        logger.error("WorldPainter for %s error: %s", tile, result.stderr.strip())

    minutor_png = scripts_folder / "render" / f"{tile}.png"
    (scripts_folder / "render").mkdir(parents=True, exist_ok=True)
    render_result = subprocess.run(
        [
            "minutor",
            "--world",
            str(exports_folder),
            "--depth",
            "319",
            "--savepng",
            str(minutor_png),
        ],
        capture_output=True,
        text=True,
    )
    logger.info("minutor for %s output: %s", tile, render_result.stdout.strip())
    if render_result.stderr.strip():
        logger.error("minutor for %s error: %s", tile, render_result.stderr.strip())


def wp_generate(config: GeneratorConfig) -> None:
    degree_per_tile = config.degree_per_tile
    pool = pebble.ProcessPool(
        max_workers=config.threads,
        max_tasks=1,
        context=mp.get_context("forkserver"),
    )
    for x_min in range(-180, 180, degree_per_tile):
        for y_min in range(-90, 90, degree_per_tile):
            tile = calculateTiles(x_min, y_min + degree_per_tile)
            pool.schedule(run_world_painter, [config, tile])
    pool.close()
    pool.join()
    logger.info("All WorldPainter jobs completed")


__all__ = ["run_world_painter", "wp_generate"]
