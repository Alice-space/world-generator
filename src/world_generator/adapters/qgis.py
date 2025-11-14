from __future__ import annotations

import logging
import subprocess
from pathlib import Path
from typing import TYPE_CHECKING, Any, NoReturn

_QGIS_INIT_RETRY = 3

logger = logging.getLogger(__name__)

if TYPE_CHECKING:
    from qgis.core import QgsApplication, QgsPrintLayout, QgsProject, QgsRectangle
else:
    try:
        # Defer import to runtime and suppress failures if not available
        from qgis.core import QgsApplication, QgsPrintLayout, QgsProject, QgsRectangle
    except Exception:  # pragma: no cover - optional at import time
        QgsApplication = QgsProject = QgsPrintLayout = QgsRectangle = None


class _MissingQgis:
    """Placeholder to delay ImportErrors until use."""

    def __getattr__(self, name: str) -> NoReturn:
        raise ImportError("QGIS is not installed or not available at expected paths.")


class QgisContext:
    def __init__(self) -> None:
        self.app = None

    def __enter__(self) -> QgisContext:
        if QgsApplication is None:  # type: ignore[comparison-overlap]
            self.app = _MissingQgis()  # type: ignore[assignment]
        else:
            QgsApplication.setPrefixPath("/usr", True)
            app = QgsApplication([], False)
            retry = _QGIS_INIT_RETRY
            last_err = None
            while retry > 0:
                try:
                    app.initQgis()
                    break
                except Exception as e:
                    last_err = e
                    retry -= 1
                    logger.warning("QGIS init failed, retries left: %d", retry)
            else:
                logger.error(
                    "Failed to initialize QGIS after %d attempts", _QGIS_INIT_RETRY
                )
                raise RuntimeError("QGIS initialization failed") from last_err
            self.app = app
        return self

    def __exit__(self, *args: Any) -> None:
        if self.app and hasattr(self.app, "exitQgis") and callable(self.app.exitQgis):
            try:
                self.app.exitQgis()
            except Exception as e:
                logger.debug("exitQgis error: %s", e)


def fix_geometry(
    project_path: Path | str, algorithm: str, parameters: dict[str, Any]
) -> dict[str, Any]:
    """Run a QGIS processing algorithm with minimal project initialization."""
    # Defer imports to function scope to keep modules importable without QGIS installed
    sys_path_add = "/usr/share/qgis/python/plugins"
    import sys

    if sys_path_add not in sys.path:
        sys.path.append(sys_path_add)
    from processing import processing as qgis_processing
    from processing.core.Processing import Processing
    from qgis.core import QgsApplication, QgsProject

    with QgisContext():
        proj = QgsProject.instance()
        if str(project_path):
            proj_read = proj.read(str(project_path))
            logger.info("QGIS read project %s (success=%s)", project_path, proj_read)
        Processing.initialize()
        out = qgis_processing.run(algorithm, parameters)
        return out or {}


def export_image(
    project_path: Path | str,
    block_per_tile: int,
    degree_per_tile: int,
    x_range_min: int,
    x_range_max: int,
    y_range_min: int,
    y_range_max: int,
    layer_output_name: str,
    layers: tuple[str, ...],
) -> None:
    # Defer imports/append to avoid import-time requirements
    sys_path_add = "/usr/share/qgis/python/plugins"
    import sys

    if sys_path_add not in sys.path:
        sys.path.append(sys_path_add)
    from PyQt5.QtCore import QSize
    from qgis.core import (
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

    from ..utils.tiles import calculate_tiles

    image_output_folder = Path.cwd() / "image_exports"
    # In QGIS pipeline, folder is driven by caller; prefer a clear root override if needed
    # continue with current region for compatibility

    def uncheck_all(project: Any) -> None:
        all_layers = list(project.mapLayers().values())
        root = project.layerTreeRoot()
        for layer in all_layers:
            node = root.findLayer(layer.id())
            if node:
                node.setItemVisibilityChecked(False)

    def select_nodes(project: Any, names: tuple[str, ...]) -> None:
        found = []
        for layer in project.mapLayers().values():
            for name in names:
                if layer.name().startswith(name):
                    found.append(layer)
                    break
        root = project.layerTreeRoot()
        for layer in found:
            node = root.findLayer(layer.id())
            if node:
                node.setItemVisibilityChecked(True)

    def _export(
        project: Any,
        output_name: Path,
        x_min: float,
        x_max: float,
        y_min: float,
        y_max: float,
    ) -> None:
        layout = QgsPrintLayout(project)
        layout.initializeDefaults()
        pages = layout.pageCollection()
        pages.page(0).setPageSize(
            QgsLayoutSize(block_per_tile, block_per_tile, QgsUnitTypes.LayoutPixels)
        )
        map_item = QgsLayoutItemMap(layout)
        map_item.setRect(0, 0, block_per_tile, block_per_tile)
        map_item.setExtent(QgsRectangle(x_min, y_min, x_max, y_max))
        map_item.attemptMove(QgsLayoutPoint(0, 0, QgsUnitTypes.LayoutPixels))
        map_item.attemptResize(
            QgsLayoutSize(block_per_tile, block_per_tile, QgsUnitTypes.LayoutPixels)
        )
        layout.addLayoutItem(map_item)
        exporter = QgsLayoutExporter(layout)
        settings = QgsLayoutExporter.ImageExportSettings()
        settings.imageSize = QSize(block_per_tile, block_per_tile)
        context = QgsLayoutRenderContext(layout)
        context.setFlag(context.FlagAntialiasing, False)
        settings.flags = context.flags()
        ret = exporter.exportToImage(str(output_name), settings)
        if ret != 0:
            logger.error("exportToImage %s error: %d", output_name.name, ret)
            raise RuntimeError(f"Image export failed for {output_name.name}")
        logger.info("%s generated", output_name.name)

    with QgisContext():
        proj = QgsProject.instance()
        proj.read(str(project_path))
        logger.info("QGIS read project %s", proj.fileName())
        uncheck_all(proj)
        select_nodes(proj, layers)
        for x_min in range(x_range_min, x_range_max, degree_per_tile):
            for y_min in range(y_range_min, y_range_max, degree_per_tile):
                x_max = x_min + degree_per_tile
                y_max = y_min + degree_per_tile
                tile = calculate_tiles(x_min, y_max)
                out_dir = image_output_folder / f"{tile}"
                out_dir.mkdir(parents=True, exist_ok=True)
                if layer_output_name == "":
                    out_path: Path = out_dir / f"{tile}.png"
                else:
                    out_path = out_dir / f"{tile}_{layer_output_name}.png"
                if out_path.exists():
                    logger.info("Skipping %s", out_path.name)
                    continue
                _export(proj, out_path, x_min, x_max, y_min, y_max)
        uncheck_all(proj)
