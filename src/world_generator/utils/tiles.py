from __future__ import annotations

import logging
from pathlib import Path
from typing import Iterator

logger = logging.getLogger(__name__)


def calculate_tiles(x_min: float, y_max: float) -> str:
    long_number = abs(x_min) if x_min <= 0 else x_min
    lat_number = (abs(y_max) + 1) if y_max <= 0 else y_max - 1
    long_dir = "E" if x_min >= 0 else "W"
    lat_dir = "S" if y_max <= 0 else "N"
    return f"{lat_dir}{lat_number:02}{long_dir}{long_number:03}"


def iter_tiles() -> Iterator[tuple[int, int, str]]:
    degree_per_tile = 2
    for x in range(-180, 180, degree_per_tile):
        for y in range(-90, 90, degree_per_tile):
            tile = calculate_tiles(x, y + degree_per_tile)
            yield x, y, tile


def deliver_osm_inputs(
    osm_all: Path, scripts_path: Path, switches: dict[str, bool]
) -> None:
    dest = Path(Path(scripts_path).parent, "OsmData")
    dest.mkdir(parents=True, exist_ok=True)
    for p in osm_all.iterdir():
        name = p.stem
        if not switches.get(name, False):
            logger.info("Skipping %s (disabled by config)", p.name)
            continue
        target = dest / p.name
        if target.exists():
            continue
        # Prefer symlinks; fallback to copy on Windows
        try:
            target.symlink_to(p)
        except (OSError, NotImplementedError):
            import shutil

            shutil.copy2(p, target)
    logger.info("OSM inputs linked to %s", dest)
