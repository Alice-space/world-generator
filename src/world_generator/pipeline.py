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

    def _ensure_workspace_assets(self) -> None:
        """Symlink required source assets into scripts_folder_path.

        wpscript.js, sections/, and the wpscript/ template files (1-19.world etc.)
        live in the source repo's Data/ directory but are referenced by absolute
        paths starting from scripts_folder_path. When users set scripts_folder_path
        to a separate output directory, these assets need to be made available.

        This method creates symlinks (idempotent: skips if already exists).
        """
        src_data = Path(__file__).resolve().parents[2] / "Data"
        if not src_data.exists():
            self._logger.warning("Source Data dir not found at %s, skipping symlink setup", src_data)
            return

        scripts = self.config.scripts_folder_path
        scripts.mkdir(parents=True, exist_ok=True)

        def _symlink_if_missing(src: Path, dst: Path) -> None:
            if not src.exists():
                return
            if dst.is_symlink() or dst.exists():
                return
            try:
                dst.symlink_to(src)
                self._logger.debug("Symlinked %s -> %s", dst, src)
            except OSError as exc:
                self._logger.warning("Could not symlink %s -> %s: %s", dst, src, exc)

        # Top-level JS assets and sections directory
        for name in ("wpscript.js", "utils.js", "wp_daemon_driver.js", "sections"):
            _symlink_if_missing(src_data / name, scripts / name)

        # Some scripts reference the path with a Data/ subdirectory (legacy fallback)
        data_subdir = scripts / "Data"
        data_subdir.mkdir(exist_ok=True)
        for name in ("wpscript.js", "utils.js", "wp_daemon_driver.js", "sections"):
            _symlink_if_missing(src_data / name, data_subdir / name)

        # WorldPainter template files (mixed with output dirs in wpscript/)
        src_wpscript = src_data / "wpscript"
        if src_wpscript.is_dir():
            dst_wpscript = scripts / "wpscript"
            dst_wpscript.mkdir(exist_ok=True)
            template_items = [
                "1-12.world", "1-16.world", "1-17.world",
                "1-18.world", "1-18-ex.world", "1-19.world", "1-19-ex.world",
                "farm", "layer", "ocean", "ores", "roads", "schematics",
                "terrain", "void.png",
            ]
            for item in template_items:
                _symlink_if_missing(src_wpscript / item, dst_wpscript / item)
        self._logger.info("Workspace assets verified at %s", scripts)

    def generate_tiles(self) -> None:
        self._logger.info("Running tile generation stage")
        self._ensure_wp_config()
        generate_tiles(self.config)

    def run_all(self) -> None:
        self._logger.info("Starting full world generation pipeline")
        self._ensure_workspace_assets()
        self.preprocess()
        self.generate_tiles()


__all__ = ["WorldGenerationPipeline"]
