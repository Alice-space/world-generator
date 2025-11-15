"""OSM preprocessing and geometry cleanup utilities."""

import logging
import multiprocessing as mp
import os
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Mapping, Sequence

import geopandas as gpd
import pebble

from .config import GeneratorConfig

logger = logging.getLogger(__name__)

ALL_OSM_FILES = [
    "aerodrome",
    "bare_rock",
    "beach",
    "big_road",
    "border",
    "farmland",
    "forest",
    "glacier",
    "grass",
    "highway",
    "meadow",
    "middle_road",
    "quarry",
    "river",
    "small_road",
    "stateborder",
    "stream",
    "swamp",
    "urban",
    "volcano",
    "water",
    "wetland",
    "vineyard",
]

OSM_POSTFIX: dict[str, tuple[str, str]] = {
    "urban": ("urban", "|layername=multipolygons"),
    "broadleaved": (
        "forest",
        '\'|layername=multipolygons|subset="other_tags" = \'"leaf_type"=>"broadleaved"\'',
    ),
    "needleleaved": (
        "forest",
        '\'|layername=multipolygons|subset="other_tags" = \'"leaf_type"=>"needleleaved"\'',
    ),
    "mixedforest": ("forest", "|layername=multipolygons"),
    "beach": ("beach", "|layername=multipolygons"),
    "grass": ("grass", "|layername=multipolygons"),
    "farmland": ("farmland", "|layername=multipolygons"),
    "meadow": ("meadow", "|layername=multipolygons"),
    "quarry": ("quarry", "|layername=multipolygons"),
    "water": ("water", '|layername=multipolygons|subset="natural" = "water"'),
    "glacier": ("glacier", "|layername=multipolygons"),
    "wetland": ("wetland", "|layername=multipolygons"),
    "swamp": ("swamp", "|layername=multipolygons"),
}


@dataclass(frozen=True)
class FilterStage:
    """Represents one `osmium tags-filter` pass."""

    expressions: tuple[str, ...]


def _expr(key: str, values: Sequence[str], obj_type: str | None = None) -> str:
    prefix = f"{obj_type}/" if obj_type else ""
    joined = ",".join(values)
    return f"{prefix}{key}={joined}"


def _landuse_stage(values: Sequence[str]) -> FilterStage:
    return FilterStage(
        (
            _expr("landuse", values, "w"),
            _expr("landuse", values, "r"),
        )
    )


def _natural_stage(values: Sequence[str]) -> FilterStage:
    return FilterStage(
        (
            _expr("natural", values, "w"),
            _expr("natural", values, "r"),
            _expr("natural", values, "n"),
        )
    )


