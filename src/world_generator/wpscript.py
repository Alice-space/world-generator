"""WorldPainter automation helpers."""

import json
from pathlib import Path
import logging
import multiprocessing as mp
import os
import queue
import shutil
import subprocess
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

import pebble

from .config import GeneratorConfig
from .tools import calculateTiles

logger = logging.getLogger(__name__)


def _run_minutor(config: GeneratorConfig, tile: str, exports_folder) -> None:
    """Render a per-tile PNG preview with minutor (non-blocking helper).

    Uses QT_QPA_PLATFORM=offscreen so that minutor works inside worker processes
    that may not have access to an X display (e.g. multiprocessing.Pool workers).
    """
    if not exports_folder.exists():
        logger.debug("Skipping minutor for %s: exports folder gone (already merged)", tile)
        return
    minutor_png = config.scripts_folder_path / "render" / f"{tile}.png"
    (config.scripts_folder_path / "render").mkdir(parents=True, exist_ok=True)
    env = os.environ.copy()
    env.setdefault("QT_QPA_PLATFORM", "offscreen")
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
        env=env,
    )
    if render_result.stdout.strip():
        logger.info("minutor for %s output: %s", tile, render_result.stdout.strip())
    if render_result.stderr.strip():
        logger.error("minutor for %s error: %s", tile, render_result.stderr.strip())


def _run_minutor_world(config: GeneratorConfig, tile: str) -> None:
    """Render minutor preview from the final merged world (after tile cleanup)."""
    minutor_png = config.scripts_folder_path / "render" / f"{tile}.png"
    (config.scripts_folder_path / "render").mkdir(parents=True, exist_ok=True)
    env = os.environ.copy()
    env.setdefault("QT_QPA_PLATFORM", "offscreen")
    render_result = subprocess.run(
        [
            "minutor",
            "--world",
            str(config.world_output_dir),
            "--depth",
            str(config.minutor_depth),
            "--savepng",
            str(minutor_png),
        ],
        capture_output=True,
        text=True,
        env=env,
    )
    if render_result.stdout.strip():
        logger.debug("minutor for %s output: %s", tile, render_result.stdout.strip())
    if render_result.stderr.strip():
        logger.warning("minutor for %s error: %s", tile, render_result.stderr.strip())


# Module-level cache of pure-ocean tiles loaded from the pre-scan file.
# Populated once on first access to speed up ocean tile checks from O(0.4s
# identify call) to O(1) dict lookup.
_ocean_tile_cache: set[str] | None = None


def _load_ocean_tile_cache(config: GeneratorConfig) -> set[str]:
    """Load the pre-scanned ocean tile list from disk (one tile name per line)."""
    global _ocean_tile_cache
    if _ocean_tile_cache is not None:
        return _ocean_tile_cache
    cache_path = config.scripts_folder_path / "ocean_tiles.txt"
    if cache_path.is_file():
        try:
            _ocean_tile_cache = set(
                line.strip() for line in cache_path.read_text().splitlines()
                if line.strip()
            )
            logger.info("Loaded %d ocean tiles from cache", len(_ocean_tile_cache))
        except Exception as exc:
            logger.warning("Failed to load ocean tile cache: %s", exc)
            _ocean_tile_cache = set()
    else:
        _ocean_tile_cache = set()
    return _ocean_tile_cache


def _is_ocean_tile(config: GeneratorConfig, tile: str) -> bool:
    """Check whether *tile* is a pure-ocean tile.

    Uses the pre-scanned cache (``ocean_tiles.txt``) for O(1) lookups.  Falls
    back to counting unique colours in the QGIS climate export with ImageMagick
    if the cache is not yet available.
    """
    cache = _load_ocean_tile_cache(config)
    if cache:
        return tile in cache
    # Slow path: inline identify call (0.4s)
    climate_png = config.image_exports_dir / tile / f"{tile}_climate.png"
    if not climate_png.is_file():
        return False
    try:
        result = subprocess.run(
            ["identify", "-format", "%k", str(climate_png)],
            capture_output=True, text=True, timeout=10,
        )
        return result.returncode == 0 and result.stdout.strip() == "1"
    except Exception:
        return False


