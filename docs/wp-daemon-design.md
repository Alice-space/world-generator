# wp-daemon Architecture & Protocol Design

**Status**: Design (pre-implementation)
**Target tasks**: T012 (daemon process), T013 (Python integration)
**Author**: Executor T011
**Date**: 2026-04-20

---

## 1. Problem Statement

The current `run_world_painter()` in `wpscript.py` spawns a fresh `wpscript` process per tile. The `wpscript` launcher (`/opt/worldpainter/wpscript`) is an install4j-generated shell script that:

1. Searches for a JVM, verifies it, and writes a version-cache database entry
2. Launches a fresh JVM with `-Xmx6G` (configured in `wpscript.vmoptions`)
3. Initializes WorldPainter's Nashorn-based JS engine (via `nashorn-core.jar`)
4. Executes the JS entry point (`wpscript.js`) and exits

This cold-start sequence costs **5–10 s per tile** before any terrain work begins. With hundreds of tiles the cost is significant. A persistent JVM pool eliminates the cold-start by keeping the JVM alive between tiles.

---

## 2. Current Architecture Summary

### 2.1 JS Engine

WorldPainter 2.22+ on Java 21 uses **Nashorn via the standalone `nashorn-core.jar`** bundled in `/opt/worldpainter/lib/`. Nashorn was removed from the JDK in Java 15, so WP ships its own copy. This is important: GraalJS is *not* used.

Each `wpscript` invocation creates one Nashorn `ScriptEngine` instance. The engine is torn down when the process exits.

### 2.2 JS Global State

`wpscript.js` bootstraps globals in the **global (ECMA "this") scope** by assigning directly to `GLOBAL_CONTEXT`:

```js
var GLOBAL_CONTEXT = Function("return this;")();
// ... assigns path, directionLatitude, latitude, directionLongitute,
//     longitude, scale, tilesPerMap, verticalScale,
//     settingsBorders, ..., heightmapName, biomeSource, etc.
```

Then `load()` chains execute each section script, which further populate globals:

| Section | Key globals set |
|---------|----------------|
| `shift.js` | `tile`, `shiftLatitude`, `shiftLongitute` |
| `layers.js` | ~80 layer variable names (riverLayer, glacierLayer, etc.) |
| `heightmap.js` | `world`, `dimension`, `platformTemplate`, `heightMapImage`, `bathymetryScale` |
| `export.js` | (clears `world = null`) |

**Critical**: all these are bare `var` declarations in the top-level scope — they pollute the global object permanently. There is no cleanup pass.

### 2.3 Per-tile vs Shareable Resources

| Resource | Per-tile? | Notes |
|----------|-----------|-------|
| Tile PNG images (`image_exports/<tile>/*.png`) | **Yes** — tile-specific paths | Loaded via `wp.getHeightMap().fromFile()` |
| Layer `.layer` files | **Version-dependent, not tile-specific** | Same files reloaded every tile if version/settings match |
| Template `.world` files (`wpscript/1-19.world`, etc.) | **Version-dependent** | Loaded to extract `platformMapFormat` and `gameType` |
| `world` object | **Per-tile** | Created fresh from heightmap each tile |
| `shiftLatitude` / `shiftLongitute` | **Per-tile** | Computed from lat/lon/scale |

Layer and template files could theoretically be cached at the Java level if the same `ScriptEngine` (or at least the same JVM with a shared cache) is reused. However, `wp.getLayer().fromFile()` and `wp.getWorld().fromFile()` go through WorldPainter's Java API, so whether they have an internal cache is opaque. **In practice, new-ScriptEngine-per-tile (Option A) still avoids the multi-second JVM restart cost**, which is the dominant overhead.

---

## 3. Daemon Architecture

### 3.1 Overview

```
Python (wp_generate)
   │
   │  subprocess.Popen × N
   ▼
WPDaemon process 1 ──┐
WPDaemon process 2 ──┤── each is a long-lived JVM
WPDaemon process N ──┘
```

Each daemon process is a Python script (`wp_daemon_worker.py`) that:
1. Starts the WP JVM via `subprocess.Popen(['wpscript', '--server', ...])` OR launches itself as a JVM-side server directly.

**Practical approach**: because `wpscript` is a shell launcher that always exits after one run, we cannot use it as the long-lived server directly. Instead the daemon is implemented as a **thin Python wrapper** that keeps calling `wpscript` in a loop — but passes tile arguments via a lightweight **stdin/stdout JSON protocol** to a custom JS shim that loops internally.

Actually, the cleanest approach that avoids touching the WP launcher at all is:

> **Each WPDaemon is a JVM process launched once via `wpscript` with a special driver script (`wp_daemon_driver.js`) that reads tile requests from stdin in a loop and processes them one at a time using a fresh Nashorn ScriptEngine per tile.**

This is feasible because Nashorn's `ScriptEngine` is a Java object that can be constructed programmatically and is much cheaper to create than a full JVM startup.

### 3.2 Daemon Driver Script (`Data/wp_daemon_driver.js`)

The driver is the entry point passed to `wpscript`. It:
1. Reads lines from `java.lang.System.in` in a loop
2. Parses each line as JSON to get tile parameters
3. Creates a fresh Nashorn `ScriptEngine`, sets all tile arguments, executes `wpscript.js` sections
4. Writes JSON result to stdout
5. Loops until it receives `{"command": "shutdown"}` or stdin closes

```
wpscript Data/wp_daemon_driver.js [static_args...]
```

Static arguments (path, version range, height settings, feature flags) are passed once at startup. Tile-specific arguments (lat, lon, tile name, etc.) arrive per-request via stdin JSON.

### 3.3 Process Lifecycle

```
startup:
  wpscript wp_daemon_driver.js <static_args>
  → JVM starts, Nashorn engine factory initialized
  → driver enters read loop
  → writes: {"status": "ready"}\n to stdout

per tile:
  Python writes: {"tile": "N48E008", "dir_lat": "N", "lat": 48, ...}\n
  driver creates new ScriptEngine, runs all sections
  driver writes: {"status": "done", "tile": "N48E008"}\n
              or {"status": "error", "tile": "N48E008", "message": "..."}\n

shutdown:
  Python writes: {"command": "shutdown"}\n
  driver exits cleanly (JVM terminates)
```

---

## 4. Communication Protocol

### 4.1 Transport

- **Encoding**: UTF-8 newline-delimited JSON (NDJSON) over stdin/stdout pipes
- **Direction**: Python → daemon on stdin; daemon → Python on stdout
- **Stderr**: daemon's stderr is captured separately for logging; WP's own log output goes to stderr

### 4.2 Message Schemas

#### 4.2.1 Python → Daemon: Tile Request

```json
{
  "tile": "N48E008",
  "dir_lat": "N",
  "lat": 48,
  "dir_lon": "E",
  "lon": 8
}
```

All tile-variable fields (lat, lon, tile name, dir_lat, dir_lon) must be present. Static config fields (version, flags, paths) are passed at daemon startup as CLI args and do not repeat per tile.

#### 4.2.2 Python → Daemon: Shutdown

```json
{"command": "shutdown"}
```

#### 4.2.3 Daemon → Python: Ready

```json
{"status": "ready"}
```

Sent once after JVM startup completes and the driver is ready for its first tile.

#### 4.2.4 Daemon → Python: Tile Done

```json
{"status": "done", "tile": "N48E008"}
```

#### 4.2.5 Daemon → Python: Tile Error

```json
{"status": "error", "tile": "N48E008", "message": "java.lang.OutOfMemoryError: Java heap space"}
```

#### 4.2.6 Daemon → Python: Shutdown Acknowledged

```json
{"status": "shutdown"}
```

### 4.3 Framing

Messages are newline-terminated (`\n`). The Python side reads with `readline()`. The JS side uses `java.io.BufferedReader(new java.io.InputStreamReader(java.lang.System.in)).readLine()`.

---

## 5. Global Variable Isolation Strategy

### 5.1 Options Considered

**Option A — New ScriptEngine per tile** (RECOMMENDED)
- Create a new `javax.script.ScriptEngine` instance for each tile request
- All `var` globals are scoped to that engine instance and garbage-collected after the tile
- No code changes to existing `wpscript.js` or section files
- Nashorn engine creation cost: ~50–200 ms (vs. 5–10 s JVM cold-start)

**Option B — Function-scoped wrapper**
- Wrap all section JS in a closure: `(function() { ... })()`
- Requires modifying every section file
- `load()` calls still execute in global scope; risky without verifying each section

**Option C — Explicit global reset**
- After each tile, null-out every known global variable
- Fragile: must track ~100 variable names; breaks silently when new sections add globals

**Decision**: Option A. The new-engine-per-tile approach requires zero changes to existing JS files, provides perfect isolation, and is architecturally clean.

### 5.2 Engine Factory Warm-up

The Nashorn `ScriptEngineManager` and engine factory initialization happen once at JVM startup (not per tile). Subsequent `engine = manager.getEngineByName("nashorn")` calls are fast because the factory is already loaded. This is the key cost savings vs. spawning a new process.

---

## 6. wp_daemon_driver.js Implementation Sketch

