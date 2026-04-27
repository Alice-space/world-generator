"""WorldPainter automation helpers."""

import json
from pathlib import Path
import logging
import multiprocessing as mp
import os
import queue
import subprocess
import threading
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

    WorldPainter (wpscript) carries ~5-10 s JVM cold-start cost per invocation.
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
    pool = WPDaemonPool(config)
    pool.start()
    try:
        degree = config.degree_per_tile
        with ThreadPoolExecutor(max_workers=config.wp_parallel_workers) as executor:
            futures = []
            for x_min in range(-180, 180, degree):
                for y_min in range(-90, 90, degree):
                    tile = calculateTiles(x_min, y_min + degree)
                    # Skip if .world already exists
                    world_file = (
                        config.scripts_folder_path
                        / "wpscript"
                        / "worldpainter_files"
                        / f"{tile}.world"
                    )
                    if world_file.exists():
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


def _wp_generate_legacy(config: GeneratorConfig) -> None:
    """Schedule all WorldPainter tile jobs using the legacy pebble ProcessPool.

    Uses ``config.wp_parallel_workers`` (default 2) as the pool size, keeping
    WP concurrency independent of the ``threads`` setting used by QGIS and
    ImageMagick stages.  Each JVM instance typically requires 4-6 GB RAM, so
    the default is conservative; increase ``wp_parallel_workers`` if sufficient
    memory is available.
    """
    degree_per_tile = config.degree_per_tile
    workers = config.wp_parallel_workers
    logger.info(
        "Starting WorldPainter stage (legacy mode) with wp_parallel_workers=%d", workers
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
