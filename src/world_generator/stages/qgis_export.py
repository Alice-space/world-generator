"""QGIS raster export stage."""

from __future__ import annotations

import logging
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path
from typing import TYPE_CHECKING, MutableMapping

from ..adapters.qgis import export_image
from ..core.settings import Config
from ..utils.tiles import calculate_tiles

if TYPE_CHECKING:
    from typing import Any  # pragma: no cover

logger = logging.getLogger(__name__)

LAYER_NAMES: MutableMapping[str, tuple[str, ...]] = {
    "slope": ("slope",),
    "landuse": ("landuse",),
    "water": ("water",),
    "river": ("rivers",),
}


def _tiles_x_chunks(threads: int) -> list[tuple[int, int]]:
    # Heuristic: split x coordinate into roughly sqrt(threads) blocks
    import math

    degree_per_tile = 2
    x_range = range(-180, 180, degree_per_tile)
    num_x = len(x_range)
    if threads <= 1:
        return [(0, num_x)]
    bins = max(1, int(math.sqrt(threads)))
    chunk_size = max(1, num_x // bins)
    chunks: list[tuple[int, int]] = []
    for i in range(0, num_x, chunk_size):
        chunks.append((i, min(i + chunk_size, num_x)))
    return chunks


def stage_qgis_export(cfg: Config) -> None:
    out_root = Path(cfg.scripts_folder_path, "image_exports")
    hdir = Path(cfg.scripts_folder_path, "image_exports")
    if hdir.exists():
        logger.info("Image export folder exists; skipping")
        return

    out_root.mkdir(parents=True, exist_ok=True)
    logger.info("Exporting rasters from QGIS")
    # Use the same tiling range as original for compatibility
    degree_per_tile = 2
    y_range = range(90, -90, -degree_per_tile)
    x_chunks = _tiles_x_chunks(cfg.threads)
    keys = ["slope", "landuse", "water", "river"]
    with ProcessPoolExecutor(max_workers=cfg.threads) as pool:
        futures = []
        for k in keys:
            project_attr = "qgis_bathymetry_project_path" if k == "slope" else None
            if k == "landuse":
                project_attr = "qgis_project_path"
            elif k == "water":
                project_attr = "qgis_terrain_project_path"
            elif k == "river":
                # Use terrain project for rivers if not explicitly provided
                project_attr = "qgis_terrain_project_path"
            proj_path = getattr(cfg, project_attr)
            layers = LAYER_NAMES.get(k, ())
            if not layers:
                logger.warning("No layer configured for %s, skipping", k)
                continue
            # Fire export jobs per-chunk for this layer
            for x_start, x_end in x_chunks:
                futures.append(
                    pool.submit(
                        export_image,
                        proj_path,
                        cfg.blocks_per_tile,
                        cfg.degree_per_tile,
                        x_start * degree_per_tile - 180,
                        x_end * degree_per_tile - 180,
                        y_range[0],
                        y_range[-1],
                        k,
                        layers,
                    )
                )
        for f in as_completed(futures):
            f.result()
    logger.info("QGIS export completed")
