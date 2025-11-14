"""OSM preprocessing stage."""

from __future__ import annotations

from pathlib import Path

from ..adapters.osm import ALL_OSM_FILES, OSMPreprocessor
from ..core.settings import Config


def stage_osm_preprocess(cfg: Config) -> None:
    osm_all = Path(cfg.osm_folder_path, "all")
    osm_all.mkdir(parents=True, exist_ok=True)

    osm_files_exist = all(
        osm_all.joinpath(f"{name}.osm").exists() for name in ALL_OSM_FILES
    )
    if osm_files_exist:
        print("OSM files already exist; skipping preprocessing")
        return

    print("Starting OSM preprocessing ...")
    with OSMPreprocessor(osm_all) as proc:
        proc.apply_file(str(cfg.pbf_path))
    print("OSM preprocessing completed")