def run_world_painter(config: GeneratorConfig, tile: str) -> None:
    """Run WorldPainter for a single tile, then merge to final world and clean up.

    After wpscript exports the tile as .mca region files, this function immediately:
    1. Moves .mca files to the final Minecraft world (incremental merge)
    2. Deletes the tile's intermediate exports directory
    3. Deletes the .world file (no longer needed after export)
    4. Cleans up image_exports for this tile to free disk space

    A per-tile sentinel file (``.tile_<TILE>.done``) in the final region dir
    marks completion so that re-runs skip already-processed tiles.
    """
    scripts_folder = config.scripts_folder_path

    # Sentinel file in final world marks completed tiles
    final_region = config.world_output_dir / "region"
    done_marker = final_region / f".tile_{tile}.done"
    if done_marker.exists():
        logger.info("Skipping WorldPainter for %s (already merged)", tile)
        return

    # Ocean fast path: use minimal wpscript_ocean.js for pure-ocean tiles
    ocean = _is_ocean_tile(config, tile)
    if ocean:
        script_js = scripts_folder / "wpscript_ocean.js"
        logger.debug("Tile %s: ocean fast path", tile)
    else:
        script_js = scripts_folder / "wpscript.js"
        logger.info("WorldPainter for %s", tile)

    exports_folder = scripts_folder / "wpscript" / "exports" / tile
    world_file = scripts_folder / "wpscript" / "worldpainter_files" / f"{tile}.world"
    world_file.parent.mkdir(parents=True, exist_ok=True)
    exports_folder.parent.mkdir(parents=True, exist_ok=True)

    # If .world file exists but exports were never merged (no done marker),
    # the previous attempt failed — clean up stale .world and retry.
    if world_file.exists():
        logger.info("Stale .world file for %s, removing and retrying", tile)
        world_file.unlink()

    args = [
        "wpscript",
        str(script_js),
        str(scripts_folder) + "/",  # wpscript.js loadLayerFromFile concatenates path + relativePath without separator
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
    # Redirect wpscript stdout/stderr to a per-tile log file instead of using
    # capture_output=True.  PIPE-based capture can deadlock when the wpscript
    # JVM writes several MB of log output (the OS pipe buffer fills up before
    # Python's communicate() reader thread drains it, blocking the JVM).
    wp_log_dir = scripts_folder / "wpscript" / "logs"
    wp_log_dir.mkdir(parents=True, exist_ok=True)
    wp_out_path = wp_log_dir / f"{tile}.log"
    with open(wp_out_path, "w") as wp_log:
        result = subprocess.run(
            args,
            stdout=wp_log,
            stderr=subprocess.STDOUT,
            cwd=str(scripts_folder),
        )
    if result.returncode != 0:
        try:
            tail = wp_out_path.read_text().splitlines()[-20:]
            logger.error(
                "WorldPainter for %s FAILED (exit %d):\n%s",
                tile,
                result.returncode,
                "\n".join(tail),
            )
        except Exception:
            logger.error(
                "WorldPainter for %s FAILED (exit %d)", tile, result.returncode
            )
        return

    # ---- Incremental cleanup: merge exports → final world, delete intermediates ----
    _merge_and_cleanup(config, tile, exports_folder, world_file, done_marker)

    # Minutor preview AFTER cleanup — at this point exports_folder is gone (merged),
    # so render from the final world instead. Uses QT_QPA_PLATFORM=offscreen to
    # work without an X display in worker subprocesses.
    _MINUTOR_EXECUTOR.submit(_run_minutor_world, config, tile)


def _merge_and_cleanup(
    config: GeneratorConfig,
    tile: str,
    exports_folder: Path,
    world_file: Path,
    done_marker: Path,
) -> None:
    """Move .mca exports to final world and delete all intermediate files for *tile*.

    This is the key space-saving step: instead of keeping per-tile exports on disk
    until a batch ``post_process_map``, each tile's .mca files are moved into the
    final ``region/`` directory immediately after WorldPainter finishes.  Then all
    intermediate artifacts (.world, raw QGIS PNGs) are deleted.
    """
    final_region = config.world_output_dir / "region"
    final_region.mkdir(parents=True, exist_ok=True)

    # Move .mca region files to final world
    region_dir = exports_folder / "region"
    moved = 0
    if region_dir.is_dir():
        for mca_file in region_dir.iterdir():
            if mca_file.is_file():
                try:
                    dest = final_region / mca_file.name
                    shutil.move(str(mca_file), str(dest))
                    moved += 1
                except OSError as exc:
                    logger.warning(
                        "Failed to move %s → %s: %s", mca_file, dest, exc
                    )
        try:
            shutil.rmtree(str(exports_folder))
        except OSError as exc:
            logger.warning("Failed to remove exports dir %s: %s", exports_folder, exc)
    logger.info("Tile %s: merged %d .mca files into final world", tile, moved)

    # Delete .world file after successful export
    try:
        world_file.unlink(missing_ok=True)
    except OSError as exc:
        logger.warning("Failed to remove .world file %s: %s", world_file, exc)

    # Delete image_exports for this tile to reclaim disk space
    tile_img_dir = config.image_exports_dir / tile
    if tile_img_dir.exists():
        try:
            shutil.rmtree(str(tile_img_dir))
            logger.debug("Cleaned up image_exports for %s", tile)
        except OSError as exc:
            logger.warning("Failed to remove image_exports for %s: %s", tile, exc)

    # Write sentinel marker so re-runs skip this tile
    try:
        done_marker.touch()
    except OSError as exc:
        logger.warning("Failed to write done marker for %s: %s", tile, exc)


def _drain_stderr(proc: subprocess.Popen, prefix: str) -> None:
    """Read stderr lines in a background thread to prevent pipe buffer deadlock."""
    try:
        for line in proc.stderr:
            if line.strip():
                logger.debug("%s stderr: %s", prefix, line.rstrip())
    except Exception:
        pass  # pipe closed during shutdown


# Module-level thread pool shared across all worker processes forked by pebble.
# ThreadPoolExecutor is safe to use after fork (each child process gets its own
# copy).  The pool is intentionally unbounded so minutor jobs are never dropped;
# in practice the number of in-flight minutor jobs is bounded by the number of
# wpscript jobs that have completed, which is at most wp_parallel_workers.
_MINUTOR_EXECUTOR: ThreadPoolExecutor = ThreadPoolExecutor(
    max_workers=4, thread_name_prefix="minutor"
)


class WPDaemon:
    """Manages a single persistent wpscript JVM process running wp_daemon_driver.js.

    The daemon keeps the JVM alive across multiple tile requests, eliminating the
    5-10 s cold-start cost of spawning a fresh wpscript process per tile.  Communication
    uses newline-delimited JSON (NDJSON) over stdin/stdout pipes.
    """

    def __init__(self, config: GeneratorConfig, worker_id: int) -> None:
        self.config = config
        self.worker_id = worker_id
        self._proc: subprocess.Popen | None = None
        self._tiles_processed: int = 0
        self._lock = threading.Lock()

    def start(self) -> None:
        """Launch the daemon JVM process and wait for the ready signal."""
        args = self._build_static_args()
        self._proc = subprocess.Popen(
            args,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,  # line-buffered
        )
        # Drain stderr in a background thread to prevent pipe-buffer deadlock.
        # Without this, if the JVM writes enough stderr output the pipe fills up
        # and the subprocess blocks on write, hanging the daemon.
        self._stderr_thread = threading.Thread(
            target=_drain_stderr,
            args=[self._proc, f"WPDaemon-{self.worker_id}"],
            daemon=True,
        )
        self._stderr_thread.start()
        ready_line = self._proc.stdout.readline()
        if not ready_line:
            stderr_out = self._proc.stderr.read()
            raise RuntimeError(
                f"Daemon {self.worker_id} produced no ready signal. stderr: {stderr_out!r}"
            )
        msg = json.loads(ready_line)
        if msg.get("status") != "ready":
            raise RuntimeError(
                f"Daemon {self.worker_id} did not send ready: {ready_line!r}"
            )
        logger.info("WPDaemon %d ready (pid=%d)", self.worker_id, self._proc.pid)

    def process_tile(
        self, tile: str, dir_lat: str, lat: int, dir_lon: str, lon: int
    ) -> None:
        """Send one tile request and block until the daemon responds with done or error."""
        request = json.dumps({
            "tile": tile,
            "dir_lat": dir_lat,
            "lat": lat,
            "dir_lon": dir_lon,
            "lon": lon,
        })
        self._proc.stdin.write(request + "\n")
        self._proc.stdin.flush()
        response_line = self._proc.stdout.readline()
        if not response_line:
            stderr_out = self._proc.stderr.read()
            raise RuntimeError(
                f"Daemon {self.worker_id} closed stdout unexpectedly while processing {tile}. "
                f"stderr: {stderr_out!r}"
            )
        msg = json.loads(response_line)
        self._tiles_processed += 1
        if msg.get("status") == "error":
            raise RuntimeError(
                f"Daemon {self.worker_id} error on {tile}: {msg.get('message')}"
            )
        logger.debug(
            "WPDaemon %d finished tile %s (%d total)",
            self.worker_id,
            tile,
            self._tiles_processed,
        )

    def shutdown(self) -> None:
        """Send shutdown command and wait for process exit."""
        if self._proc and self._proc.poll() is None:
            try:
                self._proc.stdin.write(json.dumps({"command": "shutdown"}) + "\n")
                self._proc.stdin.flush()
                self._proc.wait(timeout=30)
            except Exception as exc:  # noqa: BLE001
                logger.warning(
                    "WPDaemon %d shutdown error: %s; killing process", self.worker_id, exc
                )
                self._proc.kill()
        logger.info("WPDaemon %d shut down", self.worker_id)

    def needs_restart(self) -> bool:
        """Return True if this daemon has processed >= max_tiles_per_worker tiles."""
        return self._tiles_processed >= self.config.wp_max_tiles_per_worker

    def _build_static_args(self) -> list[str]:
        """Build the wpscript command-line args for the daemon driver.

        Static args are positional and match the convention agreed with T012:
          1.  path             (scripts_folder_path + "/")
          2.  scale            (blocks_per_tile)
          3.  tilesPerMap      (degree_per_tile)
          4.  verticalScale    (height_ratio)
          5-17. settings flags (borders, highways, ores, rivers, water, glaciers,
                                harbours, dams, roads, footpaths, railways,
                                settlementsLayers, streams)
          18. settingsMapVersion   (wp_version_range)
          19. settingsMapOffset    (wp_sea_level)
          20. settingsLowerBuildLimit (wp_min_height)
          21. settingsUpperBuildLimit (wp_max_height)
          22. settingsVanillaPopulation ("True")
          23. biomeSource      (wp_biome_mode)
          24. oreModifier      (wp_biome_precision)
          25-29. mod flags     (all "False")

        Per-tile args (directionLatitude, latitude, directionLongitute, longitute,
        heightmapName) arrive via stdin JSON.
        """
        cfg = self.config
        scripts_folder = str(cfg.scripts_folder_path) + "/"
        # Look for wp_daemon_driver.js in scripts_folder first (where ensure_workspace_assets
        # symlinks it). Fall back to the repo's source Data/ directory if missing.
        candidates = [
            cfg.scripts_folder_path / "wp_daemon_driver.js",
            cfg.scripts_folder_path / "Data" / "wp_daemon_driver.js",
            Path(__file__).resolve().parents[2] / "Data" / "wp_daemon_driver.js",
        ]
        driver_js = next((str(p) for p in candidates if p.exists()), str(candidates[0]))
        return [
            "wpscript",
            driver_js,
            scripts_folder,                   # 1. path
            str(cfg.blocks_per_tile),          # 2. scale
            str(cfg.degree_per_tile),          # 3. tilesPerMap
            str(cfg.height_ratio),             # 4. verticalScale
            # 5-17. settings flags (same boolean sequence as current wpscript args)
            "True",   # settingsBorders
            "False",  # settingsHighways
            "False",  # settingsOres
            "False",  # settingsRivers
            "False",  # settingsWater
            "False",  # settingsGlaciers
            "False",  # settingsHarbours
            "True",   # settingsDams
            "True",   # settingsRoads
            "True",   # settingsFootpaths
            "True",   # settingsRailways
            "False",  # settingsSettlementsLayers
            "True",   # settingsStreams
            cfg.wp_version_range,              # 18. settingsMapVersion
            str(cfg.wp_sea_level),             # 19. settingsMapOffset
            str(cfg.wp_min_height),            # 20. settingsLowerBuildLimit
            str(cfg.wp_max_height),            # 21. settingsUpperBuildLimit
            "True",                            # 22. settingsVanillaPopulation
            cfg.wp_biome_mode,                 # 23. biomeSource
            str(cfg.wp_biome_precision),       # 24. oreModifier
            "False",  # 25. mod flag 1
            "False",  # 26. mod flag 2
            "False",  # 27. mod flag 3
            "False",  # 28. mod flag 4
            "False",  # 29. mod flag 5
        ]


class WPDaemonPool:
    """Pool of N persistent WPDaemon processes with thread-safe work distribution.

    Tiles are dispatched to idle daemons via a Queue.  After each tile the daemon
    is returned to the pool; if it has hit max_tiles_per_worker it is restarted
    transparently before being re-queued.
    """

    def __init__(self, config: GeneratorConfig) -> None:
        self.config = config
        self._daemons: list[WPDaemon] = []
        self._available: queue.Queue[WPDaemon] = queue.Queue()

    def start(self) -> None:
        """Start all daemon workers."""
        for i in range(self.config.wp_parallel_workers):
            d = WPDaemon(self.config, i)
            d.start()
            self._daemons.append(d)
            self._available.put(d)
        logger.info(
            "WPDaemonPool started with %d workers", self.config.wp_parallel_workers
        )

    def process_tile(
        self, tile: str, dir_lat: str, lat: int, dir_lon: str, lon: int
    ) -> None:
        """Acquire a daemon, process one tile, then release the daemon back to the pool."""
        daemon = self._available.get()
        try:
            daemon.process_tile(tile, dir_lat, lat, dir_lon, lon)
        finally:
            if daemon.needs_restart():
                logger.info(
                    "WPDaemon %d hit max_tiles_per_worker (%d), restarting",
                    daemon.worker_id,
                    self.config.wp_max_tiles_per_worker,
                )
                daemon.shutdown()
                daemon._tiles_processed = 0
                daemon.start()
            self._available.put(daemon)

        # Incremental cleanup after successful export
        scripts_folder = self.config.scripts_folder_path
        exports_folder = scripts_folder / "wpscript" / "exports" / tile
        world_file = scripts_folder / "wpscript" / "worldpainter_files" / f"{tile}.world"
        final_region = self.config.world_output_dir / "region"
        done_marker = final_region / f".tile_{tile}.done"
        _merge_and_cleanup(self.config, tile, exports_folder, world_file, done_marker)

    def shutdown(self) -> None:
        """Shut down all daemon workers."""
        for d in self._daemons:
            try:
                d.shutdown()
            except Exception as exc:  # noqa: BLE001
                logger.warning(
                    "Error shutting down WPDaemon %d: %s", d.worker_id, exc
                )
        logger.info("WPDaemonPool shut down")


def _wp_generate_daemon(config: GeneratorConfig) -> None:
    """Generate all tiles using the persistent daemon pool."""
    final_region = config.world_output_dir / "region"
    final_region.mkdir(parents=True, exist_ok=True)

    pool = WPDaemonPool(config)
    pool.start()
    try:
        degree = config.degree_per_tile
        with ThreadPoolExecutor(max_workers=config.wp_parallel_workers) as executor:
            futures = []
            for x_min in range(-180, 180, degree):
                for y_min in range(-90, 90, degree):
                    tile = calculateTiles(x_min, y_min + degree)
                    done_marker = final_region / f".tile_{tile}.done"
                    if done_marker.exists():
                        continue
                    dir_lat = tile[0:1]
                    lat = int(tile[1:3])
                    dir_lon = tile[3:4]
                    lon = int(tile[4:7])
                    futures.append(
                        executor.submit(
                            pool.process_tile, tile, dir_lat, lat, dir_lon, lon
                        )
                    )
            for f in futures:
                f.result()  # propagate exceptions
    finally:
        pool.shutdown()

    logger.info("Daemon WorldPainter jobs done; waiting for minutor renders")
    _MINUTOR_EXECUTOR.shutdown(wait=True, cancel_futures=False)
    logger.info("All WorldPainter + minutor jobs completed")


def _wp_generate_legacy(config: GeneratorConfig) -> None:
    """Schedule all WorldPainter tile jobs using ``ThreadPoolExecutor``.

    Uses ``config.wp_parallel_workers`` as the pool size.  Threads (not processes)
    are used because the heavy work is in external wpscript JVM subprocesses
    (``subprocess.run``), which release the GIL.  This avoids the fork overhead
    and reliability issues of ``multiprocessing.Pool`` with ``maxtasksperchild=1``
    when handling 55k+ tiles.

    Tiles already merged into the final world (detected via ``.tile_<TILE>.done``
    sentinel) are skipped so that the pipeline can be safely re-run.
    """
    degree_per_tile = config.degree_per_tile
    workers = config.wp_parallel_workers
    logger.info(
        "Starting WorldPainter stage (legacy mode) with wp_parallel_workers=%d", workers
    )
    final_region = config.world_output_dir / "region"
    final_region.mkdir(parents=True, exist_ok=True)

    # Build list of pending tiles
    pending_tiles: list[str] = []
    for x_min in range(-180, 180, degree_per_tile):
        for y_min in range(-90, 90, degree_per_tile):
            tile = calculateTiles(x_min, y_min + degree_per_tile)
            done_marker = final_region / f".tile_{tile}.done"
            if not done_marker.exists():
                pending_tiles.append(tile)

    total_tiles = 360 * 180 // (degree_per_tile * degree_per_tile)
    done_count = total_tiles - len(pending_tiles)
    logger.info(
        "WP legacy: %d tiles pending, %d already done",
        len(pending_tiles),
        done_count,
    )

    if not pending_tiles:
        logger.info("No pending tiles; WorldPainter stage complete")
        return

    failures: list[tuple[str, str]] = []
    completed: int = 0
    progress_interval: int = max(1, len(pending_tiles) // 200)  # log ~200 times

    with ThreadPoolExecutor(max_workers=workers) as executor:
        future_to_tile = {
            executor.submit(run_world_painter, config, tile): tile
            for tile in pending_tiles
        }

        for future in as_completed(future_to_tile):
            tile = future_to_tile[future]
            try:
                future.result(timeout=3600)
                completed += 1
                if completed % progress_interval == 0:
                    pct = completed * 100.0 / len(pending_tiles)
                    logger.info(
                        "WP progress: %d/%d tiles (%.1f%%), %d failures so far",
                        completed + done_count,
                        total_tiles,
                        (completed + done_count) * 100.0 / total_tiles,
                        len(failures),
                    )
            except Exception as exc:
                failures.append((tile, str(exc)))
                logger.error("Tile %s failed: %s", tile, exc)

    if failures:
        logger.error(
            "WP legacy: %d / %d tiles failed", len(failures), len(pending_tiles)
        )
        for tile, err in failures[:20]:
            logger.error("  %s: %s", tile, err)
        try:
            failure_log = config.scripts_folder_path / "wp_failures.txt"
            with failure_log.open("a") as fh:
                for tile, err in failures:
                    fh.write(f"tile={tile} err={err}\n")
        except Exception as exc:
            logger.warning("Could not write WP failure log: %s", exc)

    logger.info(
        "Legacy WP done: %d ok, %d failed",
        len(pending_tiles) - len(failures),
        len(failures),
    )

    logger.info("WorldPainter jobs done; waiting for minutor renders to finish")
    _MINUTOR_EXECUTOR.shutdown(wait=True, cancel_futures=False)
    logger.info("All WorldPainter + minutor jobs completed")


def wp_generate(config: GeneratorConfig) -> None:
    """Schedule all WorldPainter tile jobs.

    When ``config.wp_use_daemon`` is True (default), tiles are dispatched to a
    pool of persistent JVM daemon processes, eliminating the 5-10 s cold-start
    cost per tile.  If daemon mode fails to start (e.g. wp_daemon_driver.js
    not found), the system automatically falls back to the legacy pebble
    ProcessPool path with a warning log.

    When ``config.wp_use_daemon`` is False, the legacy mode is used directly.
    """
    if config.wp_use_daemon:
        try:
            _wp_generate_daemon(config)
        except Exception as exc:
            logger.warning(
                "Daemon mode failed (%s), falling back to legacy mode", exc
            )
            _wp_generate_legacy(config)
    else:
        _wp_generate_legacy(config)


__all__ = ["run_world_painter", "wp_generate", "WPDaemon", "WPDaemonPool"]
