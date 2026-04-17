"""WorldPainter automation helpers."""

import logging
import multiprocessing as mp
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

import pebble

from .config import GeneratorConfig
from .tools import calculateTiles

logger = logging.getLogger(__name__)


def _run_minutor(config: GeneratorConfig, tile: str, exports_folder) -> None:
    """Render a per-tile PNG preview with minutor (non-blocking helper)."""
    minutor_png = config.scripts_folder_path / "render" / f"{tile}.png"
    (config.scripts_folder_path / "render").mkdir(parents=True, exist_ok=True)
    render_result = subprocess.run(
        [
            "minutor",
            "--world",
            str(exports_folder),
            "--depth",
            str(config.minutor_depth),
            "--savepng",
            str(minutor_png),
        ],
        capture_output=True,
        text=True,
    )
    if render_result.stdout.strip():
        logger.info("minutor for %s output: %s", tile, render_result.stdout.strip())
    if render_result.stderr.strip():
        logger.error("minutor for %s error: %s", tile, render_result.stderr.strip())


def run_world_painter(config: GeneratorConfig, tile: str) -> None:
    """Run WorldPainter for a single tile, then trigger minutor asynchronously.

    WorldPainter (wpscript) carries ~5–10 s JVM cold-start cost per invocation.
    Because each tile uses a fully independent world object and many global JS
    variables that are set from positional CLI arguments, batching multiple tiles
    into one JVM session would require substantial JS refactoring with a high risk
    of correctness regressions.  Instead, parallelism is achieved at the Python
    level: ``wp_generate`` launches up to ``wp_parallel_workers`` concurrent
    wpscript processes (configurable, default 2).

    Minutor preview rendering is decoupled from the wpscript step: after wpscript
    finishes this function submits a non-blocking minutor job to a shared
    ThreadPoolExecutor so that it does not delay the next wpscript invocation.
    """
    logger.info("WorldPainter for %s", tile)
    scripts_folder = config.scripts_folder_path
    script_js = scripts_folder / "wpscript.js"

    exports_folder = scripts_folder / "wpscript" / "exports" / tile
    world_file = scripts_folder / "wpscript" / "worldpainter_files" / f"{tile}.world"
    world_file.parent.mkdir(parents=True, exist_ok=True)
    exports_folder.parent.mkdir(parents=True, exist_ok=True)
    if world_file.exists():
        logger.info("Skipping WorldPainter for %s", tile)
        return

    args = [
        "wpscript",
        str(script_js),
        str(scripts_folder),
        tile[0:1],
        str(int(tile[1:3])),
        tile[3:4],
        str(int(tile[4:7])),
        str(config.blocks_per_tile),
        str(config.degree_per_tile),
        str(config.height_ratio),
        "True",
        "False",
        "False",
        "False",
        "False",
        "False",
        "False",
        "True",
        "True",
        "True",
        "True",
        "False",
        "True",
        "True",
        "True",
        "False",
        "True",
        "True",
        "True",
        config.wp_version_range,
        str(config.wp_sea_level),
        str(config.wp_min_height),
        str(config.wp_max_height),
        "True",
        tile,
        config.wp_biome_mode,
        str(config.wp_biome_precision),
        "False",
        "False",
        "False",
        "False",
        "False",
    ]
    result = subprocess.run(args, capture_output=True, text=True)
    logger.info("WorldPainter for %s output: %s", tile, result.stdout.strip())
    if result.stderr.strip():
        logger.error("WorldPainter for %s error: %s", tile, result.stderr.strip())

    # Minutor preview is submitted to the module-level thread pool so that this
    # worker process can return immediately and the pool can start the next tile.
    _MINUTOR_EXECUTOR.submit(_run_minutor, config, tile, exports_folder)


# Module-level thread pool shared across all worker processes forked by pebble.
# ThreadPoolExecutor is safe to use after fork (each child process gets its own
# copy).  The pool is intentionally unbounded so minutor jobs are never dropped;
# in practice the number of in-flight minutor jobs is bounded by the number of
# wpscript jobs that have completed, which is at most wp_parallel_workers.
_MINUTOR_EXECUTOR: ThreadPoolExecutor = ThreadPoolExecutor(
    max_workers=4, thread_name_prefix="minutor"
)


def wp_generate(config: GeneratorConfig) -> None:
    """Schedule all WorldPainter tile jobs with a dedicated worker pool.

    Uses ``config.wp_parallel_workers`` (default 2) as the pool size, keeping
    WP concurrency independent of the ``threads`` setting used by QGIS and
    ImageMagick stages.  Each JVM instance typically requires 4–6 GB RAM, so
    the default is conservative; increase ``wp_parallel_workers`` if sufficient
    memory is available.
    """
    degree_per_tile = config.degree_per_tile
    # Use wp_parallel_workers for WP-specific parallelism, decoupled from threads.
    workers = config.wp_parallel_workers
    logger.info(
        "Starting WorldPainter stage with wp_parallel_workers=%d", workers
    )
    pool = pebble.ProcessPool(
        max_workers=workers,
        max_tasks=1,
        context=mp.get_context("forkserver"),
    )
    for x_min in range(-180, 180, degree_per_tile):
        for y_min in range(-90, 90, degree_per_tile):
            tile = calculateTiles(x_min, y_min + degree_per_tile)
            pool.schedule(run_world_painter, [config, tile])
    pool.close()
    pool.join()

    # Wait for all pending minutor renders to finish before returning.
    logger.info("WorldPainter jobs done; waiting for minutor renders to finish")
    _MINUTOR_EXECUTOR.shutdown(wait=True, cancel_futures=False)
    logger.info("All WorldPainter + minutor jobs completed")


__all__ = ["run_world_painter", "wp_generate"]