```javascript
// wp_daemon_driver.js — executed once per JVM lifetime by wpscript

// Static config arrives as positional arguments (same as wpscript.js but
// without tile-specific args). The driver assigns them to its own scope for
// re-injection into each per-tile engine.

var STATIC_ARGS = ...; // parsed from `arguments`

var ScriptEngineManager = java.javax.script.ScriptEngineManager;
var manager = new ScriptEngineManager();

var stdin = new java.io.BufferedReader(
    new java.io.InputStreamReader(java.lang.System.in, "UTF-8"));
var stdout = new java.io.PrintStream(java.lang.System.out, true, "UTF-8");

stdout.println(JSON.stringify({status: "ready"}));

var line;
while ((line = stdin.readLine()) !== null) {
    var msg = JSON.parse(line);
    if (msg.command === "shutdown") {
        stdout.println(JSON.stringify({status: "shutdown"}));
        break;
    }

    // --- per-tile work ---
    try {
        var engine = manager.getEngineByName("nashorn");
        // Inject static config + tile-specific args as engine globals
        injectGlobals(engine, STATIC_ARGS, msg);
        // Execute wpscript.js (which load()s all sections)
        engine.eval(new java.io.FileReader(STATIC_ARGS.path + "/wpscript.js"));
        stdout.println(JSON.stringify({status: "done", tile: msg.tile}));
    } catch (e) {
        stdout.println(JSON.stringify({
            status: "error",
            tile: msg.tile,
            message: String(e)
        }));
    }
    engine = null; // allow GC
}
```

**Note**: Nashorn's `engine.eval()` does not support a working directory context for relative `load()` calls — the driver must either set `user.dir` or pass an absolute `path` argument so that `load("utils.js")` resolves correctly. The existing `path` argument in `wpscript.js` handles this: all file loads already use `path + '...'`, so passing the correct absolute `path` into the engine globals is sufficient.

---

## 7. Python Integration

### 7.1 New Class: `WPDaemon`

Location: `src/world_generator/wpscript.py`

```python
class WPDaemon:
    """Manages a single persistent wpscript JVM process."""

    def __init__(self, config: GeneratorConfig, worker_id: int):
        self.config = config
        self.worker_id = worker_id
        self._proc: subprocess.Popen | None = None
        self._tiles_processed = 0
        self._lock = threading.Lock()

    def start(self) -> None:
        """Launch the daemon JVM process and wait for 'ready' signal."""
        args = self._build_args()
        self._proc = subprocess.Popen(
            args,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,  # line-buffered
        )
        # Wait for {"status": "ready"}
        ready_line = self._proc.stdout.readline()
        msg = json.loads(ready_line)
        if msg.get("status") != "ready":
            raise RuntimeError(f"Daemon {self.worker_id} did not send ready: {ready_line!r}")
        logger.info("WPDaemon %d ready (pid=%d)", self.worker_id, self._proc.pid)

    def process_tile(self, tile: str, lat: int, lon: int,
                     dir_lat: str, dir_lon: str) -> None:
        """Send one tile request and block until done or error."""
        request = json.dumps({
            "tile": tile, "dir_lat": dir_lat, "lat": lat,
            "dir_lon": dir_lon, "lon": lon,
        })
        self._proc.stdin.write(request + "\n")
        self._proc.stdin.flush()
        response_line = self._proc.stdout.readline()
        msg = json.loads(response_line)
        self._tiles_processed += 1
        if msg.get("status") == "error":
            raise RuntimeError(f"Daemon error on {tile}: {msg.get('message')}")

    def shutdown(self) -> None:
        """Send shutdown command and wait for process exit."""
        if self._proc and self._proc.poll() is None:
            self._proc.stdin.write(json.dumps({"command": "shutdown"}) + "\n")
            self._proc.stdin.flush()
            self._proc.wait(timeout=30)

    def needs_restart(self) -> bool:
        """Return True if daemon has exceeded max_tiles_per_worker."""
        return self._tiles_processed >= self.config.wp_max_tiles_per_worker

    def _build_args(self) -> list[str]:
        cfg = self.config
        scripts_folder = str(cfg.scripts_folder_path)
        driver_js = str(cfg.scripts_folder_path / "wp_daemon_driver.js")
        return [
            "wpscript", driver_js, scripts_folder,
            # Static feature flags (same order as current wpscript args,
            # minus tile-specific positional args which come via stdin)
            cfg.wp_version_range,
            str(cfg.wp_sea_level),
            str(cfg.wp_min_height),
            str(cfg.wp_max_height),
            str(cfg.blocks_per_tile),
            str(cfg.degree_per_tile),
            str(cfg.height_ratio),
            # ... all settingsXxx flags ...
            cfg.wp_biome_mode,
            str(cfg.wp_biome_precision),
        ]
```

