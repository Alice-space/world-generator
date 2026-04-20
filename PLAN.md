# World Generator Upgrade Plan

**Created**: 2026-04-20
**Author**: Claude (codearmy orchestrator)
**Goal**: Upgrade the world-generator project to produce a 1:50 global Minecraft Earth map, with improved performance, proper open-source formatting, and a white-box WorldPainter configuration approach.

---

## 0. Current State Assessment

### Hardware (Alice)
- CPU: 24 cores
- RAM: 78 GB
- SSD 1T: /media/alice/SSDDataDisk1T (422 GB free) — project source + planet PBF
- HDD 2T: /media/alice/DataDisk2T (1.7 TB free) — output target
- OS: Ubuntu 24.04, Java 21, all tools pre-installed

### Broken State
- config.yaml and config-100.yaml reference non-existent paths: `/home/alice/disk1t`, `/mnt/disk2t`
- Actual mount points: `/media/alice/SSSDataDisk1T`, `/media/alice/DataDisk2T`
- Previous 1:100 run partially started (OSM preprocess done, image export incomplete)
- image_exports directory is empty; no tiles were fully generated

### Stale Data to Clean Up
- `/media/alice/DataDisk2T/world-generator-100/` (30 MB, incomplete run)
- `/media/alice/DataDisk2T/world-generator-test/` (test run)
- `/media/alice/DataDisk2T/test-run/` (test run)
- `/media/alice/SSSDataDisk1T/osm/` (old OSM preprocessed data, may be reusable)

---

## 1. Scale Parameters (1:50)

### Calculation
- 1:50 means 1 Minecraft block = 50 real-world meters
- 1 degree of latitude = 111,320 meters
- blocks_per_degree = 111320 / 50 = 2226.4
- **Round up to 2240** (divisible by 32, good for Minecraft chunk alignment)

### Config Values
```yaml
blocks_per_tile: 2240
degree_per_tile: 1
height_ratio: 50    # maps to VERTICAL_SCALE_CONFIG["50"] = { legacy: [39, 239] }
```

### Tile Count
- 360 x 180 = 64,800 tiles (degree_per_tile=1)
- Each tile image: 2240x2240 pixels (~15 MB PNG for 16-bit heightmap)

### Time Estimate (conservative)
| Stage | Per-tile | Parallelism | Wall-clock |
|-------|----------|-------------|------------|
| OSM preprocess | one-time | 20 threads | ~30 min |
| QGIS image export | ~30-60s | 20 threads | ~1-3 days |
| ImageMagick | ~10-20s | 20 threads | ~12-18 hours |
| WorldPainter | ~30-60s | 8 workers* | ~3-6 days |
| Region merge + Minutor | one-time | 1 | ~1 hour |
| **Total** | | | **~5-10 days** |

*wp_parallel_workers raised from 2->8, each JVM ~6 GB, total ~48 GB (safe within 78 GB)

### Output Disk Usage Estimate
- Image exports: ~64800 tiles x ~50 layers x ~100 KB avg = ~300 GB
- WorldPainter worlds + regions: ~200-500 GB
- Final Minecraft save: ~100-300 GB
- **Total peak: ~600 GB - 1 TB** -> fits on DataDisk2T (1.7 TB)

---

## 2. WorldPainter Configuration: Binary to Code (White-Box)

### Current State (Black Box)
- `Docker/config` is a Java ObjectOutputStream serialization of `org.pepsoft.worldpainter.Configuration`
- README says: copy this file to `~/.local/share/worldpainter/config`
- Not human-readable, not git-diffable

### Target State (White Box)
Write a small Java program (`tools/wp-config-writer/`) that:
1. Creates a `Configuration` instance using the WorldPainter API (`/opt/worldpainter/lib/WPCore.jar`)
2. Sets all fields programmatically from values read from a YAML/properties source
3. Serializes the Configuration object to `~/.local/share/worldpainter/config`

### Implementation Steps

#### 2a. Extract current config values
Write a Java program to deserialize `Docker/config` and print all field values as YAML:
```java
// tools/wp-config-reader/ReadConfig.java
import org.pepsoft.worldpainter.Configuration;
// Deserialize and print all fields via reflection
```

