"""Build ocean_tiles.txt cache by scanning climate.png unique colours in parallel."""
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

IMGDIR = Path("/mnt/DataDisk2T/world-generator-50/image_exports")
REGIONDIR = Path("/mnt/DataDisk2T/world-generator-50/earth_1_50/region")
OUTFILE = Path("/mnt/DataDisk2T/world-generator-50/ocean_tiles.txt")

pending = []
for x in range(-180, 180):
    lon_dir = "W" if x < 0 else "E"
    lon_val = abs(x)
    for y in range(-90, 90):
        lat_dir = "S" if y < 0 else "N"
        lat_val = abs(y)
        tile = f"{lat_dir}{lat_val:02d}{lon_dir}{lon_val:03d}"
        if not (REGIONDIR / f".tile_{tile}.done").exists():
            pending.append(tile)

print(f"Pending tiles: {len(pending)}", flush=True)

def check_tile(tile):
    f = IMGDIR / tile / f"{tile}_climate.png"
    if not f.is_file():
        return None
    try:
        r = subprocess.run(
            ["identify", "-format", "%k", str(f)],
            capture_output=True, text=True, timeout=10,
        )
        if r.returncode == 0 and r.stdout.strip() == "1":
            return tile
    except Exception:
        pass
    return None

BATCH = 2000
ocean_tiles = []
checked = 0

for i in range(0, len(pending), BATCH):
    batch = pending[i:i + BATCH]
    with ThreadPoolExecutor(max_workers=12) as ex:
        futures = {ex.submit(check_tile, t): t for t in batch}
        for fut in as_completed(futures):
            result = fut.result()
            checked += 1
            if result:
                ocean_tiles.append(result)
    pct = checked * 100.0 / len(pending)
    print(f"  {checked}/{len(pending)} ({pct:.0f}%), ocean={len(ocean_tiles)}", flush=True)

OUTFILE.write_text("\n".join(ocean_tiles) + "\n")
print(f"Done. Ocean: {len(ocean_tiles)}, Land: {len(pending) - len(ocean_tiles)}", flush=True)
