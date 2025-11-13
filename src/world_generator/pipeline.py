from __future__ import annotations

import logging
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path
from typing import MutableMapping

from .settings import Config
from .osm import OSMPreprocessor, ALL_OSM_FILES, OSM_POSTFIX
from .export import fix_geometry, export_image
from .tileops import iter_tiles, calculate_tiles, deliver_osm_inputs
from .wp import worldpaint, post_merge
from .mag import magick_run, composite, convert

logger = logging.getLogger(__name__)


def stage_osm_preprocess(cfg: Config) -> None:
    osm_all = Path(cfg.osm_folder_path, "all")
    osm_all.mkdir(parents=True, exist_ok=True)

    osm_files_exist = all(osm_all.joinpath(f"{name}.osm").exists() for name in ALL_OSM_FILES)
    if osm_files_exist:
        logger.info("OSM files already exist; skipping preprocessing")
        return

    logger.info("Starting OSM preprocessing ...")
    with OSMPreprocessor(osm_all) as proc:
        proc.apply_file(str(cfg.pbf_path))
    logger.info("OSM preprocessing completed")


def _fix(output_name: str, osm_all: Path, cfg: Config) -> None:
    source_file = Path(osm_all, OSM_POSTFIX[output_name][0] + ".osm")
    out_shp = Path(osm_all, f"{output_name}.shp")
    if out_shp.exists():
        return
    params = {
        "INPUT": str(source_file) + OSM_POSTFIX[output_name][1],
        "OUTPUT": str(out_shp),
    }
    fix_geometry(cfg.qgis_project_path, "native:fixgeometries", params)
    logger.info("Fixed geometry %s -> %s", output_name, out_shp)


def stage_qgis_fix_geometries(cfg: Config) -> None:
    osm_all = Path(cfg.osm_folder_path, "all")
    all_exist = all(osm_all.joinpath(f"{name}.shp").exists() for name in OSM_POSTFIX)
    if all_exist:
        logger.info("QGIS shapefiles already exist; skipping fix")
        return

    logger.info("Fixing geometries with QGIS ...")
    with ProcessPoolExecutor(max_workers=cfg.threads) as pool:
        futures = [pool.submit(_fix, name, osm_all, cfg) for name in OSM_POSTFIX]
        for f in as_completed(futures):
            f.result()
    logger.info("QGIS fix geometries completed")


LAYER_NAMES: MutableMapping[str, tuple[str, ...]] = {
    "slope": ("slope",),
    "landuse": ("landuse",),
    "water": ("water",),
    "river": (cfg.rivers,),  # type: ignore[attr-defined]
    "wet": ("wet_glacier", "wet_swamp"),
    "road": ("road",),
    "climate": ("climate",),
    "ecoregions": ("wwf_terr_ecos",),
    "pine": ("EvergreenDeciduousNeedleleafTrees", "vegetation_background"),
    "mixed": ("mixedTrees", "vegetation_background"),
    "deciduous": ("DeciduousBroadleafTrees", "vegetation_background"),
    "jungle": ("EvergreenBroadleafTrees", "vegetation_background"),
    "shrubs": ("Shrubs", "vegetation_background"),
    "herbs": ("HerbaceousVegetation", "vegetation_background"),
    "wither_rose": ("halfeti_rose",),
    "snow": ("Snow", "vegetation_background"),
    "groundcover": ("groundcover",),
    "border": ("cntryCurrent",),
    "stateborder": ("stateBorder",),
    "corals": ("corals",),
    "stream": ("stream",),
    "ocean_temp": ("ocean_temp",),
    "longitude": ("longitude",),
    "latitude": ("latitude",),
    "aerodrome": ("aerodrome",),
    "easter_eggs": ("easter_egg",),
}


def _tiles_x_chunks(threads: int) -> list[tuple[int, int]]:
    x_per = 360 // threads
    xs = [(-180 + x_per * i) for i in range(threads)]
    xe = [(-180 + x_per * (i + 1)) for i in range(threads)]
    xe[-1] = 180
    return list(zip(xs, xe))


