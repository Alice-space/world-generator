"""Image export helpers driven by QGIS projects."""

import logging
import multiprocessing as mp
import subprocess
from logging import FileHandler, StreamHandler
from pathlib import Path

import pebble

from .config import GeneratorConfig
from .qgiscontroller import export_image
from .tools import calculateTiles

logger = logging.getLogger(__name__)

HEIGHT_LAYER_NAMES: dict[str, tuple[str, ...]] = {
    "": ("heightmap_source", "heightmap_land_polygons", "heightmap_background")
}

BATHYMETRY_LAYER_NAMES: dict[str, tuple[str, ...]] = {
    "bathymetry": (
        "land_polygons",
        "bathymetry_source",
        "background_bathymetry",
    )
}

DEFAULT_TERRAIN_LAYERS: dict[str, tuple[str, ...]] = {"terrain": ("TrueMarble",)}

BASE_LAYER_NAMES: dict[str, tuple[str, ...]] = {
    "slope": ("slope",),
    "landuse": ("landuse",),
    "water": ("water",),
    "river": ("rivers_small",),
    "wet": ("wet_glacier", "wet_swamp"),
    "road": ("road",),
    "climate": ("climate",),
    "ecoregions": ("wwf_terr_ecos",),
    "pine": ("EvergreenDeciduousNeedleleafTrees", "vegetation_background"),
    "mixed": ("mixedTrees", "vegetation_background"),
    "deciduous": ("DeciduousBroadleafTrees", "vegetation_background"),
    "jungle": ("EvergreenBroadleafTrees", "vegetation_background"),
    "shrubs": ("Shrubs", "vegetation_background"),
    "herbs": ("HerbaceousVegetation", "vegetation_background"),
    "wither_rose": ("halfeti_rose",),
    "snow": ("Snow", "vegetation_background"),
    "groundcover": ("groundcover",),
    "border": ("cntryCurrent",),
    "stateborder": ("stateBorder",),
    "corals": ("corals",),
    "stream": ("stream",),
    "ocean_temp": ("ocean_temp",),
    "longitude": ("longitude",),
    "latitude": ("latitude",),
    "aerodrome": ("aerodrome",),
    "easter_eggs": ("easter_egg",),
}

ORES = [
    "aluiminum",
    "antimony",
    "barite",
    "chromium",
    "clay",
    "coal",
    "cobalt",
    "copper",
    "diamond",
    "gold",
    "graphite",
    "iron",
    "lead",
    "limestone",
    "lithium",
    "magnasium",
    "manganese",
    "molybdenum",
    "netherite",
    "nickel",
    "niobium",
    "phosphate",
    "platinum",
    "quartz",
    "redstone",
    "salt",
    "silver",
    "sulfur",
    "tin",
    "titanium",
    "tungsten",
    "uranium",
    "zinc",
    "zirconium",
]


def _dynamic_layer_names(config: GeneratorConfig) -> dict[str, tuple[str, ...]]:
    layers = dict(BASE_LAYER_NAMES)
    layers["river"] = (config.rivers,)
    for ore in ORES:
        layers[ore] = (f"{ore}_ores",)
    return layers


def _terrain_layer_names(config: GeneratorConfig) -> dict[str, tuple[str, ...]]:
    layers = dict(DEFAULT_TERRAIN_LAYERS)
    if not config.use_high_quality_terrain:
        layers["terrain"] = ("backupterrain",)
    return layers


# -- Logging helpers ---------------------------------------------------------

_LOG_FORMAT = "%(asctime)s - %(levelname)s - %(name)s - %(message)s"


def _gather_logging_targets() -> tuple[list[Path], bool, int]:
    """Collect log destinations from the parent process.

    We cannot share handler instances across processes (they are not picklable),
    so we record their parameters and recreate them inside worker processes.
    """
    files: list[Path] = []
    mirror_console = False
    root = logging.getLogger()
    for handler in root.handlers:
        if isinstance(handler, FileHandler):
            files.append(Path(handler.baseFilename))
        elif isinstance(handler, StreamHandler):
            mirror_console = True
    return files, mirror_console, root.level or logging.INFO


def _init_worker_logging(
    log_files: list[Path], mirror_console: bool, level: int
) -> None:
    """Configure logging inside worker processes to mirror the parent."""
    handlers: list[logging.Handler] = []
    for path in log_files:
        # Each worker opens its own handle to avoid cross-process contention issues.
        handlers.append(FileHandler(path))
    if mirror_console:
        handlers.append(StreamHandler())
    logging.basicConfig(level=level, format=_LOG_FORMAT, handlers=handlers or None)


