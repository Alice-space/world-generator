"""High level orchestration for the world generation steps."""

import logging
from dataclasses import dataclass

from .config import GeneratorConfig
from .preprocess import preprocess_osm
from .tiles import generate_tiles


@dataclass
class WorldGenerationPipeline:
    """Coordinates the preprocessing and tile generation stages."""

    config: GeneratorConfig

    def __post_init__(self) -> None:
        self._logger = logging.getLogger(__name__)

    def preprocess(self) -> None:
        self._logger.info("Running OSM preprocessing stage")
        preprocess_osm(self.config)

    def generate_tiles(self) -> None:
        self._logger.info("Running tile generation stage")
        generate_tiles(self.config)

    def run_all(self) -> None:
        self._logger.info("Starting full world generation pipeline")
        self.preprocess()
        self.generate_tiles()


__all__ = ["WorldGenerationPipeline"]