OSMIUM_LAYER_FILTERS: dict[str, tuple[FilterStage, ...]] = {
    "highway": (FilterStage((_expr("highway", ("motorway", "trunk"), "w"),)),),
    "big_road": (FilterStage((_expr("highway", ("primary", "secondary"), "w"),)),),
    "middle_road": (FilterStage((_expr("highway", ("tertiary",), "w"),)),),
    "small_road": (FilterStage((_expr("highway", ("residential",), "w"),)),),
    "stream": (
        FilterStage(
            (
                _expr("waterway", ("river", "stream"), "w"),
                _expr("waterway", ("river", "stream"), "r"),
                _expr("water", ("river",), "w"),
            )
        ),
    ),
    "river": (
        FilterStage(
            (
                _expr("waterway", ("river", "riverbank", "canal"), "w"),
                _expr("waterway", ("river", "riverbank", "canal"), "r"),
                _expr("water", ("river",), "w"),
            )
        ),
    ),
    "aerodrome": (
        FilterStage(
            (
                _expr("aeroway", ("launchpad",), "n"),
                _expr("aeroway", ("launchpad",), "w"),
                _expr("aeroway", ("launchpad",), "r"),
            )
        ),
    ),
    "urban": (
        _landuse_stage(
            ("commercial", "construction", "industrial", "residential", "retail")
        ),
    ),
    "stateborder": (
        FilterStage((_expr("boundary", ("administrative",)),)),
        FilterStage((_expr("admin_level", ("3", "4")),)),
    ),
    "border": (
        FilterStage((_expr("boundary", ("administrative",)),)),
        FilterStage((_expr("admin_level", ("2",)),)),
    ),
    "water": (
        FilterStage(
            (
                _expr("water", ("lake", "reservoir"), "w"),
                _expr("water", ("lake", "reservoir"), "r"),
                _expr("water", ("lake", "reservoir"), "n"),
                _expr("natural", ("water",), "w"),
                _expr("natural", ("water",), "r"),
                _expr("natural", ("water",), "n"),
                _expr("landuse", ("reservoir",), "w"),
                _expr("landuse", ("reservoir",), "r"),
            )
        ),
    ),
    "wetland": (_natural_stage(("wetland",)),),
    "swamp": (
        _natural_stage(("wetland",)),
        FilterStage((_expr("wetland", ("swamp",)),)),
    ),
    "glacier": (_natural_stage(("glacier",)),),
    "volcano": (
        _natural_stage(("volcano",)),
        FilterStage((_expr("volcano:status", ("active",)),)),
    ),
    "beach": (_natural_stage(("beach",)),),
    "forest": (_landuse_stage(("forest",)),),
    "farmland": (_landuse_stage(("farmland",)),),
    "vineyard": (_landuse_stage(("vineyard",)),),
    "meadow": (_landuse_stage(("meadow",)),),
    "grass": (
        _landuse_stage(("grass", "fell", "heath", "scrub")),
        _natural_stage(("grassland",)),
    ),
    "quarry": (_landuse_stage(("quarry",)),),
    "bare_rock": (
        FilterStage(
            (
                _expr("landuse", ("bare_rock",), "w"),
                _expr("landuse", ("bare_rock",), "r"),
                _expr("natural", ("scree", "shingle"), "w"),
                _expr("natural", ("scree", "shingle"), "r"),
            )
        ),
    ),
}


def preprocess_osm(config: GeneratorConfig) -> None:
    """Convert the raw planet extract into per-feature OSM and shapefiles."""

    logger.info("Starting OSM preprocessing")
    output_folder = config.osm_data_dir
    output_folder.mkdir(parents=True, exist_ok=True)
    active_layers = _active_layers(ALL_OSM_FILES, config.osm_switch)

    if not _all_outputs_exist(output_folder, active_layers, ".osm"):
        _run_parallel_osmium(config, active_layers)
    else:
        logger.info("OSM preprocess already completed, skipping")

    logger.info("Converting layers via ogr2ogr and GeoPandas")
    shapefile_layers = _active_layers(tuple(OSM_POSTFIX.keys()), config.osm_switch)
    if not _all_outputs_exist(output_folder, shapefile_layers, ".shp"):
        _run_parallel_shapefile_fix(config, shapefile_layers)
        logger.info("Geometry fixing completed")
    else:
        logger.info("All shapefiles exist, skipping ogr2ogr/GeoPandas fix")


def _all_outputs_exist(folder: Path, names: Iterable[str], suffix: str) -> bool:
    return all((folder / f"{name}{suffix}").exists() for name in names)


def _active_layers(layers: Sequence[str], switches: Mapping[str, bool]) -> list[str]:
    return [layer for layer in layers if switches.get(layer, True)]


def _run_parallel_osmium(config: GeneratorConfig, layers: Sequence[str]) -> None:
    if not layers:
        logger.info("No OSM layers requested, skipping osmium filters")
        return
    max_workers = max(1, min(len(layers), config.threads))
    logger.info(
        "Running osmium-tool across %s layers with %s worker(s)",
        len(layers),
        max_workers,
    )
    context = mp.get_context("forkserver")
    with pebble.ProcessPool(
        max_workers=max_workers, context=context, max_tasks=1
    ) as pool:
        futures = [
            pool.schedule(_run_osmium_for_layer, args=[config, layer])
            for layer in layers
        ]
        for future in futures:
            future.result()
    logger.info("OSM preprocess completed")


