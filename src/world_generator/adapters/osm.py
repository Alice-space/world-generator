from __future__ import annotations

import logging
from contextlib import AbstractContextManager
from pathlib import Path
from typing import Mapping

import osmium

logger = logging.getLogger(__name__)

ALL_OSM_FILES = (
    "ocean",
    "building",
    "landuse",
    "coast",
    "parking",
    "bathymetry",
    "points",
)
OSM_POSTFIX: Mapping[str, tuple[str, str]] = {
    "ocean": ("ocean", "_line"),
    "building": ("building", "_polygon"),
    "landuse": ("landuse", "_polygon"),
    "coast": ("coast", "_line"),
    "parking": ("parking", "_polygon"),
    "bathymetry": ("bathymetry", "_line"),
}


class OSMPreprocessor(osmium.SimpleHandler, AbstractContextManager):
    def __init__(self, output_folder: Path) -> None:
        super().__init__()
        self.output_folder = Path(output_folder).resolve()
        self._writers: dict[str, osmium.SimpleWriter] = {}
        self._keys: set[str] = {
            "ocean",
            "building",
            "landuse",
            "road",
            "land",
            "highway",
            "railway",
            "parking",
            "amenity",
            "leisure",
            "boundary",
            "waterway",
            "coast",
            "harbour",
            "wetland",
            "grassland",
            "bathymetry",
            "landuse:farm",
            "landuse:residential",
            "highway:service",
        }

    def __enter__(self) -> OSMPreprocessor:
        return self

    def __exit__(self, *args: object, **kwargs: object) -> None:
        for w in self._writers.values():
            w.close()
        self._writers.clear()

    def _writer(self, filename: str) -> osmium.SimpleWriter:
        path = self.output_folder / f"{filename}.osm"
        if filename not in self._writers:
            self._writers[filename] = osmium.SimpleWriter(str(path))
        return self._writers[filename]

    def node(self, n: osmium.osm.Node) -> None:
        if len(n.tags) == 0:
            self._writer("points").add_node(n)
            return
        for tag in n.tags:
            key = tag.k.replace(":", "_")
            if key in self._keys:
                self._writer(tag.k.replace(":", "_")).add_node(n)
                break

    def way(self, w: osmium.osm.Way) -> None:
        if len(w.tags) == 0:
            return
        for tag in w.tags:
            key = tag.k.replace(":", "_")
            if key in self._keys:
                self._writer(tag.k.replace(":", "_")).add_way(w)
                break

    def relation(self, r: osmium.osm.Relation) -> None:
        for tag in r.tags:
            key = tag.k.replace(":", "_")
            if key in self._keys:
                self._writer(tag.k.replace(":", "_")).add_relation(r)
                break

    def _process(self, e: osmium.osm.OSMObject, writer_method: str) -> None:
        """No-op: kept for backwards compatibility.

        The specific handlers above delegate to writers directly.
        """
        return None
