"""Typed configuration loading utilities for the world generator."""

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Mapping, MutableMapping

import yaml

CONFIG_ENV_VAR = "WORLD_GENERATOR_CONFIG"
PACKAGE_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SCRIPTS_FOLDER = (PACKAGE_ROOT / "Data").resolve()


def _expand_path(value: str) -> Path:
    """Normalize user provided paths.

    - Expand user home and environment variables.
    - If the resulting path is relative, resolve it against the current working
    directory (pwd). This supports writing relative paths like
    "Data/qgis-project/QGIS/project.qgz" in config.yaml.
    """
    expanded = os.path.expandvars(str(Path(value).expanduser()))
    path_obj = Path(expanded)
    if not path_obj.is_absolute():
        # Anchor relative paths to pwd, consistent with user expectation
        path_obj = Path.cwd() / path_obj
    # Final resolve to normalize: handle ".." and symlinks if possible.
    # We don't set strict=True here to avoid errors when the target does not
    # exist yet (e.g., output paths which will be created by the pipeline).
    return path_obj.resolve()


@dataclass(frozen=True)
class GeneratorConfig:
    """Strongly typed representation of the YAML config file."""

    pbf_path: Path
    osm_folder_path: Path
    qgis_project_path: Path
    scripts_folder_path: Path
    qgis_bathymetry_project_path: Path
    qgis_terrain_project_path: Path
    qgis_heightmap_project_path: Path
    use_high_quality_terrain: bool
    world_name: str
    blocks_per_tile: int
    degree_per_tile: int
    height_ratio: int
    threads: int
    osm_switch: Mapping[str, bool]
    rivers: str

    @property
    def osm_data_dir(self) -> Path:
        return self.osm_folder_path / "all"

    @property
    def image_exports_dir(self) -> Path:
        return self.scripts_folder_path / "image_exports"

    @property
    def world_output_dir(self) -> Path:
        return self.scripts_folder_path / self.world_name

    @property
    def heightmap_input_path(self) -> Path:
        qgis_dir = self.qgis_heightmap_project_path.parent
        return qgis_dir / "TifFiles" / "HQheightmap.tif"


def _coerce_bool(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() in {"1", "true", "t", "yes", "y", "on"}
    return bool(value)


def _load_raw_config(config_path: Path) -> MutableMapping[str, Any]:
    try:
        with config_path.open(encoding="utf-8") as stream:
            data = yaml.safe_load(stream) or {}
    except FileNotFoundError as exc:  # pragma: no cover - protective branch
        raise FileNotFoundError(
            f"Config file not found at {config_path}. "
            "Create one based on config.example.yaml"
        ) from exc
    if not isinstance(data, MutableMapping):
        raise ValueError("Configuration root must be a mapping")
    return data


def load_config(config_path: str | Path | None = None) -> GeneratorConfig:
    """Load and validate generator configuration."""

    if config_path is None:
        env_path = os.getenv(CONFIG_ENV_VAR)
        if env_path:
            config_path = env_path
    path = (
        _expand_path(str(config_path)) if config_path else Path("config.yaml").resolve()
    )
    raw = _load_raw_config(path)

    def require(key: str) -> Any:
        if key not in raw:
            raise KeyError(f"Missing required config key: {key}")
        return raw[key]

    osm_switch_raw = raw.get("osm_switch", {})
    if not isinstance(osm_switch_raw, Mapping):
        raise TypeError("osm_switch must be a mapping of layer toggles")
    osm_switch = {str(k): _coerce_bool(v) for k, v in osm_switch_raw.items()}
    use_high_quality = raw.get("use_high_quality_terrain")
    if use_high_quality is None:
        use_high_quality = raw.get("use_heigh_quality_terrain", False)

    return GeneratorConfig(
        pbf_path=_expand_path(str(require("pbf_path"))),
        osm_folder_path=_expand_path(str(require("osm_folder_path"))),
        qgis_project_path=_expand_path(str(require("qgis_project_path"))),
        scripts_folder_path=DEFAULT_SCRIPTS_FOLDER,
        qgis_bathymetry_project_path=_expand_path(
            str(require("qgis_bathymetry_project_path"))
        ),
        qgis_terrain_project_path=_expand_path(
            str(require("qgis_terrain_project_path"))
        ),
        qgis_heightmap_project_path=_expand_path(
            str(require("qgis_heightmap_project_path"))
        ),
        use_high_quality_terrain=_coerce_bool(use_high_quality),
        world_name=str(require("world_name")),
        blocks_per_tile=int(require("blocks_per_tile")),
        degree_per_tile=int(require("degree_per_tile")),
        height_ratio=int(require("height_ratio")),
        threads=int(require("threads")),
        osm_switch=osm_switch,
        rivers=str(require("rivers")),
    )


__all__ = ["GeneratorConfig", "load_config", "CONFIG_ENV_VAR"]
