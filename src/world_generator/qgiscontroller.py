"""Thin wrappers around QGIS export helpers.

This module keeps the heavy imports isolated so the rest of the codebase remains
importable even on machines without QGIS installed."""

import logging
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


def _inject_qgis_plugins() -> None:
    """Ensure QGIS/PyQt system paths are visible inside venv workers."""
    if _SYSTEM_DIST_PACKAGES not in sys.path:
        sys.path.append(_SYSTEM_DIST_PACKAGES)
    if _QGIS_PLUGIN_PATH not in sys.path:
        sys.path.append(_QGIS_PLUGIN_PATH)


def _create_qgs_application() -> Any:  # pragma: no cover - depends on QGIS runtime
    """Create and initialize a headless ``QgsApplication`` instance."""
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
    _inject_qgis_plugins()
    from PyQt5.QtCore import QSize  # type: ignore
    from qgis.core import (  # type: ignore
        QgsApplication,
        QgsLayoutExporter,
        QgsLayoutItemMap,
        QgsLayoutPoint,
        QgsLayoutRenderContext,
        QgsLayoutSize,
        QgsPrintLayout,
        QgsProject,
        QgsRectangle,
        QgsUnitTypes,
    )

    qgs = None
    project_ref = None
    try:  # pragma: no cover - depends on QGIS runtime
        qgs = _create_qgs_application()
        project = QgsProject.instance()
        project_ref = project
        project.read(project_path)
        logger.info("QGIS loaded project %s", project.fileName())

        def uncheck_all_layers() -> None:
            """Hide every layer so we can re-enable only the requested ones."""
            root = project.layerTreeRoot()
            for layer in project.mapLayers().values():
                node = root.findLayer(layer.id())
                node.setItemVisibilityChecked(False)

        def select_layers() -> None:
            """Turn on layers whose names start with any of the requested prefixes."""
            root = project.layerTreeRoot()
            for layer in project.mapLayers().values():
                for layer_name in layers:
                    if layer.name().startswith(layer_name):
                        node = root.findLayer(layer.id())
                        node.setItemVisibilityChecked(True)

        def export_single_tile(
            output_name: Path, x_min: float, x_max: float, y_min: float, y_max: float
        ) -> None:
            """Render one map tile covering the provided extent and write it to disk."""
            layout = QgsPrintLayout(project)
            layout.initializeDefaults()

            pages = layout.pageCollection()
            pages.page(0).setPageSize(
                QgsLayoutSize(block_per_tile, block_per_tile, QgsUnitTypes.LayoutPixels)
            )

            item_map = QgsLayoutItemMap(layout)
            item_map.setRect(0, 0, block_per_tile, block_per_tile)
            item_map.setExtent(QgsRectangle(x_min, y_min, x_max, y_max))
            item_map.attemptMove(QgsLayoutPoint(0, 0, QgsUnitTypes.LayoutPixels))
            item_map.attemptResize(
                QgsLayoutSize(block_per_tile, block_per_tile, QgsUnitTypes.LayoutPixels)
            )
            layout.addLayoutItem(item_map)

            exporter = QgsLayoutExporter(layout)
            settings = QgsLayoutExporter.ImageExportSettings()
            settings.imageSize = QSize(block_per_tile, block_per_tile)

            context = QgsLayoutRenderContext(layout)
            context.setFlag(context.FlagAntialiasing, False)
            settings.flags = context.flags()

            result = exporter.exportToImage(str(output_name), settings)
            if result != QgsLayoutExporter.Success:
                logger.error(
                    "exportToImage failed for %s: %s", output_name.name, result
                )
            else:
                logger.info("Generated %s", output_name.name)

            layout.removeLayoutItem(item_map)

        uncheck_all_layers()
        select_layers()
        image_output_folder = config.image_exports_dir
        for x_min in range(x_range_min, x_range_max, degree_per_tile):
            for y_min in range(y_range_min, y_range_max, degree_per_tile):
                x_max = x_min + degree_per_tile
                y_max = y_min + degree_per_tile
                tile = calculateTiles(x_min, y_max)
                output_folder = image_output_folder / tile
                output_folder.mkdir(parents=True, exist_ok=True)
                if not layer_output_name:
                    output_name = output_folder / f"{tile}.png"
                else:
                    output_name = output_folder / f"{tile}_{layer_output_name}.png"
                if output_name.exists():
                    logger.info("Skipping %s", output_name.name)
                    continue
                export_single_tile(output_name, x_min, x_max, y_min, y_max)
        uncheck_all_layers()
    except Exception as exc:
        logger.error("QGIS export failed for %s: %s", project_path, exc)
    finally:
        if project_ref is not None:
            project_ref.clear()
        if qgs:
            qgs.exitQgis()


__all__ = ["fix_geometry", "export_image"]