#### 2b. Add WP config fields to config.example.yaml
```yaml
# === WorldPainter Application Settings ===
# These control the WorldPainter application configuration file written to
# ~/.local/share/worldpainter/config before running wpscript.
# They replace the binary Docker/config with a transparent, git-trackable approach.

wp_app_check_for_updates: false          # Disable update checks for headless operation
wp_app_default_max_height: 256           # Default max height for new worlds
wp_app_undo_enabled: true                # Enable undo (may increase memory usage)
wp_app_undo_levels: 25                   # Number of undo levels
wp_app_autosave_enabled: false           # Disable autosave for batch processing
wp_app_autosave_interval: 300            # Autosave interval in seconds (if enabled)
wp_app_default_game_type: 0              # 0=Survival, 1=Creative, 2=Adventure, 3=Spectator
wp_app_default_allow_cheats: false       # Allow cheats in created worlds
wp_app_default_map_features: true        # Generate structures (villages, etc.)
wp_app_maximum_brush_size: 5000          # Maximum brush size (important for large tiles)
wp_app_free_space_for_maps: 0            # Minimum free space before warning (0=disabled)
```

#### 2c. Write the config writer tool
```
tools/wp-config-writer/
  WriteConfig.java        # Main class
  compile-and-run.sh      # Convenience script
  README.md
```

The Java program will:
1. Instantiate `Configuration` using its default constructor
2. Set each field from command-line args or a properties file
3. Write to `~/.local/share/worldpainter/config` via ObjectOutputStream

#### 2d. Integrate into pipeline
In `pipeline.py`, add a `_ensure_wp_config()` step before tile generation:
```python
def _ensure_wp_config(config):
    subprocess.run([
        "java", "-cp", "/opt/worldpainter/lib/WPCore.jar:tools/wp-config-writer",
        "WriteConfig",
        "--max-height", str(config.wp_app_default_max_height),
        "--undo-levels", str(config.wp_app_undo_levels),
        # ... etc
    ])
```

---

## 3. ImageMagick Policy (Fine-Grained)

### Current Problem
The install script does `rm /etc/ImageMagick-6/policy.xml` which removes ALL security restrictions.

### What the Generator Actually Needs
From analyzing `magick.py`:
- **Coders**: PNG (read/write), TIF (via gdal_translate, not directly)
- **Features**: `-sparse-color Voronoi @file` -- uses `@` file read syntax (requires path policy)
- **Resource needs**: 16-bit 2240x2240 images, pyramid operations (10 levels of clone+resize)
- **Delegates**: None (no PDF, PS, SVG, URL, HTTP processing needed)

### Proposed Policy
Ship `Docker/imagemagick-policy.xml` in the repo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<policymap>
  <!-- Block all remote access -->
  <policy domain="delegate" rights="none" pattern="URL" />
  <policy domain="delegate" rights="none" pattern="HTTPS" />
  <policy domain="delegate" rights="none" pattern="HTTP" />

  <!-- Block risky coders (PostScript, SVG can execute code) -->
  <policy domain="coder" rights="none" pattern="PS" />
  <policy domain="coder" rights="none" pattern="PS2" />
  <policy domain="coder" rights="none" pattern="PS3" />
  <policy domain="coder" rights="none" pattern="EPS" />
  <policy domain="coder" rights="none" pattern="PDF" />
  <policy domain="coder" rights="none" pattern="XPS" />
  <policy domain="coder" rights="none" pattern="SVG" />
  <policy domain="coder" rights="none" pattern="MSL" />
  <policy domain="coder" rights="none" pattern="MVG" />

  <!-- Allow the image formats we actually use -->
  <policy domain="coder" rights="read|write" pattern="PNG" />
  <policy domain="coder" rights="read|write" pattern="TIF" />
  <policy domain="coder" rights="read|write" pattern="TIFF" />
  <policy domain="coder" rights="read|write" pattern="TXT" />

  <!-- Resource limits tuned for 2240x2240 16-bit tile processing -->
  <policy domain="resource" name="memory" value="4GiB" />
  <policy domain="resource" name="map" value="8GiB" />
  <policy domain="resource" name="area" value="512MP" />
  <policy domain="resource" name="disk" value="16GiB" />
  <policy domain="resource" name="width" value="64KP" />
  <policy domain="resource" name="height" value="64KP" />
  <policy domain="resource" name="thread" value="4" />
  <policy domain="resource" name="time" value="600" />
