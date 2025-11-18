"""Top level helpers for tile generation."""

import logging
import os
import shutil
import subprocess
import sys

from .config import GeneratorConfig
from .imageexport import image_export
from .magick import magick_convert
from .preprocess import OGR_LAYER_SPECS
from .wpscript import wp_generate

logger = logging.getLogger(__name__)


def copy_osm_files(config: GeneratorConfig) -> None:
    logger.info("Linking/copying OSM files")
    src_dir = config.osm_data_dir
    dest_dir = config.qgis_project_path.parent / "OsmData"
    dest_dir.mkdir(parents=True, exist_ok=True)

    empty_osm = config.qgis_project_path.parent / "empty.osm"
    empty_gpkg = config.qgis_project_path.parent / "empty.gpkg"
    if not empty_gpkg.exists():
        empty_gpkg.touch()

    # 1) Always link GPKG exports. If a layer GPKG is missing, link to an empty placeholder.
    gpkg_files = {p.stem: p for p in src_dir.glob("*.gpkg")}
    gpkg_layer_names = set(OGR_LAYER_SPECS.keys()) | set(gpkg_files.keys())
    for name in gpkg_layer_names:
        source = gpkg_files.get(name, empty_gpkg)
        dest_file = dest_dir / f"{name}.gpkg"
        if dest_file.exists() or dest_file.is_symlink():
            dest_file.unlink()
        os.symlink(source, dest_file)

    # 2) Link OSM layers according to config, falling back to empty.osm when disabled.
    osm_files = {p.stem: p for p in src_dir.glob("*.osm")}

    # Include layers that exist on disk and any explicitly mentioned in the config,
    # so disabled-but-missing layers still get an empty.osm placeholder.
    layer_names = set(osm_files) | set(config.osm_switch.keys())

    for name in layer_names:
        dest_file = dest_dir / f"{name}.osm"
        active = config.osm_switch.get(name, True)
        file_path = osm_files.get(name)

        if active:
            if not file_path:
                logger.warning(
                    "OSM layer %s is enabled but missing in %s; skipping link",
                    name,
                    src_dir,
                )
                if dest_file.exists() or dest_file.is_symlink():
                    dest_file.unlink()
                continue
            source = file_path
        else:
            source = empty_osm

        if dest_file.exists() or dest_file.is_symlink():
            dest_file.unlink()
        os.symlink(source, dest_file)
    logger.info("OSM file linking complete")


def post_process_map(config: GeneratorConfig) -> None:
    logger.info("Merging exported regions")
    final_path = config.world_output_dir
    final_path.mkdir(parents=True, exist_ok=True)
    final_region_path = final_path / "region"
    final_region_path.mkdir(parents=True, exist_ok=True)

    wp_export_folder = config.scripts_folder_path / "wpscript" / "exports"

    for tile_folder in wp_export_folder.iterdir():
        region_dir = tile_folder / "region"
        if not region_dir.exists():
            continue
        for file in region_dir.iterdir():
            shutil.copy2(file, final_region_path / file.name)
    logger.info("Region merge complete")

    logger.info("Running minutor overview")
    output_png = config.scripts_folder_path / f"{config.world_name}.png"
    result = subprocess.run(
        [
            "minutor",
            "--world",
            str(final_path),
            "--depth",
            "319",
            "--savepng",
            str(output_png),
        ],
        capture_output=True,
        text=True,
    )
    if result.stdout.strip():
        logger.info("minutor output: %s", result.stdout.strip())
    if result.stderr.strip():
        logger.error("minutor error: %s", result.stderr.strip())


def generate_tiles(config: GeneratorConfig) -> None:
    copy_osm_files(config)
    image_export(config)
    magick_convert(config)
    wp_generate(config)
    post_process_map(config)


__all__ = ["generate_tiles", "copy_osm_files", "post_process_map"]