def _schedule_layer_exports(
    config: GeneratorConfig,
    project_path: Path,
    layer_map: dict[str, tuple[str, ...]],
    degree_per_tile: int,
    blocks_per_tile: int,
    x_min_list: list[int],
    x_max_list: list[int],
) -> None:
    log_files, mirror_console, log_level = _gather_logging_targets()
    for name, layers in layer_map.items():
        pool = pebble.ProcessPool(
            max_workers=config.threads,
            max_tasks=1,
            context=mp.get_context("forkserver"),
            initializer=_init_worker_logging,
            initargs=[log_files, mirror_console, log_level],
        )
        for idx in range(config.threads):
            pool.schedule(
                export_image,
                [
                    config,
                    str(project_path),
                    blocks_per_tile,
                    degree_per_tile,
                    x_min_list[idx],
                    x_max_list[idx],
                    -90,
                    90,
                    name,
                    layers,
                ],
            )
        pool.close()
        pool.join()


def image_export(config: GeneratorConfig) -> None:
    image_output_folder = config.image_exports_dir
    image_output_folder.mkdir(parents=True, exist_ok=True)

    degree_per_tile = config.degree_per_tile
    blocks_per_tile = config.blocks_per_tile
    logger.info("Image export started")

    x_range_per_thread = 360 / config.threads
    x_min_list = [int(-180 + x_range_per_thread * i) for i in range(config.threads)]
    x_max_list = [
        int(-180 + x_range_per_thread * (i + 1)) for i in range(config.threads)
    ]
    x_max_list[-1] = 180

    dynamic_layers = _dynamic_layer_names(config)

    if config.use_high_quality_terrain:
        _schedule_layer_exports(
            config,
            config.qgis_terrain_project_path,
            _terrain_layer_names(config),
            degree_per_tile,
            blocks_per_tile,
            x_min_list,
            x_max_list,
        )

    _schedule_layer_exports(
        config,
        config.qgis_project_path,
        dynamic_layers,
        degree_per_tile,
        blocks_per_tile,
        x_min_list,
        x_max_list,
    )

    _schedule_layer_exports(
        config,
        config.qgis_bathymetry_project_path,
        BATHYMETRY_LAYER_NAMES,
        degree_per_tile,
        blocks_per_tile,
        x_min_list,
        x_max_list,
    )

    _schedule_layer_exports(
        config,
        config.qgis_heightmap_project_path,
        HEIGHT_LAYER_NAMES,
        degree_per_tile,
        blocks_per_tile,
        x_min_list,
        x_max_list,
    )

    logger.info("Image export completed, running gdal_translate")
    log_files, mirror_console, log_level = _gather_logging_targets()
    pool = pebble.ProcessPool(
        max_workers=config.threads,
        max_tasks=1,
        context=mp.get_context("forkserver"),
        initializer=_init_worker_logging,
        initargs=[log_files, mirror_console, log_level],
    )
    for x_min in range(-180, 180, degree_per_tile):
        for y_min in range(-90, 90, degree_per_tile):
            x_max = x_min + degree_per_tile
            y_max = y_min + degree_per_tile
            tile = calculateTiles(x_min, y_max)
            tile_folder = image_output_folder / tile
            tile_folder.mkdir(parents=True, exist_ok=True)
            heightmap_folder = tile_folder / "heightmap"
            heightmap_folder.mkdir(parents=True, exist_ok=True)
            output_png = heightmap_folder / f"{tile}_exported.png"
            if output_png.exists():
                logger.info("Skipping gdal_translate for %s", tile)
                continue
            pool.schedule(
                _gdal_translate,
                [
                    config,
                    heightmap_folder,
                    tile,
                    blocks_per_tile,
                    x_min,
                    x_max,
                    y_min,
                    y_max,
                ],
            )
    pool.close()
    pool.join()
    logger.info("gdal_translate finished")


def _gdal_translate(
    config: GeneratorConfig,
    output_folder: Path,
    tile: str,
    blocks_per_tile: int,
    x_min: float,
    x_max: float,
    y_min: float,
    y_max: float,
) -> None:
    logger.info("gdal_translate of %s", tile)
    result = subprocess.run(
        [
            "gdal_translate",
            "-a_nodata",
            "none",
            "-outsize",
            str(blocks_per_tile),
            str(blocks_per_tile),
            "-projwin",
            str(x_min),
            str(y_max),
            str(x_max),
            str(y_min),
            "-Of",
            "PNG",
            "-ot",
            "UInt16",
            "-scale",
            "-1152",
            "8848",
            "0",
            "65535",
            str(config.heightmap_input_path),
            str(output_folder / f"{tile}_exported.png"),
        ],
        capture_output=True,
        text=True,
    )
    if result.stdout:
        logger.info("gdal_translate %s stdout: %s", tile, result.stdout.strip())
    if result.stderr:
        logger.error("gdal_translate %s stderr: %s", tile, result.stderr.strip())


__all__ = ["image_export"]