</policymap>
```

### Integration
- Ship `Docker/imagemagick-policy.xml` in the repo
- Install step: `sudo cp Docker/imagemagick-policy.xml /etc/ImageMagick-6/policy.xml`
- Update README, Dockerfile, and install instructions accordingly

---

## 4. Performance Optimizations (Within Current Framework)

### 4a. Increase wp_parallel_workers: 2 -> 8
- Each JVM ~6 GB, 8 x 6 = 48 GB -- well within 78 GB RAM
- Reduces WorldPainter wall-clock by ~4x
- Config: `wp_parallel_workers: 8`

### 4b. Enable tile_pipeline_mode
- Currently `false` by default
- Pipeline mode (T003): runs magick -> WP per-tile as soon as image export finishes
- Reduces peak disk usage
- Config: `tile_pipeline_mode: true` -- BUT image_export still must finish first

### 4c. Increase WP JVM heap
- Current: `-Xmx6G` in wpscript.vmoptions
- For 2240x2240 tiles at 1:50: increase to `-Xmx8G`
- Check: 8 workers x 8 GB = 64 GB (still fits in 78 GB)

### 4d. QGIS Project Caching (T004 -- already implemented)
- `export_image_multi` loads QGIS project once per worker, exports all layers
- Already active.

### 4e. ImageMagick Command Merging (T005 -- already implemented)
- Multiple convert calls merged using `-write` for branch points
- Already active.

---

## 5. Bypass WorldPainter: Feasibility Analysis

### Current Bottleneck
WorldPainter (via `wpscript` CLI) is the single largest time sink:
- Each tile spawns a new JVM (~5-10s cold start)
- The JS scripting engine (Nashorn/GraalJS) adds overhead
- Each JVM loads ~100+ layer files, template worlds, and image assets
- Memory-intensive: 4-6 GB per instance

### What WorldPainter Actually Does (per tile)
1. Creates a World object from a heightmap (16-bit PNG -> terrain heights)
2. Sets water levels based on bathymetry image (pixel-by-pixel Java loop)
3. Applies terrain types by mapping terrain image colors -> MC block types
4. Applies biomes by mapping climate/ecoregion images -> MC biome IDs
5. Applies layers (vegetation, roads, ores, borders, etc.) via image -> layer mapping
6. Exports to Minecraft region files (.mca) using the Anvil format

### Option A: Java Batch Processor
Write a Java program that uses WPCore.jar API directly:
- Single JVM for all tiles (eliminate cold-start overhead)
- Direct API calls instead of JS->Java bridge
- Batch-load shared resources once
- Multi-threaded within one JVM
- **Effort: 2-3 weeks. Risk: HIGH (rewrite all wpscript.js logic)**

### Option B: Direct Region File Generation (Skip WP entirely)
- Must re-implement ALL WorldPainter logic + Minecraft NBT/Anvil format
- **Effort: months. NOT recommended.**

### Option C: Persistent JVM Pool (RECOMMENDED)
Keep existing wpscript.js logic but eliminate JVM cold-start:
1. Write a Java wrapper that starts a single JVM with the WP scripting engine
2. Wrapper accepts tile specs via stdin/socket
3. For each tile, executes wpscript.js with appropriate arguments
4. Keeps JVM alive between tiles, pre-loads shared resources
5. Python orchestrator communicates with N persistent JVM workers

**Advantages**:
- Eliminates JVM cold-start (~5-10s per tile)
- Reuses existing wpscript.js (no rewrite)
- Pre-loads layer files and template worlds once per worker
- Moderate effort (1-2 weeks)

**Estimated Performance Gain**:
- JVM cold start: ~5-10s per tile saved
- Shared resource pre-loading: ~2-3s per tile saved
- Net: ~7-13s saved per tile x 64800 tiles = ~126-234 hours saved
- **WP stage: from ~3-6 days down to ~1-2 days**

### Recommendation
**Start with Option C (Persistent JVM Pool)** as immediate optimization.
If insufficient, pursue Option A later.

---

## 6. GitHub Open-Source Formatting

### 6a. README Overhaul
- Clean up installation steps (remove `rm policy.xml`, replace with proper policy)
- Add badges (CI, license, Docker)
- Add Quick Start section at top
- Add architecture diagram (text-based)
- Fix broken/stale paths in examples

### 6b. Missing Files to Add
- `LICENSE` (confirm with user which license)
- `CONTRIBUTING.md` (basic contribution guide)
- `.editorconfig` (consistent formatting)
- `CHANGELOG.md` (document major versions)

### 6c. Config Cleanup
- Remove stale config files (config.yaml with broken paths, config-test.yaml)
- Keep only `config.example.yaml` as the template
- Add `config.yaml` to `.gitignore` (already done)

### 6d. Docker Cleanup
- Update Dockerfile to use new ImageMagick policy approach
- Remove binary `Docker/config` file (replaced by Java config writer)
- Update Docker image tag/version

---

## 7. Execution Plan (Ordered Steps)

### Phase 1: Foundation and Cleanup (~1 day)
1. Fix stale paths in all config files
2. Create `config-50.yaml` for 1:50 global generation
3. Clean up stale output directories on DataDisk2T
4. Ship `Docker/imagemagick-policy.xml` and update install instructions
5. Increase `wp_parallel_workers` to 8, set JVM heap to 8G

### Phase 2: WorldPainter Config White-Box (~1-2 days)
6. Write Java config reader to dump current binary config as YAML
7. Add WP app settings to `config.example.yaml` with comments
8. Write Java config writer tool
9. Integrate config writer into pipeline startup
10. Remove `Docker/config` binary from repo

### Phase 3: Performance Optimization (~1-2 weeks)
11. Implement Option C: Persistent JVM Pool (wp-daemon)
12. Update `wpscript.py` to communicate with wp-daemon
13. Benchmark: compare single-tile time before/after
14. Tune wp_parallel_workers based on actual memory usage

### Phase 4: Full Generation Run (~1-2 weeks wall-clock)
15. Run OSM preprocessing (re-run to get all layers)
16. Run full pipeline: preprocess -> image_export -> magick -> WorldPainter -> merge
17. Monitor progress via generator.log
18. Post-process: final Minutor overview render

### Phase 5: GitHub Formatting (~1 day)
19. Overhaul README.md and README.zh.md
20. Add LICENSE, CONTRIBUTING.md, .editorconfig
21. Clean up Docker/ directory
22. Update .gitignore
23. Create release tag

---

## 8. Config File for 1:50 Run

```yaml
# config-50.yaml -- 1:50 Global Earth Map
# 1 Minecraft block = 50 real-world meters

