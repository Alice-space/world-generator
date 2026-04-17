"""Typed configuration loading utilities for the world generator."""

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Mapping, MutableMapping

import yaml

CONFIG_ENV_VAR = "WORLD_GENERATOR_CONFIG"
PACKAGE_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SCRIPTS_FOLDER = (PACKAGE_ROOT / "Data").resolve()

SUPPORTED_VECTOR_DRIVERS = {
    "ESRI Shapefile": ".shp",
    "GPKG": ".gpkg",
}
VECTOR_DRIVER_ALIASES = {
    "shp": "ESRI Shapefile",
    "esri shapefile": "ESRI Shapefile",
    "shapefile": "ESRI Shapefile",
    "gpkg": "GPKG",
    "geopackage": "GPKG",
}
DEFAULT_VECTOR_DRIVER = "GPKG"


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

    # === 路径配置 ===
    pbf_path: Path
    osm_folder_path: Path
    qgis_project_path: Path
    scripts_folder_path: Path
    qgis_bathymetry_project_path: Path
    qgis_terrain_project_path: Path
    qgis_heightmap_project_path: Path

    # === 世界参数 ===
    use_high_quality_terrain: bool
    world_name: str
    blocks_per_tile: int
    degree_per_tile: int
    height_ratio: int
    threads: int

    # === 图层开关 ===
    osm_switch: Mapping[str, bool]
    rivers: str
    vector_driver: str

    # === 图像导出（GDAL）===
    # gdal_translate 高程缩放：源数据海拔范围（单位：米）
    gdal_elevation_min: int = -1152
    gdal_elevation_max: int = 8848
    # gdal_translate 输出像素值范围（UInt16 格式：0–65535）
    gdal_output_min: int = 0
    gdal_output_max: int = 65535

    # === 图像后处理（ImageMagick）===
    # 水体/河流遮罩二值化阈值（百分比，1 = 几乎全黑像素被标记为遮罩）
    magick_water_threshold_pct: float = 1.0
    # 高程插值金字塔层数（用于填充无效像素），越多精度越高但速度越慢
    magick_pyramid_levels: int = 10
    # 高程金字塔缩放滤波器（Gaussian 最平滑；可选 Lanczos、Cubic 等）
    magick_pyramid_filter: str = "Gaussian"
    # 形态学运算结构元素（Diamond 为4邻域；可选 Disk、Square 等）
    magick_morphology_kernel: str = "Diamond"
    # 最终地形图模糊半径（像素），用于平滑高程噪点；0 表示不模糊
    magick_terrain_blur_radius: int = 5
    # 水体填充电平微调，将接近黑色的像素轻微提亮以避免零海拔异常（百分比）
    magick_water_level_adjust_pct: float = 0.002
    # 气候图缩放比例（先缩小再放大以平滑像素化效果，单位：%）
    magick_climate_sample_pct: float = 50.0
    # 海洋温度图缩放比例（先缩小再三次放大；比例 = 1/8 = 12.5%）
    magick_ocean_temp_sample_pct: float = 12.5
    # 海洋温度图放大次数（magnify 操作执行次数，每次×2）
    magick_ocean_temp_magnify_times: int = 3
    # 地形调色板文件相对路径（相对于 scripts_folder_path）
    magick_terrain_palette_rel_path: str = "wpscript/terrain/Standard.png"

    # === WorldPainter ===
    # Minecraft 世界版本层范围（用于 wpscript.js 的 --version 参数）
    wp_version_range: str = "1-19"
    # 海平面高度（Minecraft 方块坐标，Java版默认为 63）
    wp_sea_level: int = 0
    # 世界最低高度（方块坐标；Java 1.18+ 为 -64）
    wp_min_height: int = -64
    # 世界最高高度（方块坐标；Java 1.18+ 为 2032）
    wp_max_height: int = 2032
    # 生物群系分配模式（ecoregions = WWF生态区；可选 climate 等）
    wp_biome_mode: str = "ecoregions"
    # 生物群系分配精细度（ecoregion 数量分区；8 = 平衡精度与性能）
    wp_biome_precision: int = 8

    # === Minutor 渲染 ===
    # Minutor 截图时的 Y 轴深度（方块坐标；319 为 Java 1.18+ 地表上限）
    minutor_depth: int = 319

    # === 性能优化开关 ===
    # 启用按瓦片流水线模式（T003）：image_export 完成后，magick+wp 按瓦片并行执行
    # False = 旧模式（magick 全量完成后再串行调用 wp_generate）
    tile_pipeline_mode: bool = False

    @property
    def osm_data_dir(self) -> Path:
        return self.osm_folder_path / "all"

    @property
    def vector_file_suffix(self) -> str:
        return SUPPORTED_VECTOR_DRIVERS[self.vector_driver]

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

    @property
    def magick_terrain_palette_path(self) -> Path:
        return self.scripts_folder_path / self.magick_terrain_palette_rel_path


