# Handover: world-generator 1:50 Global Earth Map

**Date**: 2026-05-14 18:00 CST
**Status**: Running (WP legacy mode, 14% complete, healthy)

---

## What This Is

Generating a full 1:50 scale Minecraft Earth map from OpenStreetMap data.
64,800 tiles (360 long × 180 lat), each 2240×2240 blocks at 1 degree resolution.

## Machines

| Role | Host | Path |
|------|------|------|
| Code (source of truth) | `alice` | `~/Documents/SSDDataDisk1T/world-generator/` |
| Code (local clone) | this machine | `~/projects/mc/world-generator/` |
| Data & Output | `alice` `/mnt/DataDisk2T` | `world-generator-50/` |
| SSD (fast reads) | `alice` `/mnt/SSDDataDisk1T` | Data/ (PBF, QGIS projects) |

## Pipeline Status

### Completed Stages
- [x] OSM preprocessing — 29 layer files in `osm/all/` (441G)
- [x] ImageMagick — all tiles processed (minor failures logged)
- [x] QGIS image exports — 64,800 tiles in `image_exports/` (282G)
  - 4 strips failed (x_min=-150, 66, 72, 90), logged to `image_export_failures.txt`

### Active Stage: WorldPainter (wp_generate)
- **Progress**: 9,049 / 64,800 tiles (14%)
- **Mode**: Legacy (subprocess-per-tile, wp_parallel_workers=8)
- **Running as**: 8 parallel `wpscript` JVM processes via `start_wp.sh`
- **Output dir**: `wpscript/exports/<TILE>/region/*.mca`
- **Final world**: `earth_1_50/region/*.mca` (incremental merge via hardlinks)

### Not Yet Started
- [ ] `post_process_map` — will merge all region files + generate Minutor overview

## Disk Status

| Disk | Size | Used | Free |
|------|------|------|------|
| `/mnt/DataDisk2T` (HDD) | 1.8T | 1.1T | 673G |
| `/mnt/SSDDataDisk1T` (SSD) | 938G | 469G | 422G |

### DataDisk2T breakdown
| Path | Size | Note |
|------|------|------|
| `wpscript/exports/` | ~1.0T | Tile .mca output (keep, being merged incrementally) |
| `osm/` | 441G | **Can delete** (QGIS done, not needed for WP stage) |
| `image_exports/` | 282G | QGIS rasters, WP loads from here (**keep**) |
| `wpscript/worldpainter_files/` | ~6G | .world files, skippable |
| `earth_1_50/region/` | growing | Final merged world (hardlinks from exports) |

## How to Check Progress

```bash
ssh alice "ls /mnt/DataDisk2T/world-generator-50/earth_1_50/region/.tile_*.done 2>/dev/null | wc -l"
# Current: 9049

ssh alice "df -h /mnt/DataDisk2T"
# Must stay > 50G free

ssh alice "ps aux | grep -c wpscript"
# Should show 8 JVM + 1 xvfb-run + 8 python workers
```

## How to Restart/Resume

If pipeline stops, run:
```bash
ssh alice "cd ~/Documents/SSDDataDisk1T/world-generator && nohup bash start_wp.sh > /mnt/DataDisk2T/world-generator-50/wp_legacy10.log 2>&1 &"
```

`start_wp.sh` already has idempotent resume logic — it skips tiles with existing `.world` files.

## Key Files

| File | Purpose |
|------|---------|
| `config-50.yaml` | Active config (1:50 scale, /mnt/DataDisk2T paths) |
| `start_wp.sh` | Launch script for wp_generate (legacy mode) |
| `wp_legacy9.log` | Current run stdout |
| `wp_resume4.log` | Current run Python log |
| `image_export_failures.txt` | QGIS strip failures (4 entries) |
| `magick_failures.txt` | Magick tile failures |

## Known Issues & Fixes Applied

1. **Original config had wrong path** (`/media/alice/DataDisk2T` → fixed to `/mnt/DataDisk2T`)
2. **Disk was 100% full** — osm/ cleaned, incremental hardlink merge implemented
3. **Daemon mode disabled** — `wp_use_daemon: false` (deadlocks under load, use legacy)
4. **Minutor xcb errors** — harmless, headless env, only affects preview PNGs
5. **4 QGIS strips failed** — ~240 tiles missing some layers (climate.png etc), logged

## Efficiency Notes

- 8 concurrent JVMs × 6GB Xmx = ~48GB RAM used (of 78GB)
- Each tile takes 20-60s depending on land/ocean complexity
- ~55,800 tiles remaining ÷ 8 workers ≈ 6,975 tiles/worker
- At ~30s avg: ~58 hours remaining
- Disk may fill again near the end — monitor and run cleanup if needed

## Cleanup Commands

```bash
# If disk fills up, delete osm/ (safe, QGIS stage is done)
ssh alice "rm -rf /mnt/DataDisk2T/world-generator-50/osm"

# Delete .world files for already-exported tiles
ssh alice "cd /mnt/DataDisk2T/world-generator-50 && for wf in wpscript/worldpainter_files/*.world; do tile=\$(basename \"\$wf\" .world); if [ -f \"earth_1_50/region/.tile_\$tile.done\" ]; then rm \"\$wf\"; fi; done"
```

## After WP Completes

1. Run `post_process_map` to merge remaining exports
2. Generate Minutor overview PNG
3. Verify Minecraft can load `earth_1_50/` world
