"""Thin wrappers around QGIS export helpers.

This module keeps the heavy imports isolated so the rest of the codebase remains
importable even on machines without QGIS installed."""

import logging
import os
import subprocess
import sys
from pathlib import Path
from typing import Any, Iterable, Mapping

from .config import GeneratorConfig
from .tools import calculateTiles

logger = logging.getLogger(__name__)

_QGIS_PLUGIN_PATH = "/usr/share/qgis/python/plugins"
# Debian/Ubuntu ship QGIS + PyQt5 into the system dist-packages dir.
# When the generator runs inside a virtualenv (the default in this repo)
# those packages are hidden from sys.path, which causes headless exports
# to fail with ModuleNotFoundError before any logging is emitted.  We add
# the dist-packages path explicitly so subprocesses spawned from the venv
# can see the system QGIS/PyQt5 modules.
_SYSTEM_DIST_PACKAGES = "/usr/lib/python3/dist-packages"


def _ensure_headless_env() -> None:
    """Force Qt to run without touching a windowing system."""
    os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")
    runtime_dir = os.environ.get("XDG_RUNTIME_DIR", "/tmp/qgis-runtime")
    os.environ["XDG_RUNTIME_DIR"] = runtime_dir
    try:
        Path(runtime_dir).mkdir(parents=True, exist_ok=True)
        os.chmod(runtime_dir, 0o700)
    except Exception:
        # Best-effort; Qt will fallback if permissions are off.
        pass


def _inject_qgis_plugins() -> None:
    """Ensure QGIS/PyQt system paths are visible inside venv workers."""
    if _SYSTEM_DIST_PACKAGES not in sys.path:
        sys.path.append(_SYSTEM_DIST_PACKAGES)
    if _QGIS_PLUGIN_PATH not in sys.path:
        sys.path.append(_QGIS_PLUGIN_PATH)


def _create_qgs_application() -> Any:  # pragma: no cover - depends on QGIS runtime
    """Create and initialize a headless ``QgsApplication`` instance."""
    _ensure_headless_env()
    from qgis.core import QgsApplication  # type: ignore

    QgsApplication.setPrefixPath("/usr", True)
    # Create a reference to the QgsApplication.  Setting the
    # second argument to False disables the GUI.
    qgs = QgsApplication([], False)
    qgs.initQgis()
    return qgs


def fix_geometry(
    project_path: str, algorithm: str, parameters: Mapping[str, Any]
) -> Mapping[str, Any]:
    """Run a QGIS processing algorithm (usually "Fix geometries") and return the outputs."""
    _ensure_headless_env()
    _inject_qgis_plugins()
    from processing.core.Processing import Processing  # type: ignore
    from qgis import processing  # type: ignore
    from qgis.core import QgsProject  # type: ignore

    qgs = None
    project_ref = None
    try:
        qgs = _create_qgs_application()
        Processing.initialize()

        if project_path:
            project = QgsProject.instance()
            project_ref = project
            project.read(project_path)
            logger.info("QGIS loaded project %s", project.fileName())

        return processing.run(algorithm, parameters)
    except Exception as exc:  # pragma: no cover - depends on QGIS runtime
        logger.error("QGIS fix geometry failed for %s: %s", project_path, exc)
        return {}
    finally:
        if project_ref is not None:
            project_ref.clear()
        if qgs:
            qgs.exitQgis()


def export_image(
    config: GeneratorConfig,
    project_path: str,
    block_per_tile: int,
    degree_per_tile: int,
    x_range_min: int,
    x_range_max: int,
    y_range_min: int,
    y_range_max: int,
    layer_output_name: str,
    layers: Iterable[str],
) -> None:
    """Export the requested layers from a QGIS project into tiled PNG images."""
    _ensure_headless_env()
    _inject_qgis_plugins()
    from processing.core.Processing import Processing  # type: ignore
    from qgis import processing  # type: ignore
    from qgis.core import QgsProject  # type: ignore

    qgs = None
    project_ref = None
    try:  # pragma: no cover - depends on QGIS runtime
        qgs = _create_qgs_application()
        Processing.initialize()

        project = QgsProject.instance()
        project_ref = project
        project.read(project_path)
        logger.info("QGIS loaded project %s", project.fileName())

        layer_order = project.layerTreeRoot().layerOrder()
        requested_layers = [
            layer
            for layer in project.mapLayers().values()
            if any(layer.name().startswith(prefix) for prefix in layers)
        ]
        if not requested_layers:
            logger.warning(
                "No layers matched prefixes %s in project %s", layers, project_path
            )
            return

        # Preserve project drawing order to match on-canvas appearance.
        requested_layers.sort(
            key=lambda lyr: layer_order.index(lyr.id())
            if lyr.id() in layer_order
            else len(layer_order)
        )

        image_output_folder = config.image_exports_dir
        map_units_per_pixel = degree_per_tile / block_per_tile

        for x_min in range(x_range_min, x_range_max, degree_per_tile):
            for y_min in range(y_range_min, y_range_max, degree_per_tile):
                x_max = x_min + degree_per_tile
                y_max = y_min + degree_per_tile
                tile = calculateTiles(x_min, y_max)
                output_folder = image_output_folder / tile
                output_folder.mkdir(parents=True, exist_ok=True)
                png_name = (
                    output_folder / f"{tile}.png"
                    if not layer_output_name
                    else output_folder / f"{tile}_{layer_output_name}.png"
                )
                if png_name.exists():
                    logger.info("Skipping %s", png_name.name)
                    continue

                tif_name = png_name.with_suffix(".tif")
                params = {
                    "EXTENT": f"{x_min},{x_max},{y_min},{y_max}",
                    "EXTENT_BUFFER": 0,
                    "TILE_SIZE": block_per_tile,
                    "MAP_UNITS_PER_PIXEL": map_units_per_pixel,
                    "MAKE_BACKGROUND_TRANSPARENT": True,
                    "LAYERS": requested_layers,
                    "OUTPUT": str(tif_name),
                }

                try:
                    result = processing.run("native:rasterize", params)
                    output_tif = Path(result.get("OUTPUT", tif_name))
                except Exception as run_exc:
                    logger.error(
                        "native:rasterize failed for %s: %s", tile, run_exc
                    )
                    continue

                translate = subprocess.run(
                    [
                        "gdal_translate",
                        "-of",
                        "PNG",
                        str(output_tif),
                        str(png_name),
                    ],
                    capture_output=True,
                    text=True,
                )
                if translate.returncode != 0:
                    logger.error(
                        "gdal_translate failed for %s: %s", tile, translate.stderr.strip()
                    )
                else:
                    logger.info("Generated %s", png_name.name)
                try:
                    output_tif.unlink(missing_ok=True)
                except Exception:
                    logger.debug("Could not delete temp file %s", output_tif)
    except Exception as exc:
        logger.error("QGIS export failed for %s: %s", project_path, exc)
    finally:
        if project_ref is not None:
            project_ref.clear()
        if qgs:
            qgs.exitQgis()


__all__ = ["fix_geometry", "export_image"]
