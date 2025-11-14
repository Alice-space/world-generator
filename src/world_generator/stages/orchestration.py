"""Pipeline orchestration and entry point."""

from __future__ import annotations

from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path

from ..adapters.wp import post_merge, worldpaint
from ..core.settings import Config
from ..utils.tiles import deliver_osm_inputs, iter_tiles
from .magick import stage_magick_convert
from .osm import stage_osm_preprocess
from .qgis_export import stage_qgis_export
from .qgis_fix import stage_qgis_fix_geometries


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
    stage_qgis_export(cfg)  # renamed from stage_export_images
    stage_magick_convert(cfg)
    # Deliver OSM layer inputs to WorldPainter scripts area
    deliver_osm_inputs(
        Path(cfg.osm_folder_path, "all"), Path(cfg.scripts_folder_path), cfg.osm_switch
    )
    print("Generating tiles with WorldPainter ...")
    with ProcessPoolExecutor(max_workers=cfg.threads) as pool:
        futs = []
        for _, _, tile in iter_tiles():
            futs.append(
                pool.submit(
                    worldpaint,
                    tile,
                    cfg.degree_per_tile,
                    cfg.blocks_per_tile,
                    cfg.height_ratio,
                    Path(cfg.scripts_folder_path),
                )
            )
        for f in as_completed(futs):
            try:
                f.result()
            except Exception as e:
                print(f"Tile generation failed: {e}")
                raise
    # Final merge and preview
    _ = post_merge(Path(cfg.scripts_folder_path), cfg.world_name)
    print(f"Pipeline completed for world: {cfg.world_name}")