def _coerce_bool(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() in {"1", "true", "t", "yes", "y", "on"}
    return bool(value)


def _normalize_vector_driver(value: Any) -> str:
    if value is None:
        return DEFAULT_VECTOR_DRIVER
    candidate = str(value).strip()
    if not candidate:
        return DEFAULT_VECTOR_DRIVER
    normalized = VECTOR_DRIVER_ALIASES.get(candidate.lower(), candidate)
    if normalized not in SUPPORTED_VECTOR_DRIVERS:
        supported = ", ".join(SUPPORTED_VECTOR_DRIVERS)
        raise ValueError(
            f"Unsupported vector driver '{value}'. Choose one of: {supported}"
        )
    return normalized


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
    vector_driver = _normalize_vector_driver(raw.get("vector_driver"))

    scripts_folder_raw = raw.get("scripts_folder_path")
    if scripts_folder_raw is None:
        scripts_folder_path = DEFAULT_SCRIPTS_FOLDER
    else:
        scripts_folder_path = _expand_path(str(scripts_folder_raw))

    # 读取新增可选配置项，全部提供合理默认值以保持向后兼容
    _defaults = GeneratorConfig.__dataclass_fields__

    def _opt_int(key: str) -> int | None:
        v = raw.get(key)
        return int(v) if v is not None else None

    def _opt_float(key: str) -> float | None:
        v = raw.get(key)
        return float(v) if v is not None else None

    def _opt_str(key: str) -> str | None:
        v = raw.get(key)
        return str(v) if v is not None else None

    def _get_int(key: str) -> int:
        v = _opt_int(key)
        return v if v is not None else int(_defaults[key].default)

    def _get_float(key: str) -> float:
        v = _opt_float(key)
        return v if v is not None else float(_defaults[key].default)

    def _get_str(key: str) -> str:
        v = _opt_str(key)
        return v if v is not None else str(_defaults[key].default)

    return GeneratorConfig(
        pbf_path=_expand_path(str(require("pbf_path"))),
        osm_folder_path=_expand_path(str(require("osm_folder_path"))),
        qgis_project_path=_expand_path(str(require("qgis_project_path"))),
        scripts_folder_path=scripts_folder_path,
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
        vector_driver=vector_driver,
        # 图像导出（GDAL）
        gdal_elevation_min=_get_int("gdal_elevation_min"),
        gdal_elevation_max=_get_int("gdal_elevation_max"),
        gdal_output_min=_get_int("gdal_output_min"),
        gdal_output_max=_get_int("gdal_output_max"),
        # 图像后处理（ImageMagick）
        magick_water_threshold_pct=_get_float("magick_water_threshold_pct"),
        magick_pyramid_levels=_get_int("magick_pyramid_levels"),
        magick_pyramid_filter=_get_str("magick_pyramid_filter"),
        magick_morphology_kernel=_get_str("magick_morphology_kernel"),
        magick_terrain_blur_radius=_get_int("magick_terrain_blur_radius"),
        magick_water_level_adjust_pct=_get_float("magick_water_level_adjust_pct"),
        magick_climate_sample_pct=_get_float("magick_climate_sample_pct"),
        magick_ocean_temp_sample_pct=_get_float("magick_ocean_temp_sample_pct"),
        magick_ocean_temp_magnify_times=_get_int("magick_ocean_temp_magnify_times"),
        magick_terrain_palette_rel_path=_get_str("magick_terrain_palette_rel_path"),
        # WorldPainter
        wp_version_range=_get_str("wp_version_range"),
        wp_sea_level=_get_int("wp_sea_level"),
        wp_min_height=_get_int("wp_min_height"),
        wp_max_height=_get_int("wp_max_height"),
        wp_biome_mode=_get_str("wp_biome_mode"),
        wp_biome_precision=_get_int("wp_biome_precision"),
        # Minutor 渲染
        minutor_depth=_get_int("minutor_depth"),
        # 性能优化
        tile_pipeline_mode=_coerce_bool(raw.get("tile_pipeline_mode", False)),
    )


__all__ = ["GeneratorConfig", "load_config", "CONFIG_ENV_VAR"]