def stage_export_images(cfg: Config) -> None:
    out_root = Path(cfg.scripts_folder_path, "image_exports")
    if not out_root.exists():
        out_root.mkdir(parents=True, exist_ok=True)

    dpt = cfg.degree_per_tile
    bpt = cfg.blocks_per_tile
    chunks = _tiles_x_chunks(cfg.threads)

    logger.info("Export heightmap/source ...")
    if LAYER_NAMES.get("river"):
        # resolve river layer name dynamically
        LAYER_NAMES["river"] = (cfg.rivers,)

    for chunk_x, chunk_xe in chunks:
        export_image(cfg.qgis_project_path, bpt, dpt, chunk_x, chunk_xe, -90, 90, "", tuple())

    logger.info("Export base layers ...")
    for name, layers in LAYER_NAMES.items():
        for chunk_x, chunk_xe in chunks:
            export_image(cfg.qgis_project_path, bpt, dpt, chunk_x, chunk_xe, -90, 90, name, layers)

    # Optional terrain (unless using low quality fallback)
    if cfg.use_heigh_quality_terrain:
        logger.info("Export terrain HQ ...")
        for chunk_x, chunk_xe in chunks:
            export_image(cfg.qgis_terrain_project_path, bpt, dpt, chunk_x, chunk_xe, -90, 90, "terrain", ("TrueMarble",))

    # Bathymetry
    logger.info("Export bathymetry ...")
    for chunk_x, chunk_xe in chunks:
        export_image(
            cfg.qgis_bathymetry_project_path,
            bpt,
            dpt,
            chunk_x,
            chunk_xe,
            -90,
            90,
            "bathymetry",
            ("land_polygons", "bathymetry_source", "background_bathymetry"),
        )

    # Heightmap via gdal_translate (HQ tif -> tiled 16-bit png)
    logger.info("Export heightmap via gdal ...")
    hq_tif = Path(Path(cfg.qgis_heightmap_project_path).parent, "TifFiles", "HQheightmap.tif")
    if not hq_tif.exists():
        raise FileNotFoundError(f"Missing heightmap source: {hq_tif}")
    for x in range(-180, 180, dpt):
        for y in range(-90, 90, dpt):
            tile = calculate_tiles(x, y + dpt)
            folder = Path(out_root, tile)
            hdir = folder / "heightmap"
            hdir.mkdir(parents=True, exist_ok=True)
            out_png = hdir / f"{tile}_exported.png"
            if out_png.exists():
                continue
            cmd = [
                "gdal_translate",
                "-a_nodata", "none",
                "-outsize", str(bpt), str(bpt),
                "-projwin", str(x), str(y + dpt), str(x + dpt), str(y),
                "-Of", "PNG",
                "-ot", "UInt16",
                "-scale", "-1152", "8848", "0", "65535",
                str(hq_tif),
                str(out_png),
            ]
            try:
                magick_run(cmd)
            except Exception as e:
                logger.error("gdal_translate failed for %s: %s", tile, e)
                raise
    logger.info("Image export completed")


