#!/usr/bin/env bash
set -euo pipefail

# Plain-text list of URLs to download (edit as needed)
URLS=(
  http://earth.motfe.net/files/R4QWRfQxoiwx1BykrGVr/qgis-project.zip
  http://earth.motfe.net/files/TvIDZdSKPlx0p2b60eN0/qgis-bathymetry.zip
  https://earth.motfe.net/files/weWB9NxCTGTkL9nqkprt/qgis-terrain.zip
  https://earth.motfe.net/files/1WRmVLAz2gi7m8Z2qaWq/qgis-heightmap.zip.001
  https://earth.motfe.net/files/1WRmVLAz2gi7m8Z2qaWq/qgis-heightmap.zip.002
  https://earth.motfe.net/files/1WRmVLAz2gi7m8Z2qaWq/qgis-heightmap.zip.003
  https://planet.openstreetmap.org/pbf/planet-latest.osm.pbf
)

# Verify axel is available
if ! command -v axel >/dev/null 2>&1; then
  echo "[!] axel not found. Please install it first, for example:" >&2
  echo "    sudo apt update && sudo apt install -y axel" >&2
  exit 1
fi

# Default parallel connections per file (override by setting AXEL_N)
: "${AXEL_N:=4}"
# Retry attempts per file on failure (override by setting AXEL_RETRIES)
: "${AXEL_RETRIES:=5}"
# Seconds to wait between retries (override by setting AXEL_RETRY_DELAY)
: "${AXEL_RETRY_DELAY:=5}"

echo "=== Starting downloads using axel (N=${AXEL_N}) ==="
echo

for url in "${URLS[@]}"; do
  file="${url##*/}"
  state="${file}.st"

  if [[ -f "$file" && ! -f "$state" ]]; then
    echo "[skip] $file already exists"
    continue
  fi

  if [[ -f "$state" ]]; then
    echo "[resume/verify] $file (found state: $state)"
  else
    echo "[downloading] $url"
    echo "  -> $file"
  fi

  # Let axel decide whether to resume or verify completion. By default, if the
  # local file is already complete, it will leave it untouched.
  # Download with retry
  success=false
  for ((attempt=1; attempt<=AXEL_RETRIES; attempt++)); do
    if axel -n "$AXEL_N" -o "$file" "$url"; then
      success=true
      break
    fi
    echo "[attempt $attempt/$AXEL_RETRIES failed] $file"
    # Don't sleep on the last failed attempt since we won't retry
    if (( attempt < AXEL_RETRIES )); then
      sleep "$AXEL_RETRY_DELAY"
    fi
  done

  if [[ "$success" != true ]]; then
    echo "[failed after $AXEL_RETRIES attempts] $file" >&2
    exit 1
  fi

  echo "[done] $file"
  echo
done

echo "=== All downloads finished ==="