scripts_folder_path: "/media/alice/DataDisk2T/world-generator-50"
pbf_path: "/home/alice/Documents/SSDDataDisk1T/world-generator/Data/planet-251103.osm.pbf"
osm_folder_path: "/media/alice/DataDisk2T/world-generator-50/osm"

qgis_project_path: "/home/alice/Documents/SSDDataDisk1T/world-generator/Data/qgis-project/QGIS/MinecraftEarthTiles.qgz"
qgis_bathymetry_project_path: "/home/alice/Documents/SSDDataDisk1T/world-generator/Data/qgis-bathymetry/QGIS/MinecraftEarthTiles_Bathymetry.qgz"
qgis_terrain_project_path: "/home/alice/Documents/SSDDataDisk1T/world-generator/Data/qgis-terrain/QGIS/MinecraftEarthTiles_Terrain.qgz"
qgis_heightmap_project_path: "/home/alice/Documents/SSDDataDisk1T/world-generator/Data/qgis-heightmap/QGIS/MinecraftEarthTiles_Heightmap.qgz"

use_high_quality_terrain: false
world_name: "earth_1_50"
blocks_per_tile: 2240
degree_per_tile: 1
height_ratio: 50
threads: 20
wp_parallel_workers: 8
tile_pipeline_mode: false

osm_switch:
  aerodrome: false
  bare_rock: true
  beach: true
  big_road: false
  border: true
  farmland: true
  forest: true
  glacier: true
  grass: true
  highway: false
  meadow: true
  middle_road: false
  quarry: true
  river: true
  small_road: false
  stateborder: false
  stream: false
  swamp: true
  urban: true
  volcano: true
  water: true
  wetland: true
  vineyard: true

rivers: rivers_medium
```

---

## 9. Key Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Disk space exhaustion | Generation stops | Monitor df -h; clean intermediates |
| WP OOM with 8 workers | Workers crash | Start with 6, tune up; -Xmx8G |
| QGIS export hangs | Pipeline stalls | Add per-tile timeout; skip empty tiles |
| 2240px tiles too large for WP | Render errors | Test single tile first; fall back to 2048 |
| Persistent JVM memory leaks | Workers degrade | Add max_tasks limit; periodic restart |

---

## 10. Open Questions for User

1. **License**: Which open-source license? (MIT, Apache 2.0, GPL?)
2. **Ocean tiles**: Skip generation for pure-ocean tiles to save ~40% time?
3. **HuggingFace data**: Is the HF dataset up to date with current QGIS projects?
4. **Test tile first?**: Run one tile (e.g. N48E008 -- Central Europe) to validate before full run?
