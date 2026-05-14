You are continuing a Minecraft world generation task. Here is your context:

## What's Happening

A full 1:50 scale Minecraft Earth map is being generated on machine `alice` using the world-generator pipeline. The pipeline has completed OSM preprocessing and QGIS image exports (64,800 tiles total). It is currently running the WorldPainter stage in legacy mode (8 parallel JVM workers), which generates `.mca` Minecraft region files per tile.

**Current progress**: ~9,049 / 64,800 tiles done (~14%).

## Quick Status Check

Run this first:
```bash
ssh alice "echo 'Tiles done:'; ls /mnt/DataDisk2T/world-generator-50/earth_1_50/region/.tile_*.done 2>/dev/null | wc -l; echo 'Disk:'; df -h /mnt/DataDisk2T | tail -1; echo 'WP processes:'; ps aux | grep -c 'wpscript.js'; echo 'Latest log:'; tail -3 /mnt/DataDisk2T/world-generator-50/wp_resume4.log 2>/dev/null || echo 'no resume4 log'"
```

## Key Locations

| Thing | Path on alice |
|-------|---------------|
| Source code | `~/Documents/SSDDataDisk1T/world-generator/` |
| Active config | `config-50.yaml` in above dir |
| Output root | `/mnt/DataDisk2T/world-generator-50/` |
| Final world | `/mnt/DataDisk2T/world-generator-50/earth_1_50/` |
| WP log | `/mnt/DataDisk2T/world-generator-50/wp_resume4.log` |
| Launch script | `~/Documents/SSDDataDisk1T/world-generator/start_wp.sh` |
| Handover doc | `~/projects/mc/world-generator/HANDOVER.md` on this machine |

## Tasks

### 1. Monitor pipeline
Check tile count and disk every few hours. Pipeline is healthy if:
- Tile count is increasing
- `ps aux | grep wpscript.js` shows 8 JVM processes
- Disk has >50G free

### 2. If pipeline stops
```bash
ssh alice "cd ~/Documents/SSDDataDisk1T/world-generator && nohup bash start_wp.sh > /mnt/DataDisk2T/world-generator-50/wp_legacyN.log 2>&1 &"
```
Replace N with next number (currently legacy9.log exists, so use legacy10).

### 3. If disk <50G
Delete osm directory first (441G, safe — QGIS stage done):
```bash
ssh alice "rm -rf /mnt/DataDisk2T/world-generator-50/osm"
```

### 4. After WP completes (all 64,800 tiles done)
Run:
```bash
ssh alice "cd ~/Documents/SSDDataDisk1T/world-generator && PYTHONPATH=src venv/bin/python -c '
from world_generator.config import load_config
from world_generator.tiles import post_process_map
config = load_config(\"config-50.yaml\")
post_process_map(config)
print(\"Post-processing complete!\")
'"
```

### 5. Known errors to ignore
- `minutor ... could not connect to display` / `xcb` — headless env, harmless
- `QPainter::begin: Paint device returned engine == 0` — Qt headless warning
- `Stale .world file ... removing and retrying` — auto-recovered, normal

### 6. If you need to edit code
The repo is cloned locally at `~/projects/mc/world-generator/`. Edit here, then:
```bash
cd ~/projects/mc/world-generator
git add -A && git commit -m "fix: description"
git push
ssh alice "cd ~/Documents/SSDDataDisk1T/world-generator && git pull"
```

## Estimated Timeline
- ~55,800 tiles remaining ÷ 8 workers ≈ ~7,000 tiles/worker
- ~30s per tile average → ~58 hours remaining
- Expected completion: ~2026-05-17 morning

## Troubleshooting

### WP processes running but tile count not increasing
Check if workers are stuck on a stale .world file. Look at the log:
```bash
ssh alice "tail -30 /mnt/DataDisk2T/world-generator-50/wp_resume4.log"
```
If stuck, kill and restart with N+1.

### All WP processes died
Check `dmesg` for OOM killer. If OOM, reduce wp_parallel_workers in config-50.yaml to 4.
```bash
ssh alice "dmesg | tail -20 | grep -i oom"
```

### Memory check
```bash
ssh alice "free -h"
```
8 workers × 6GB = 48GB. System has 78GB, so fine unless other processes consume memory.
