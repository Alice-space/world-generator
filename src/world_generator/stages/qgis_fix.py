"""QGIS geometry fixing stage."""

from __future__ import annotations

import logging
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path
from typing import MutableMapping

from ..adapters.osm import OSM_POSTFIX
from ..adapters.qgis import fix_geometry
from ..core.log import setup_logging
from ..core.settings import Config

logger = logging.getLogger(__name__)


LAYER_NAMES: MutableMapping[str, tuple[str, ...]] = {
    "slope": ("slope",),
    "landuse": ("landuse",),
    "water": ("water",),
    "river": ("rivers",),
}


def _fix(output_name: str, osm_all: Path, cfg: Config) -> None:
    source_file = Path(osm_all, OSM_POSTFIX[output_name][0] + ".osm")
    out_shp = Path(osm_all, f"{output_name}.shp")
    if out_shp.exists():
        return
    params = {
        "INPUT": str(source_file) + OSM_POSTFIX[output_name][1],
        "OUTPUT": str(out_shp),
    }
    fix_geometry(cfg.qgis_project_path, "native:fixgeometries", params)
    print(f"Fixed geometry {output_name} -> {out_shp}")


def stage_qgis_fix_geometries(cfg: Config) -> None:
    osm_all = Path(cfg.osm_folder_path, "all")
    all_exist = all(osm_all.joinpath(f"{name}.shp").exists() for name in OSM_POSTFIX)
    if all_exist:
        print("QGIS shapefiles already exist; skipping fix")
        return

    print("Fixing geometries with QGIS ...")
    with ProcessPoolExecutor(max_workers=cfg.threads) as pool:
        futures = [pool.submit(_fix, name, osm_all, cfg) for name in OSM_POSTFIX]
        for f in as_completed(futures):
            f.result()
    print("QGIS fix geometries completed")