### 7.2 New Class: `WPDaemonPool`

```python
class WPDaemonPool:
    """Pool of N persistent WPDaemon processes."""

    def __init__(self, config: GeneratorConfig):
        self.config = config
        self._daemons: list[WPDaemon] = []
        self._available: queue.Queue[WPDaemon] = queue.Queue()

    def start(self) -> None:
        for i in range(self.config.wp_parallel_workers):
            d = WPDaemon(self.config, i)
            d.start()
            self._daemons.append(d)
            self._available.put(d)

    def process_tile(self, tile: str, lat: int, lon: int,
                     dir_lat: str, dir_lon: str) -> None:
        daemon = self._available.get()
        try:
            daemon.process_tile(tile, lat, lon, dir_lat, dir_lon)
        finally:
            if daemon.needs_restart():
                logger.info("Daemon %d hit max_tiles_per_worker, restarting", daemon.worker_id)
                daemon.shutdown()
                daemon.start()
            self._available.put(daemon)

    def shutdown(self) -> None:
        for d in self._daemons:
            try:
                d.shutdown()
            except Exception as e:
                logger.warning("Error shutting down daemon %d: %s", d.worker_id, e)
```

### 7.3 Modified `wp_generate()`

```python
def wp_generate(config: GeneratorConfig) -> None:
    if config.wp_use_daemon:
        _wp_generate_daemon(config)
    else:
        _wp_generate_legacy(config)  # existing pebble ProcessPool path


def _wp_generate_daemon(config: GeneratorConfig) -> None:
    pool = WPDaemonPool(config)
    pool.start()
    futures = []
    with ThreadPoolExecutor(max_workers=config.wp_parallel_workers) as executor:
        for x_min in range(-180, 180, config.degree_per_tile):
            for y_min in range(-90, 90, config.degree_per_tile):
                tile = calculateTiles(x_min, y_min + config.degree_per_tile)
                # skip already-done tiles
                world_file = (config.scripts_folder_path / "wpscript" /
                              "worldpainter_files" / f"{tile}.world")
                if world_file.exists():
                    continue
                lat, lon, dir_lat, dir_lon = _parse_tile(tile)
                futures.append(executor.submit(
                    pool.process_tile, tile, lat, lon, dir_lat, dir_lon))
        for f in as_completed(futures):
            try:
                f.result()
            except Exception as e:
                logger.error("Tile failed: %s", e)
    pool.shutdown()
```

### 7.4 Config Additions (`config.py`)

```python
wp_use_daemon: bool = False          # enable daemon pool mode
wp_max_tiles_per_worker: int = 50   # restart daemon after N tiles (memory guard)
```

---

## 8. Memory Management

### 8.1 Heap Configuration

The existing `wpscript.vmoptions` sets `-Xmx6G`. With N concurrent daemons the total heap budget is `N × 6 GB`. With `wp_parallel_workers=2` (default) this is 12 GB — consistent with existing behavior since the legacy mode also runs 2 JVMs concurrently.

### 8.2 GC Tuning

Add to daemon launch args (via `INSTALL4J_ADD_VM_PARAMS` or a custom `.vmoptions`):
```
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
-XX:+ExplicitGCInvokesConcurrent
```

G1GC handles large-heap workloads better than the default Parallel GC for this pattern (many short-lived large objects from image processing).

### 8.3 Memory Leak Guard: `max_tiles_per_worker`

Even with new ScriptEngine per tile, Java-side WorldPainter internals may accumulate state (layer registry, image caches) across tile invocations within the same JVM. The `max_tiles_per_worker` config option (default 50) causes the daemon to be gracefully restarted after N tiles, bounding worst-case memory growth. Set to 0 to disable.

### 8.4 Monitoring

Log RSS growth via `/proc/<pid>/status` in a background thread. If RSS exceeds a configurable threshold (`wp_daemon_max_rss_gb`, default 0 = disabled), force-restart the daemon before it OOMs.

---

## 9. Error Handling

### 9.1 Tile Failure

On `{"status": "error"}` response:
1. Log the error with tile name and message
2. Do NOT crash the daemon or the pool
3. Continue with next tile
4. Optionally write a sentinel file (e.g., `<tile>.failed`) for retry logic

### 9.2 Daemon Crash

If `self._proc.poll()` returns non-None unexpectedly:
1. Log stderr output from the crashed process
2. Restart the daemon
3. Re-queue the in-flight tile for retry (up to `wp_daemon_tile_max_retries=2`)

