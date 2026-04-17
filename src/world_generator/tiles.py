"""Top level helpers for tile generation."""

import logging
import multiprocessing as mp
import os
import shutil
import subprocess

import pebble

from .config import GeneratorConfig
from .imageexport import image_export
from .magick import magick_convert, run_magick
from .preprocess import OGR_LAYER_SPECS
from .tools import calculateTiles
from .wpscript import run_world_painter, wp_generate

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
            str(config.minutor_depth),
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


def _process_single_tile(args: tuple) -> None:
    """T003: Per-tile pipeline worker.

    Runs magick → WorldPainter for a single tile.  Image export is handled
    separately (upstream, via image_export) because QGIS export is already
    structured around longitude strips rather than individual tiles.

    Args:
        args: (config, tile) tuple — pebble passes a single positional arg.
    """
    config, tile = args
    try:
        run_magick(config, tile)
        run_world_painter(config, tile)
        logger.info("Pipeline: tile %s complete", tile)
    except Exception as exc:
        logger.error("Pipeline: tile %s failed: %s", tile, exc)


def _generate_tiles_pipeline(config: GeneratorConfig) -> None:
    """T003 pipeline mode: export all images first, then process tiles in parallel.

    Each tile independently runs magick + WorldPainter so that intermediate
    files are consumed (and can be cleaned up) as soon as they are ready,
    keeping peak disk usage lower than the stage-by-stage approach.
    """
    # OSM links are global (shared across all tiles), keep as-is.
    copy_osm_files(config)

    # Image export is longitude-strip-based and cannot easily be per-tile;
    # run it in full before the per-tile stage.
    image_export(config)

    degree_per_tile = config.degree_per_tile
    tile_args = []
    for x_min in range(-180, 180, degree_per_tile):
        for y_min in range(-90, 90, degree_per_tile):
            tile = calculateTiles(x_min, y_min + degree_per_tile)
            tile_args.append((config, tile))

    logger.info("Pipeline mode: processing %d tiles with %d workers", len(tile_args), config.threads)
    pool = pebble.ProcessPool(
        max_workers=config.threads,
        max_tasks=1,
        context=mp.get_context("forkserver"),
    )
    for args in tile_args:
        pool.schedule(_process_single_tile, [args])
    pool.close()
    pool.join()

    post_process_map(config)


def generate_tiles(config: GeneratorConfig) -> None:
    if config.tile_pipeline_mode:
        logger.info("Using tile pipeline mode (T003)")
        _generate_tiles_pipeline(config)
    else:
        copy_osm_files(config)
        image_export(config)
        magick_convert(config)
        wp_generate(config)
        post_process_map(config)


__all__ = ["generate_tiles", "copy_osm_files", "post_process_map"]