def _run_osmium_for_layer(config: GeneratorConfig, layer: str) -> None:
    stages = OSMIUM_LAYER_FILTERS.get(layer)
    if not stages:
        raise KeyError(f"Missing osmium filter definition for layer '{layer}'")
    target = config.osm_data_dir / f"{layer}.osm"
    _execute_osmium_pipeline(config.pbf_path, target, stages)


def _execute_osmium_pipeline(
    input_path: Path, output_path: Path, stages: Sequence[FilterStage]
) -> None:
    source = input_path
    temp_files: list[Path] = []
    try:
        for idx, stage in enumerate(stages):
            is_last = idx == len(stages) - 1
            if not stage.expressions:
                raise ValueError("Filter stage must contain at least one expression")
            if is_last:
                stage_output = output_path
                fmt = "osm"
            else:
                temp_fd, temp_name = tempfile.mkstemp(
                    suffix=".osm.pbf", prefix="osmium-stage-"
                )
                os.close(temp_fd)
                stage_output = Path(temp_name)
                temp_files.append(stage_output)
                fmt = "osm.pbf"
            _run_osmium_stage(source, stage_output, fmt, stage.expressions)
            source = stage_output
    finally:
        for temp in temp_files:
            try:
                temp.unlink()
            except FileNotFoundError:
                pass


def _run_osmium_stage(
    source: Path, target: Path, fmt: str, expressions: Sequence[str]
) -> None:
    cmd = [
        "osmium",
        "tags-filter",
        "--overwrite",
        "-r",  # short flag works on older osmium versions too
        "-o",
        str(target),
        "-f",
        fmt,
        str(source),
        *expressions,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        logger.error(
            "osmium tags-filter failed for %s: %s", target, result.stderr.strip()
        )
        raise RuntimeError(
            f"osmium tags-filter failed for {target}: {result.stderr.strip()}"
        )
    if result.stderr.strip():
        logger.debug("osmium tags-filter %s", result.stderr.strip())


def _run_parallel_shapefile_fix(config: GeneratorConfig, layers: Sequence[str]) -> None:
    if not layers:
        logger.info("No shapefile layers requested, skipping ogr2ogr/GeoPandas")
        return
    max_workers = max(1, min(len(layers), config.threads))
    context = mp.get_context("forkserver")
    with pebble.ProcessPool(
        max_workers=max_workers, context=context, max_tasks=1
    ) as pool:
        futures = [
            pool.schedule(_ogr2ogr_fix_layer, args=[config, layer]) for layer in layers
        ]
        for future in futures:
            future.result()


def _ogr2ogr_fix_layer(config: GeneratorConfig, output_name: str) -> None:
    input_name, postfix = OSM_POSTFIX[output_name]
    input_file = config.osm_data_dir / f"{input_name}.osm"
    output_file = config.osm_data_dir / f"{output_name}.shp"
    if not input_file.exists():
        logger.warning("Skipping %s because %s is missing", output_name, input_file)
        return
    _run_ogr2ogr(input_file, postfix, output_file)
    _fix_shapefile_geometries(output_file)
    logger.info("ogr2ogr/GeoPandas fix complete for %s", output_name)


def _run_ogr2ogr(input_file: Path, postfix: str, output_file: Path) -> None:
    target = str(output_file)
    source = f"{input_file}{postfix}"
    cmd = ["ogr2ogr", "-overwrite", target, source]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.stdout.strip():
        logger.debug("ogr2ogr %s", result.stdout.strip())
    if result.returncode != 0:
        logger.error("ogr2ogr failed for %s: %s", target, result.stderr.strip())
        raise RuntimeError(f"ogr2ogr failed for {target}: {result.stderr.strip()}")


def _fix_shapefile_geometries(output_file: Path) -> None:
    gdf = gpd.read_file(output_file)
    if gdf.empty:
        return
    if hasattr(gdf.geometry, "make_valid"):
        geometries = gdf.geometry.make_valid()
    else:
        geometries = gdf.geometry.buffer(0)
    gdf["geometry"] = geometries
    gdf = gdf[gdf.geometry.notnull() & ~gdf.geometry.is_empty]
    gdf.to_file(output_file, driver="ESRI Shapefile")


__all__ = ["preprocess_osm"]
