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

: "${PARALLEL_JOBS:=3}"

if ! [[ "$PARALLEL_JOBS" =~ ^[0-9]+$ ]]; then
  echo "[warn] Invalid PARALLEL_JOBS='$PARALLEL_JOBS', falling back to sequential" >&2
  PARALLEL_JOBS=1
fi

if (( PARALLEL_JOBS < 1 )); then
  PARALLEL_JOBS=1
fi

echo "=== Starting downloads using axel (N=${AXEL_N}, parallel jobs=${PARALLEL_JOBS}) ==="
echo

download_with_axel() {
  local url="$1"
  local file="${url##*/}"
  local state="${file}.st"

  if [[ -f "$file" && ! -f "$state" ]]; then
    echo "[skip] $file already exists"
    return 0
  fi

  if [[ -f "$state" ]]; then
    echo "[resume/verify] $file (found state: $state)"
  else
    echo "[downloading] $url"
    echo "  -> $file"
  fi

  local success=false
  for ((attempt=1; attempt<=AXEL_RETRIES; attempt++)); do
    if axel -n "$AXEL_N" -o "$file" "$url"; then
      success=true
      break
    fi
    echo "[attempt $attempt/$AXEL_RETRIES failed] $file"
    if (( attempt < AXEL_RETRIES )); then
      sleep "$AXEL_RETRY_DELAY"
    fi
  done

  if [[ "$success" != true ]]; then
    echo "[failed after $AXEL_RETRIES attempts] $file" >&2
    return 1
  fi

  echo "[done] $file"
  echo
}

wait_for_pid() {
  local pid="$1"
  if ! wait "$pid"; then
    echo "[error] A parallel download failed (pid=$pid)" >&2
    exit 1
  fi
}

if (( PARALLEL_JOBS <= 1 )); then
  for url in "${URLS[@]}"; do
    download_with_axel "$url"
  done
else
  declare -a DOWNLOAD_PIDS=()
  for url in "${URLS[@]}"; do
    (
      download_with_axel "$url"
    ) &
    DOWNLOAD_PIDS+=("$!")

    if (( ${#DOWNLOAD_PIDS[@]} >= PARALLEL_JOBS )); then
      wait_for_pid "${DOWNLOAD_PIDS[0]}"
      DOWNLOAD_PIDS=("${DOWNLOAD_PIDS[@]:1}")
    fi
  done

  for pid in "${DOWNLOAD_PIDS[@]}"; do
    wait_for_pid "$pid"
  done
fi

echo "=== All downloads finished ==="
