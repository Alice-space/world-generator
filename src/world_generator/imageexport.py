"""Image export helpers driven by QGIS projects."""

import logging
import multiprocessing as mp
import subprocess
from logging import FileHandler, StreamHandler
from pathlib import Path

import pebble
import zipfile
import xml.etree.ElementTree as ET

from .config import GeneratorConfig
from .qgiscontroller import export_image, export_image_multi
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
    # Filter by osm_switch: skip layers explicitly disabled (e.g. border=false).
    # Layers not in osm_switch (slope, climate, ecoregions, vegetation...) always render.
    return {
        name: prefixes for name, prefixes in layers.items()
        if config.osm_switch.get(name, True)
    }


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


def _list_qgis_layer_names(project_path: Path) -> list[str]:
    """Return the names of all layers in a .qgz/.qgs project, fast path.

    Uses zip + XML parsing instead of full QGIS API initialization (~30s).
    Falls back to an empty list if the project format is unexpected.
    """
    try:
        if str(project_path).endswith(".qgz"):
            with zipfile.ZipFile(project_path) as zf:
                qgs_name = next((n for n in zf.namelist() if n.endswith(".qgs")), None)
                if not qgs_name:
                    return []
                with zf.open(qgs_name) as f:
                    tree = ET.parse(f)
        else:
            tree = ET.parse(project_path)
        root = tree.getroot()
        names = [
            (lt.findtext("layername") or "").strip()
            for lt in root.iter("maplayer")
        ]
        return [n for n in names if n]
    except Exception as exc:  # noqa: BLE001
        logger.warning("Could not enumerate layers in %s: %s", project_path, exc)
        return []


def _filter_existing_layers(
    project_path: Path,
    layer_map: dict[str, tuple[str, ...]],
) -> dict[str, tuple[str, ...]]:
    """Drop layer_map entries whose prefixes don't match any layer in the project.

    Without this, a single missing prefix (e.g. an ore that's only present
    in some QGIS projects) raises and aborts the entire export. We log the
    skipped entries so users can audit them.
    """
    existing = _list_qgis_layer_names(project_path)
    if not existing:
        return layer_map  # could not parse, fall through to runtime check
    filtered: dict[str, tuple[str, ...]] = {}
    skipped: list[str] = []
    for name, prefixes in layer_map.items():
        if any(any(layer.startswith(p) for layer in existing) for p in prefixes):
            filtered[name] = prefixes
        else:
            skipped.append(name)
    if skipped:
        logger.info(
            "Skipping %d layer(s) not found in %s: %s",
            len(skipped), project_path.name, skipped,
        )
    return filtered


def _schedule_layer_exports(
    config: GeneratorConfig,
    project_path: Path,
    layer_map: dict[str, tuple[str, ...]],
    degree_per_tile: int,
    blocks_per_tile: int,
    x_min_list: list[int],
    x_max_list: list[int],
) -> None:
    """Schedule QGIS exports for all layers in *layer_map* from a single project.

    T004 optimization: instead of creating a new ProcessPool per layer (which
    causes each worker to reload the QGIS project for every layer), we create
    **one** pool per project and dispatch all layers together.  Each worker
    receives the full *layer_map* and calls ``export_image_multi``, loading the
    project exactly once and iterating over all layers within the same process.
    """
    layer_map = _filter_existing_layers(project_path, layer_map)
    if not layer_map:
        logger.warning("%s: no matching layers, skipping export", project_path.name)
        return
    log_files, mirror_console, log_level = _gather_logging_targets()

    # Some strips occasionally fail with pebble "Abnormal termination" (worker
    # crash, segfault, or transient resource issue). Retry failed strips up to
    # MAX_ATTEMPTS times before aborting — already-rendered tiles are skipped
    # by per-tile png_name.exists() checks, so retries are cheap.
    MAX_ATTEMPTS = 3
    pending_indices = list(range(len(x_min_list)))
    last_failures: list[tuple[int, BaseException]] = []

    for attempt in range(1, MAX_ATTEMPTS + 1):
        if not pending_indices:
            break
        if attempt > 1:
            logger.warning(
                "%s: retrying %d failed strips (attempt %d/%d)",
                project_path.name, len(pending_indices), attempt, MAX_ATTEMPTS,
            )
        pool = pebble.ProcessPool(
            # NOT config.threads: QGIS strip workers reach 12GB+ anon RSS on
            # data-dense strips; 20 concurrent workers OOM-killed each other
            # (manifesting as persistent "Abnormal termination" strip failures)
            max_workers=config.image_export_workers,
            max_tasks=1,
            # spawn (not forkserver): a long-lived forkserver daemon is shared
            # across the 5 sequential export pools in image_export(); when an
            # earlier pool's semaphores are reaped (or after a kill -9 leaves
            # stale state) the daemon hands out workers whose SemLock._rebuild
            # raises FileNotFoundError, and the fork-crash loop hangs the whole
            # stage forever.  spawn gives every worker a clean interpreter.
            context=mp.get_context("spawn"),
            initializer=_init_worker_logging,
            initargs=[log_files, mirror_console, log_level],
        )
        # Per-strip timeout scaled to the strip's actual workload: a dense
        # degree_per_tile=1 strip renders (cols x rows x layers) full rasters and
        # legitimately runs hours, so a flat 40min cap would false-kill it every
        # attempt and soft-fail after 3 retries (silently dropping tiles).  The
        # configured value is only a floor for cheap small-config strips.
        lat_rows = (90 - (-90)) // degree_per_tile
        futures: list[tuple[int, object]] = []
        for idx in pending_indices:
            tiles_in_strip = (
                (x_max_list[idx] - x_min_list[idx]) // degree_per_tile
            ) * lat_rows
            strip_timeout = max(
                config.image_export_strip_timeout_s,
                int(
                    tiles_in_strip
                    * len(layer_map)
                    * config.image_export_seconds_per_raster
                ),
            )
            f = pool.schedule(
                export_image_multi,
                [
                    config,
                    str(project_path),
                    blocks_per_tile,
                    degree_per_tile,
                    x_min_list[idx],
                    x_max_list[idx],
                    -90,
                    90,
                    layer_map,
                ],
                # Bound each strip so one wedged QGIS worker cannot stall the
                # pool indefinitely; pebble kills it and the strip is retried.
                timeout=strip_timeout,
            )
            futures.append((idx, f))
        pool.close()
        pool.join()

        # Surface worker exceptions — pebble swallows them otherwise.
        last_failures = []
        for idx, f in futures:
            try:
                f.result()
            except BaseException as exc:  # noqa: BLE001
                last_failures.append((idx, exc))
        pending_indices = [idx for idx, _ in last_failures]

    if last_failures:
        logger.error(
            "%s: %d strips still failed after %d attempts; continuing pipeline",
            project_path.name, len(last_failures), MAX_ATTEMPTS,
        )
        for idx, exc in last_failures[:10]:
            logger.error("  strip idx=%d (x_min=%d): %s",
                         idx, x_min_list[idx], exc)
        # Do NOT raise — abnormal-termination crashes are persistent for some
        # strips (likely a QGIS internal bug on specific input data). Aborting
        # the entire run loses all progress; let downstream stages run on
        # what we have, and re-run this stage later for the remaining strips.
        # Persist the failure list so users can audit.
        try:
            failure_log = config.scripts_folder_path / "image_export_failures.txt"
            with failure_log.open("a") as fh:
                fh.write("# " + project_path.name + "\n")
                for idx, exc in last_failures:
                    fh.write(f"strip_idx={idx} x_min={x_min_list[idx]} err={exc}\n")
        except Exception as exc:  # noqa: BLE001
            logger.warning("Could not write failure log: %s", exc)