def stage_magick_convert(cfg: Config) -> None:
    logger.info("ImageMagick conversions ...")
    bpt = cfg.blocks_per_tile
    out_root = Path(cfg.scripts_folder_path, "image_exports")
    hdir = Path(cfg.scripts_folder_path, "image_exports")
    hdir.mkdir(parents=True, exist_ok=True)
    work = []
    for _, _, tile in iter_tiles():
        folder = Path(out_root, tile)
        # Example water processing
        if not (folder / f"{tile}_terrain_reduced_colors.png").exists():
            work.append(tile)

    def _pipe(tile: str) -> None:
        folder = Path(out_root, tile)
        # 'water' to mask
        water_src = folder / f"{tile}_water.png"
        water_tmp = folder / f"{tile}_water_temp.png"
        water_mask = folder / f"{tile}_water_mask.png"
        convert(water_src, water_tmp)
        magick_run(["convert", water_tmp, "-draw", "point 1,1", "-fill", "black", water_tmp])
        magick_run(["convert", "-negate", water_tmp, "-threshold", "1%%", water_mask])
        magick_run(["convert", water_mask, "-transparent", "black", water_mask])
        # 'river' to mask
        river_src = folder / f"{tile}_river.png"
        river_tmp = folder / f"{tile}_river_temp.png"
        river_mask = folder / f"{tile}_river_mask.png"
        convert(river_src, river_tmp)
        magick_run(["convert", river_tmp, "-draw", "point 1,1", "-fill", "black", river_tmp])
        magick_run(["convert", "-negate", river_tmp, "-threshold", "1%%", river_mask])
        magick_run(["convert", river_mask, "-transparent", "black", river_mask])
        # combine masks into transparent overlay
        water_trans = folder / f"{tile}_water_transparent.png"
        magick_run(["composite", "-gravity", "center", water_mask, river_mask, water_trans])
        # heightmap edge fill
        hdir = folder / "heightmap"
        h_edges = hdir / f"{tile}_edges.png"
        h_valid_removed = hdir / f"{tile}_removed_invalid.png"
        h_filled = hdir / f"{tile}_invalid_filled.png"
        supported = folder / f"{tile}_height_supported.png"
        flats = folder / f"{tile}_flats_processed.png"
        terrain_reduced = folder / f"{tile}_terrain_reduced_colors.png"
        # 16-bit, remove black transparency; optionally fill holes via morphology
        magick_run(["convert", hdir / f"{tile}_exported.png", "-transparent", "black", "-depth", "16", h_valid_removed])
        magick_run([
            "convert", h_valid_removed, "-channel", "A", "-morphology", "EdgeIn", "Diamond",
            "-depth", "16", h_edges
        ])
        # Downsample-deduplicate smooth
        cond = ["("] + ["+clone", "-resize", "50%%"] * 10 + ["-layers", "RemoveDups", "-filter", "Gaussian", "-resize", f"{bpt}x{bpt}!", "-reverse", "-background", "None", "-flatten", "-alpha", "off", ")"]
        cmd = ["convert", h_edges] + cond + ["-depth", "16", h_filled]
        magick_run(cmd)
        # composite support map (land/water mask) over height
        magick_run(["composite", "-gravity", "center", water_trans, h_filled, supported])
        # Mask out deep water on flats
        flats_src = folder / f"{tile}_flats.png"
        flats_masked = folder / f"{tile}_flats_masked.png"
        magick_run(["composite", "-gravity", "center", flats_src, water_trans, flats_masked])
        # Replace flats in alpha channel
        magick_run(["convert", supported, flats_masked, "-compose", "CopyOpacity", "-composite", flats])
        # Reduce colors if using HQ terrain
        backup = folder / f"{tile}_backupterrain.png"
        if (folder / f"{tile}_terrain.png").exists():
            # Copy into terrain.png for consistency
            import shutil
            shutil.copy(folder / f"{tile}_terrain.png", folder / f"{tile}_terrain.png")
        else:
            # Ensure a terrain png exists
            import shutil
            if backup.exists():
                shutil.copy(backup, folder / f"{tile}_terrain.png")
        if cfg.use_heigh_quality_terrain:
            magick_run(["convert", folder / f"{tile}_terrain.png", "+dither", "-colors", "256", terrain_reduced])
    with ProcessPoolExecutor(max_workers=cfg.threads) as pool:
        futs = [pool.submit(_pipe, tile) for tile in work]
        for f in as_completed(futs):
            try:
                f.result()
            except Exception as e:
                logger.error("Magick tile processing failed: %s", e)
                raise
    logger.info("ImageMagick conversions completed")


def run(cfg_path: Path | str | None = None) -> None:
    if cfg_path is None or str(cfg_path) == "":
        candidates = [Path.cwd() / "config.yaml", Path.cwd() / "config.yml"]
        for c in candidates:
            if c.exists():
                cfg_path = c
                break
        else:
            raise FileNotFoundError("No config.yaml/yml found in current directory")
    src = Path(cfg_path).expanduser().resolve()
    cfg = Config.from_file(src)

    stage_osm_preprocess(cfg)
    stage_qgis_fix_geometries(cfg)
    stage_export_images(cfg)
    stage_magick_convert(cfg)
    # Deliver OSM layer inputs to WorldPainter scripts area
    deliver_osm_inputs(Path(cfg.osm_folder_path, "all"), Path(cfg.scripts_folder_path), cfg.osm_switch)
    logger.info("Generating tiles with WorldPainter ...")
    with ProcessPoolExecutor(max_workers=cfg.threads) as pool:
        futs = []
        for _, _, tile in iter_tiles():
            futs.append(pool.submit(worldpaint, tile, cfg.degree_per_tile, cfg.blocks_per_tile, cfg.height_ratio, Path(cfg.scripts_folder_path)))
        for f in as_completed(futs):
            try:
                f.result()
            except Exception as e:
                logger.error("Tile generation failed: %s", e)
                raise
    # Final merge and preview
    _ = post_merge(Path(cfg.scripts_folder_path), cfg.world_name)
    logger.info("Pipeline completed for world: %s", cfg.world_name)

