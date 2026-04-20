"""High level orchestration for the world generation steps."""

import logging
import subprocess
from dataclasses import dataclass
from pathlib import Path

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

    def _ensure_wp_config(self) -> None:
        """Generate WorldPainter application config from YAML settings."""
        self._logger.info("Generating WorldPainter application config")

        tools_dir = Path(__file__).resolve().parents[2] / "tools" / "wp-config-writer"
        class_file = tools_dir / "WriteConfig.class"

        # Compile if needed
        if not class_file.exists():
            self._logger.info("Compiling WriteConfig.java")
            compile_result = subprocess.run(
                ["javac", "-cp", "/opt/worldpainter/lib/*", str(tools_dir / "WriteConfig.java")],
                capture_output=True, text=True,
            )
            if compile_result.returncode != 0:
                self._logger.error("WriteConfig compilation failed: %s", compile_result.stderr)
                raise RuntimeError(f"WriteConfig compilation failed: {compile_result.stderr}")

        # Build CLI args from wp_app_settings
        args = [
            "java", "-cp", f"/opt/worldpainter/lib/*:{tools_dir}",
            "WriteConfig",
        ]

        settings = self.config.wp_app_settings
        if settings:
            for key, value in settings.items():
                # Convert snake_case to --kebab-case: check_for_updates -> --check-for-updates
                cli_key = "--" + key.replace("_", "-")
                args.extend([cli_key, str(value).lower() if isinstance(value, bool) else str(value)])

        result = subprocess.run(args, capture_output=True, text=True)
        if result.returncode != 0:
            self._logger.error("WriteConfig failed: %s", result.stderr)
            raise RuntimeError(f"WriteConfig failed: {result.stderr}")
        self._logger.info("WorldPainter config generated: %s", result.stdout.strip())

    def generate_tiles(self) -> None:
        self._logger.info("Running tile generation stage")
        self._ensure_wp_config()
        generate_tiles(self.config)

    def run_all(self) -> None:
        self._logger.info("Starting full world generation pipeline")
        self.preprocess()
        self.generate_tiles()


__all__ = ["WorldGenerationPipeline"]
