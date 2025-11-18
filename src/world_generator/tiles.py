"""Top level helpers for tile generation."""

import logging
import os
import shutil
import subprocess
import sys

from .config import GeneratorConfig
from .imageexport import image_export
from .magick import magick_convert
from .wpscript import wp_generate

logger = logging.getLogger(__name__)


def copy_osm_files(config: GeneratorConfig) -> None:
    logger.info("Linking/copying OSM files")
    src_dir = config.osm_data_dir
    dest_dir = config.qgis_project_path.parent / "OsmData"
    dest_dir.mkdir(parents=True, exist_ok=True)

    empty_osm = config.qgis_project_path.parent / "empty.osm"

    files_by_stem = {f.stem: f for f in src_dir.iterdir() if f.is_file()}

    # Ensure we also process layers that are only present in the config
    # (e.g., disabled layers without a source file).
    layer_names = set(files_by_stem) | set(config.osm_switch.keys())

    for name in layer_names:
        file_path = files_by_stem.get(name)
        dest_file = dest_dir / (file_path.name if file_path else f"{name}.osm")

        active = config.osm_switch.get(name, True)
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

        # Always ensure the destination points to the desired source.
        # This lets us swap to empty.osm when a layer is disabled in the config,
        # even if a previous run left a real file/symlink in place.
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
    # image_export(config)
    # magick_convert(config)
    # wp_generate(config)
    # post_process_map(config)


__all__ = ["generate_tiles", "copy_osm_files", "post_process_map"]
