"""OSM preprocessing and geometry cleanup utilities."""

import logging
import multiprocessing as mp
from pathlib import Path
from typing import Any, Iterable, Mapping

import osmium
import pebble

from .config import GeneratorConfig
from .qgiscontroller import fix_geometry

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
        '|layername=multipolygons|subset="other_tags" = \'"leaf_type"=>"broadleaved"\'',
    ),
    "needleleaved": (
        "forest",
        '|layername=multipolygons|subset="other_tags" = \'"leaf_type"=>"needleleaved"\'',
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


class OSMPreprocessor(osmium.SimpleHandler):
    """Split planet data into thematic layers for downstream steps."""

    def __init__(self, output_folder: Path) -> None:
        super().__init__()
        self.output_folder = output_folder
        self.highway_writer = self._writer("highway.osm")
        self.big_road_writer = self._writer("big_road.osm")
        self.middle_road_writer = self._writer("middle_road.osm")
        self.small_road_writer = self._writer("small_road.osm")
        self.stream_writer = self._writer("stream.osm")
        self.aerodrome_writer = self._writer("aerodrome.osm")
        self.urban_writer = self._writer("urban.osm")
        self.stateborder_writer = self._writer("stateborder.osm")
        self.water_writer = self._writer("water.osm")
        self.wetland_writer = self._writer("wetland.osm")
        self.swamp_writer = self._writer("swamp.osm")
        self.river_writer = self._writer("river.osm")
        self.glacier_writer = self._writer("glacier.osm")
        self.volcano_writer = self._writer("volcano.osm")
        self.beach_writer = self._writer("beach.osm")
        self.forest_writer = self._writer("forest.osm")
        self.farmland_writer = self._writer("farmland.osm")
        self.vineyard_writer = self._writer("vineyard.osm")
        self.meadow_writer = self._writer("meadow.osm")
        self.grass_writer = self._writer("grass.osm")
        self.quarry_writer = self._writer("quarry.osm")
        self.bare_rock_writer = self._writer("bare_rock.osm")
        self.border_writer = self._writer("border.osm")

    def _writer(self, filename: str) -> osmium.SimpleWriter:
        return osmium.SimpleWriter(str(self.output_folder / filename))

    def node(self, node: Any) -> None:  # pragma: no cover - exercised via osmium
        self._process(node, "add_node")

    def way(self, way: Any) -> None:  # pragma: no cover - exercised via osmium
        self._process(way, "add_way")

    def relation(self, relation: Any) -> None:  # pragma: no cover
        self._process(relation, "add_relation")

    def _process(self, element: Any, writer_method: str) -> None:
        highway_tag = element.tags.get("highway")
        waterway_tag = element.tags.get("waterway")
        aeroway_tag = element.tags.get("aeroway")
        landuse_tag = element.tags.get("landuse")
        boundary_tag = element.tags.get("boundary")
        admin_level_tag = element.tags.get("admin_level")
        natural_tag = element.tags.get("natural")
        water_tag = element.tags.get("water")
        wetland_tag = element.tags.get("wetland")
        volcano_status_tag = element.tags.get("volcano:status")

        def emit(writer: osmium.SimpleWriter) -> None:
            getattr(writer, writer_method)(element)

        if highway_tag in ("motorway", "trunk"):
            emit(self.highway_writer)
        if highway_tag in ("primary", "secondary"):
            emit(self.big_road_writer)
        if highway_tag == "tertiary":
            emit(self.middle_road_writer)
        if highway_tag == "residential":
            emit(self.small_road_writer)
        if waterway_tag in ("river", "stream") or water_tag == "river":
            emit(self.stream_writer)
        if aeroway_tag == "launchpad":
            emit(self.aerodrome_writer)
        if landuse_tag in {
            "commercial",
            "construction",
            "industrial",
            "residential",
            "retail",
        }:
            emit(self.urban_writer)
        if boundary_tag == "administrative" and admin_level_tag in {"3", "4"}:
            if natural_tag != "coastline" and admin_level_tag not in {
                "2",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
            }:
                emit(self.stateborder_writer)
        if (
            water_tag in {"lake", "reservoir"}
            or natural_tag == "water"
            or landuse_tag == "reservoir"
        ):
            emit(self.water_writer)
        if natural_tag == "wetland":
            emit(self.wetland_writer)
        if natural_tag == "wetland" and wetland_tag == "swamp":
            emit(self.swamp_writer)
        if waterway_tag in {"river", "riverbank", "canal"} or water_tag == "river":
            emit(self.river_writer)
        if natural_tag == "glacier":
            emit(self.glacier_writer)
        if natural_tag == "volcano" and volcano_status_tag == "active":
            emit(self.volcano_writer)
        if natural_tag == "beach":
            emit(self.beach_writer)
        if landuse_tag == "forest":
            emit(self.forest_writer)
        if landuse_tag == "farmland":
            emit(self.farmland_writer)
        if landuse_tag == "vineyard":
            emit(self.vineyard_writer)
        if landuse_tag == "meadow":
            emit(self.meadow_writer)
        if (
            landuse_tag in {"grass", "fell", "heath", "scrub"}
            or natural_tag == "grassland"
        ):
            emit(self.grass_writer)
        if landuse_tag == "quarry":
            emit(self.quarry_writer)
        if landuse_tag == "bare_rock" or natural_tag in {"scree", "shingle"}:
            emit(self.bare_rock_writer)
        if boundary_tag == "administrative" and admin_level_tag == "2":
            if natural_tag != "coastline" and admin_level_tag not in {
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
            }:
                emit(self.border_writer)


def preprocess_osm(config: GeneratorConfig) -> None:
    """Convert the raw planet extract into per-feature OSM and shapefiles."""

    logger.info("Starting OSM preprocessing")
    output_folder = config.osm_data_dir
    output_folder.mkdir(parents=True, exist_ok=True)

    if not _all_outputs_exist(output_folder, ALL_OSM_FILES, ".osm"):
        try:
            OSMPreprocessor(output_folder).apply_file(str(config.pbf_path))
        except Exception as exc:  # pragma: no cover - depends on binary libs
            logger.exception("OSM preprocess error")
            raise RuntimeError("OSM preprocessing failed") from exc
        logger.info("OSM preprocess completed")
    else:
        logger.info("OSM preprocess already completed, skipping")

    logger.info("Fixing geometries via QGIS")
    if not _all_outputs_exist(output_folder, OSM_POSTFIX.keys(), ".shp"):
        pool = pebble.ProcessPool(
            max_workers=config.threads,
            max_tasks=1,
            context=mp.get_context("forkserver"),
        )
        for output_name in OSM_POSTFIX:
            pool.schedule(_qgis_fix, [config, output_name])
        pool.close()
        pool.join()
        logger.info("Geometry fixing completed")
    else:
        logger.info("All shapefiles exist, skipping QGIS fix")


def _all_outputs_exist(folder: Path, names: Iterable[str], suffix: str) -> bool:
    return all((folder / f"{name}{suffix}").exists() for name in names)


def _qgis_fix(config: GeneratorConfig, output_name: str) -> None:
    input_name, postfix = OSM_POSTFIX[output_name]
    input_file = config.osm_data_dir / f"{input_name}.osm"
    output_file = config.osm_data_dir / f"{output_name}.shp"
    result = fix_geometry(
        "",
        "native:fixgeometries",
        {"INPUT": f"{input_file}{postfix}", "OUTPUT": str(output_file)},
    )
    output_location = result.get("OUTPUT") if isinstance(result, Mapping) else None
    logger.info("QGIS fix geometries %s done: %s", output_name, output_location)


__all__ = ["preprocess_osm"]