### 9.3 Startup Failure

If the daemon does not send `{"status": "ready"}` within `wp_daemon_startup_timeout_s=120` seconds:
1. Kill the process
2. Log stderr
3. Fall back to legacy subprocess mode for all remaining tiles

### 9.4 Fallback

If `wp_use_daemon=True` but the daemon pool fails to start (e.g., `wp_daemon_driver.js` not found, wpscript incompatibility), the system automatically falls back to the legacy `pebble.ProcessPool` path with a warning log. This ensures zero regression risk during rollout.

---

## 10. Static Argument Splitting

The existing `wpscript.js` takes 43 positional CLI arguments. The daemon splits these into two groups:

**Static (passed once at JVM startup as CLI args to `wp_daemon_driver.js`)**:
- `path` (scripts folder)
- All `settingsXxx` flags (borders, highways, ores, etc.)
- `settingsMapVersion` / `wp_version_range`
- `wp_sea_level`, `wp_min_height`, `wp_max_height`
- `scale` / `blocks_per_tile`
- `tilesPerMap` / `degree_per_tile`
- `verticalScale` / `height_ratio`
- `biomeSource`, `oreModifier`, all `mod_XXX` flags
- `settingsVanillaPopulation`

**Dynamic (per-tile, sent via stdin JSON)**:
- `tile` (e.g., "N48E008")
- `directionLatitude` ("N" or "S")
- `latitude` (int)
- `directionLongitute` ("E" or "W")
- `longitute` (int)
- `heightmapName` (tile name, same as `tile`)

The driver script injects both static config and per-tile fields into each engine's global scope before calling `loadSections()`.

---

## 11. File Layout

```
Data/
  wp_daemon_driver.js       # NEW: daemon entry point (loop over tiles)
  wpscript.js               # UNCHANGED
  utils.js                  # UNCHANGED
  sections/                 # UNCHANGED

src/world_generator/
  wpscript.py               # MODIFIED: add WPDaemon, WPDaemonPool, _wp_generate_daemon
  config.py                 # MODIFIED: add wp_use_daemon, wp_max_tiles_per_worker
```

---

## 12. Implementation Tasks

| Task | File | Description |
|------|------|-------------|
| T012-a | `Data/wp_daemon_driver.js` | Write daemon driver: stdin loop, new ScriptEngine per tile, JSON protocol |
| T012-b | `Data/wp_daemon_driver.js` | Handle static arg injection, `path`-relative `load()` resolution |
| T013-a | `src/world_generator/wpscript.py` | `WPDaemon` class: launch, protocol, shutdown, crash detection |
| T013-b | `src/world_generator/wpscript.py` | `WPDaemonPool` class: queue, retry, restart on max_tiles |
| T013-c | `src/world_generator/wpscript.py` | `_wp_generate_daemon()` + fallback logic in `wp_generate()` |
| T013-d | `src/world_generator/config.py` | Add `wp_use_daemon`, `wp_max_tiles_per_worker` config fields |

---

## 13. Expected Performance Improvement

| Metric | Legacy mode | Daemon mode |
|--------|------------|-------------|
| JVM cold-start per tile | 5–10 s | ~0 s (amortized over lifetime) |
| ScriptEngine init per tile | included in above | ~100–200 ms |
| Tile processing time | unaffected | unaffected |
| Memory per worker | same | same (~6 GB heap) |
| Net throughput improvement | — | ~10–30% depending on tile complexity |

The improvement is most pronounced for fast tiles (ocean, simple terrain) where cold-start dominates, and least for complex land tiles where JS execution time dominates.

---

## 14. Open Questions for T012/T013

1. **Does `engine.eval(new FileReader(...))` correctly handle Nashorn's `load()` built-in with relative paths?** Verify that `load("utils.js")` inside `wpscript.js` resolves relative to the `path` variable, not to `user.dir`. May need to `engine.put("user.dir", ...)` or use absolute paths.

2. **Does WorldPainter's `wp` global object need to be injected per-engine, or is it available automatically in all Nashorn engines running inside the WP JVM?** Test by checking if a minimal `engine.eval("wp.getVersion()")` succeeds without explicit binding.

3. **Thread safety of the WP Java API**: WorldPainter's Java API (`wp.*`) may not be thread-safe. Since each daemon is single-threaded (one tile at a time), and daemons are separate processes, this should not be an issue — but verify if multiple threads within one daemon would be required.

4. **Nashorn `ScriptEngineManager` thread safety**: `manager.getEngineByName()` is thread-safe per JSR-223 spec, but each returned engine is not. Since the driver is single-threaded, this is fine.