def _generate_placeholders_for_disabled(config: GeneratorConfig) -> None:
    """Generate empty placeholder PNGs for layers disabled in osm_switch.

    Downstream wpscript.js loads each layer's PNG unconditionally, so we
    create black placeholder images (which apply no effect when used as
    heightmap layers) for any layer whose osm_switch is False.
    """
    import os
    import shutil
    disabled = [
        name for name in BASE_LAYER_NAMES
        if name in config.osm_switch and not config.osm_switch[name]
    ]
    if not disabled:
        return

    template = config.scripts_folder_path / "_empty_placeholder.png"
    if not template.exists():
        logger.info("Creating empty placeholder template at %s", template)
        result = subprocess.run(
            ["convert", "-size", f"{config.blocks_per_tile}x{config.blocks_per_tile}",
             "xc:black", str(template)],
            capture_output=True, text=True,
        )
        if result.returncode != 0:
            logger.error("Failed to create placeholder: %s", result.stderr)
            return

    logger.info("Generating placeholders for disabled layers: %s", disabled)
    image_output_folder = config.image_exports_dir
    degree_per_tile = config.degree_per_tile
    count = 0
    for x_min in range(-180, 180, degree_per_tile):
        for y_min in range(-90, 90, degree_per_tile):
            tile = calculateTiles(x_min, y_min + degree_per_tile)
            tile_folder = image_output_folder / tile
            tile_folder.mkdir(parents=True, exist_ok=True)
            for layer in disabled:
                target = tile_folder / f"{tile}_{layer}.png"
                if target.exists():
                    continue
                try:
                    os.link(template, target)
                except OSError:
                    shutil.copy(template, target)
                count += 1
    logger.info("Created %d placeholder PNGs for disabled layers", count)


def image_export(config: GeneratorConfig) -> None:
    image_output_folder = config.image_exports_dir
    image_output_folder.mkdir(parents=True, exist_ok=True)

    degree_per_tile = config.degree_per_tile
    blocks_per_tile = config.blocks_per_tile
    logger.info("Image export started")

    # Generate empty placeholders for layers disabled in osm_switch.
    # This must run BEFORE QGIS exports so workers see the placeholders and skip
    # rendering those layers entirely.
    _generate_placeholders_for_disabled(config)

    # Use 6-degree strips (60 tasks) instead of 18-degree (20 tasks) for better
    # load balancing. Workers that finish ocean-heavy strips pick up the next
    # available strip, reducing the long-tail caused by data-dense regions.
    strip_width = 6  # degrees per strip
    num_strips = 360 // strip_width
    x_min_list = [int(-180 + strip_width * i) for i in range(num_strips)]
    x_max_list = [int(-180 + strip_width * (i + 1)) for i in range(num_strips)]
    x_max_list[-1] = 180

    dynamic_layers = _dynamic_layer_names(config)

    # Always run terrain export — _terrain_layer_names selects TrueMarble (HQ)
    # or backupterrain (non-HQ). Without this, magick later fails silently
    # because <tile>_terrain.png never exists.
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
        # spawn: this gdal pool follows the QGIS export pools above; sharing a
        # forkserver daemon across them risks the SemLock fork-crash hang.
        context=mp.get_context("spawn"),
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
            str(config.gdal_elevation_min),
            str(config.gdal_elevation_max),
            str(config.gdal_output_min),
            str(config.gdal_output_max),
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
