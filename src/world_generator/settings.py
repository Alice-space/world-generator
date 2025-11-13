from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Any
import yaml
from .types import OSMSwitch


@dataclass
class Config:
    pbf_path: Path
    osm_folder_path: Path
    qgis_project_path: Path
    scripts_folder_path: Path
    qgis_bathymetry_project_path: Path
    qgis_terrain_project_path: Path
    qgis_heightmap_project_path: Path
    use_heigh_quality_terrain: bool
    world_name: str
    blocks_per_tile: int
    degree_per_tile: int
    height_ratio: int
    threads: int
    osm_switch: OSMSwitch
    rivers: str

    @classmethod
    def from_file(cls, path: Path | str) -> Config:
        _path = Path(path).expanduser().resolve()
        if not _path.exists():
            raise FileNotFoundError(f"Config file not found: {_path}")
        with _path.open('r', encoding='utf-8') as f:
            data: Dict[str, Any] = yaml.safe_load(f)
        # Minimal validation
        for field in cls.__dataclass_fields__:
            if field not in data:
                raise KeyError(f"Missing required config key: {field}")
        # Coerce string paths to Path
        for key in [
            "pbf_path",
            "osm_folder_path",
            "qgis_project_path",
            "scripts_folder_path",
            "qgis_bathymetry_project_path",
            "qgis_terrain_project_path",
            "qgis_heightmap_project_path",
        ]:
            if key in data and isinstance(data[key], str):
                data[key] = Path(os.path.expandvars(data[key]))
        return cls(**data)  # type: ignore[arg-type]

