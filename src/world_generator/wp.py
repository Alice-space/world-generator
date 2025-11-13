from __future__ import annotations

import logging
import os
import subprocess
from pathlib import Path
from typing import Optional
from .tileops import calculate_tiles

logger = logging.getLogger(__name__)


class WorldPainterScriptNotFound(Exception):
    pass


def worldpaint(
    tile: str,
    degree_per_tile: int,
    blocks_per_tile: int,
    height_ratio: int,
    scripts_folder: Path,
) -> None:
    scriptjs = Path(scripts_folder, "wpscript.js")
    if not scriptjs.exists():
        raise WorldPainterScriptNotFound(f"Missing script: {scriptjs}")
    world_path = Path(scripts_folder, "wpscript", "worldpainter_files", f"{tile}.world")
    if world_path.exists():
        logger.info("Skipping WorldPainter for %s (already done)", tile)
        return

    # Translate tile id to arguments expected by the legacy script
    dir_lat = tile[0:1]
    lat = str(int(tile[1:3]))
    dir_lon = tile[3:4]
    lon = str(int(tile[4:7]))

    args = [
        "wpscript",
        str(scriptjs),
        str(scripts_folder),
        dir_lat, lat, dir_lon, lon,
        str(blocks_per_tile),
        str(degree_per_tile),
        str(height_ratio),
        # Switches mapped from legacy defaults (kept for compatibility)
        "True",  # borders
        "False",  # stateborders
        "False",  # highways
        "False",  # streets
        "False",  # small streets
        "False",  # buildings
        "False",  # ores
        "False",  # netherite
        "True",  # farms
        "True",  # meadows
        "True",  # quarrys
        "False",  # aerodrome
        "True",  # mob spawner
        "True",  # animal spawner
        "True",  # rivers
        "False",  # streams
        "True",  # volcanos
        "True",  # shrubs
        "True",  # crops
        "1-19",  # map version
        "0",  # map offset
        "-64",  # lower build limit
        "2032",  # upper build limit
        "True",  # vanilla population
        tile,  # heightmap name placeholder (used by script)
        "ecoregions",  # biomeSource
        "8",  # oreModifier
        "False",  # mod_BOP
        "False",  # mod_BYG
        "False",  # mod_Terralith
        "False",  # mod_williamWythers
        "False",  # mod_Create
    ]

    logger.info("Running WorldPainter for %s (args=%d)", tile, len(args))
    cp = subprocess.run(args, capture_output=True, text=True)
    logger.info("WorldPainter stdout: %s", cp.stdout)
    if cp.stderr:
        logger.error("WorldPainter stderr: %s", cp.stderr)
    if cp.returncode != 0:
        raise RuntimeError(f"wpscript failed for {tile}")

    # Generate minutor preview
    p = Path(scripts_folder, "render")
    p.mkdir(parents=True, exist_ok=True)
    exports = Path(scripts_folder, "wpscript", "exports", tile)
    preview = Path(scripts_folder, "render", f"{tile}.png")
    if exports.is_dir():
        cp2 = subprocess.run([
            "minutor", "--world", str(exports), "--depth", "319", "--savepng", str(preview)
        ], capture_output=True, text=True)
        logger.debug("Minutor stdout: %s", cp2.stdout)
        if cp2.stderr:
            logger.warning("Minutor stderr: %s", cp2.stderr)
    else:
        logger.warning("World export dir missing, skipping minutor preview: %s", exports)
    logger.info("WorldPainter for %s done", tile)


def post_merge(scripts_folder: Path, world_name: str) -> Path:
    final = Path(scripts_folder, world_name)
    final.mkdir(parents=True, exist_ok=True)
    region = Path(final, "region")
    region.mkdir(exist_ok=True)
    exports = Path(scripts_folder, "wpscript", "exports")
    for tile_dir in exports.iterdir():
        t_region = Path(tile_dir, "region")
        if not t_region.is_dir():
            continue
        for mca in t_region.glob("*.mca"):
            # Overwrites on duplication; preserves basenames at world region level
            import shutil
            shutil.copy2(mca, region / mca.name)
    # Run minutor on final world
    png = Path(scripts_folder, f"{world_name}.png")
    if region.glob("*.mca"):
        try:
            cp = subprocess.run([
                "minutor", "--world", str(final), "--depth", "319", "--savepng", str(png)
            ], capture_output=True, text=True, check=True)
            logger.info("Minutor final output: %s", cp.stdout)
        except Exception as e:
            logger.error("Failed to run minutor on final world: %s", e)
            logger.error("Command stderr: %s", getattr(e, "stderr", ""))
    return final

