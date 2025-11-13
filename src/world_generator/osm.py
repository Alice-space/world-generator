from __future__ import annotations

import logging
from contextlib import AbstractContextManager
from pathlib import Path
from typing import Mapping

import osmium

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

# OSM shapefile export postfix mapping
OSM_POSTFIX: Mapping[str, tuple[str, str]] = {
    # "output_file": ("input_file", "suffix")
    "urban": ("urban", '|layername=multipolygons'),
    "broadleaved": (
        "forest",
        '|layername=multipolygons|subset="other_tags" = \'"leaf_type"=>"broadleaved"\'',
    ),
    "needleleaved": (
        "forest",
        '|layername=multipolygons|subset="other_tags" = \'"leaf_type"=>"needleleaved"\'',
    ),
    "mixedforest": ("forest", '|layername=multipolygons'),
    "beach": ("beach", '|layername=multipolygons'),
    "grass": ("grass", '|layername=multipolygons'),
    "farmland": ("farmland", '|layername=multipolygons'),
    "meadow": ("meadow", '|layername=multipolygons'),
    "quarry": ("quarry", '|layername=multipolygons'),
    "water": (
        "water",
        '|layername=multipolygons|subset="natural" = \'water\'',
    ),
    "glacier": ("glacier", '|layername=multipolygons'),
    "wetland": ("wetland", '|layername=multipolygons'),
    "swamp": ("swamp", '|layername=multipolygons'),
}


class OSMPreprocessor(osmium.SimpleHandler, AbstractContextManager):
    def __init__(self, output_folder: Path) -> None:
        osmium.SimpleHandler.__init__(self)
        self.output_folder = output_folder.resolve()
        self.output_folder.mkdir(parents=True, exist_ok=True)
        # Writers
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

    def __exit__(self, *args: object, **kwargs: object) -> None:
        # Close writers to flush/close underlying files
        for attr in dir(self):
            w = getattr(self, attr)
            if isinstance(w, osmium.SimpleWriter):
                w.close()
        # Cleanup open resources via parent
        super().__exit__(*args, **kwargs)

    def node(self, n: osmium.osm.Node) -> None:
        self._process(n, "add_node")

    def way(self, w: osmium.osm.Way) -> None:
        self._process(w, "add_way")

    def relation(self, r: osmium.osm.Relation) -> None:
        self._process(r, "add_relation")

    def _process(self, e: osmium.osm.OSMObject, writer_method: str) -> None:
        tags = e.tags
        highway_tag: str | None = tags.get("highway")
        waterway_tag: str | None = tags.get("waterway")
        aeroway_tag: str | None = tags.get("aeroway")
        landuse_tag: str | None = tags.get("landuse")
        boundary_tag: str | None = tags.get("boundary")
        admin_level_tag: str | None = tags.get("admin_level")
        natural_tag: str | None = tags.get("natural")
        water_tag: str | None = tags.get("water")
        wetland_tag: str | None = tags.get("wetland")
        volcano_status_tag: str | None = tags.get("volcano:status")

        if highway_tag in ("motorway", "trunk"):
            getattr(self.highway_writer, writer_method)(e)
        if highway_tag in ("primary", "secondary"):
            getattr(self.big_road_writer, writer_method)(e)
        if highway_tag == "tertiary":
            getattr(self.middle_road_writer, writer_method)(e)
        if highway_tag == "residential":
            getattr(self.small_road_writer, writer_method)(e)
        if waterway_tag in ("river", "stream") or water_tag == "river":
            getattr(self.stream_writer, writer_method)(e)
        if aeroway_tag == "launchpad":
            getattr(self.aerodrome_writer, writer_method)(e)
        if landuse_tag in (
            "commercial",
            "construction",
            "industrial",
            "residential",
            "retail",
        ):
            getattr(self.urban_writer, writer_method)(e)
        if boundary_tag == "administrative" and admin_level_tag in ("3", "4"):
            if natural_tag != "coastline" and admin_level_tag not in (
                "2",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
            ):
                getattr(self.stateborder_writer, writer_method)(e)
        if (
            water_tag in ("lake", "reservoir")
            or natural_tag == "water"
            or landuse_tag == "reservoir"
        ):
            getattr(self.water_writer, writer_method)(e)
        if natural_tag == "wetland":
            getattr(self.wetland_writer, writer_method)(e)
        if natural_tag == "wetland" and wetland_tag == "swamp":
            getattr(self.swamp_writer, writer_method)(e)
        if waterway_tag in ("river", "riverbank", "canal") or water_tag == "river":
            getattr(self.river_writer, writer_method)(e)
        if natural_tag == "glacier":
            getattr(self.glacier_writer, writer_method)(e)
        if natural_tag == "volcano" and volcano_status_tag == "active":
            getattr(self.volcano_writer, writer_method)(e)
        if natural_tag == "beach":
            getattr(self.beach_writer, writer_method)(e)
        if landuse_tag == "forest":
            getattr(self.forest_writer, writer_method)(e)
        if landuse_tag == "farmland":
            getattr(self.farmland_writer, writer_method)(e)
        if landuse_tag == "vineyard":
            getattr(self.vineyard_writer, writer_method)(e)
        if landuse_tag == "meadow":
            getattr(self.meadow_writer, writer_method)(e)
        if landuse_tag in ("grass", "fell", "heath", "scrub") or natural_tag == "grassland":
            getattr(self.grass_writer, writer_method)(e)
        if landuse_tag == "quarry":
            getattr(self.quarry_writer, writer_method)(e)
        if landuse_tag == "bare_rock" or natural_tag in ("scree", "shingle"):
            getattr(self.bare_rock_writer, writer_method)(e)
        if boundary_tag == "administrative" and admin_level_tag == "2":
            if natural_tag != "coastline" and admin_level_tag not in (
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
            ):
                getattr(self.border_writer, writer_method)(e)

