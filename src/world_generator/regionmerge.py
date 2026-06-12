"""Chunk-level merging of Minecraft Anvil region files (.mca).

Tiles are ``blocks_per_tile`` (2240) blocks wide while Anvil region files
cover 512x512 blocks.  2240/512 = 4.375, so tile edges generally fall inside
a region file and adjacent tiles export region files with the SAME name, each
containing only its own side's chunks (plus void filler chunks in the
WorldPainter 128-block tile-grid overhang).  Moving whole files into the
final world therefore overwrites the neighbour's chunks in every shared
boundary region - this produced ~200-400 block wide missing stripes along
7 of 8 tile boundaries in earlier runs.

This module merges at chunk granularity with a geographic ownership rule:
``blocks_per_tile`` is a multiple of 16, so every chunk belongs to exactly
one tile, and a tile's merge only ever writes chunks it owns.  Merge results
are therefore independent of tile processing order, and the void overhang
chunks WorldPainter exports outside the tile's bounds are dropped instead of
clobbering real neighbour terrain.

Concurrency: the read-merge-write cycle on a destination file is guarded by
(a) a striped in-process ``threading.Lock`` pool for the common case (all WP
worker threads live in one process) and (b) an ``fcntl.flock`` side-car lock
in ``<region>/.merge_locks/`` so that process-pool callers
(``tile_pipeline_mode``) or an overlapping ``post_process_map`` cannot race
each other across process boundaries.

Coordinate assumption: the merge ownership math mirrors sections/shift.js
with ``settingsMapOffset == 0``.  ``wp_generate`` enforces this (the value
passed for that argument is ``config.wp_sea_level``, default 0).
"""

from __future__ import annotations

import fcntl
import logging
import os
import re
import shutil
import threading
from pathlib import Path

logger = logging.getLogger(__name__)

SECTOR_BYTES = 4096
REGION_CHUNKS = 32  # chunks per region edge
CHUNK_BLOCKS = 16  # blocks per chunk edge

_REGION_NAME_RE = re.compile(r"^r\.(-?\d+)\.(-?\d+)\.mca$")
_TILE_NAME_RE = re.compile(r"^([NS])(\d{2})([EW])(\d{3})$")

# Striped lock pool: bounded memory regardless of how many distinct region
# files a run touches (a full 1:50 Earth has ~1.25M of them).  Collisions only
# cause occasional extra serialisation, never incorrect behaviour.
_LOCK_STRIPES = [threading.Lock() for _ in range(1024)]


def _lock_for(dest: Path) -> threading.Lock:
    return _LOCK_STRIPES[hash(dest.name) & 1023]


class _FileLock:
    """Cross-process exclusive lock via flock on a side-car file."""

    def __init__(self, dest: Path) -> None:
        lock_dir = dest.parent / ".merge_locks"
        lock_dir.mkdir(parents=True, exist_ok=True)
        self._path = lock_dir / f"{dest.name}.lock"
        self._fh = None

    def __enter__(self) -> "_FileLock":
        self._fh = open(self._path, "w")
        fcntl.flock(self._fh, fcntl.LOCK_EX)
        return self

    def __exit__(self, *exc) -> None:
        if self._fh is not None:
            fcntl.flock(self._fh, fcntl.LOCK_UN)
            self._fh.close()
            self._fh = None


def sweep_tmp_files(region_dir: Path) -> int:
    """Remove leftover ``*.mca.tmp.*`` files from a crashed previous run.

    Must only be called at stage start, before any merge workers are active —
    a tmp file belonging to a live merge would otherwise be destroyed.
    """
    removed = 0
    if not region_dir.is_dir():
        return removed
    for stale in region_dir.glob("*.mca.tmp.*"):
        try:
            stale.unlink()
            removed += 1
        except OSError as exc:
            logger.warning("Could not remove stale tmp %s: %s", stale, exc)
    if removed:
        logger.info("Swept %d stale merge tmp files from %s", removed, region_dir)
    return removed


def parse_region_name(name: str) -> tuple[int, int] | None:
    """Return (region_x, region_z) for names like ``r.4.-119.mca``."""
    m = _REGION_NAME_RE.match(name)
    if not m:
        return None
    return int(m.group(1)), int(m.group(2))


def tile_block_origin(
    tile: str, blocks_per_tile: int, degree_per_tile: int = 1
) -> tuple[int, int]:
    """Return the (x, z) block origin of *tile*, mirroring sections/shift.js.

    shift.js (scale=blocks_per_tile, tilesPerMap=degree_per_tile) computes:
      N: z0 = -((lat - tpm + 1) * scale) / tpm - scale
      S: z0 =  ((lat + tpm - 1) * scale) / tpm - scale
      E: x0 =  lon * scale / tpm
      W: x0 = -lon * scale / tpm
    """
    m = _TILE_NAME_RE.match(tile)
    if not m:
        raise ValueError(f"Unrecognised tile name: {tile!r}")
    lat, lon = int(m.group(2)), int(m.group(4))
    scale, tpm = blocks_per_tile, degree_per_tile
    if scale % tpm:
        raise ValueError(
            f"blocks_per_tile={scale} must be divisible by degree_per_tile={tpm}"
        )
    if m.group(1) == "N":
        z0 = -((lat - tpm + 1) * scale) // tpm - scale
    else:
        z0 = ((lat + tpm - 1) * scale) // tpm - scale
    x0 = lon * scale // tpm if m.group(3) == "E" else -(lon * scale) // tpm
    return x0, z0


def tile_chunk_bounds(
    tile: str, blocks_per_tile: int, degree_per_tile: int = 1
) -> tuple[int, int, int, int]:
    """Inclusive chunk-coordinate bounds (cx0, cz0, cx1, cz1) owned by *tile*."""
    if blocks_per_tile % CHUNK_BLOCKS:
        raise ValueError(
            f"blocks_per_tile={blocks_per_tile} must be a multiple of "
            f"{CHUNK_BLOCKS} for unambiguous chunk ownership"
        )
    x0, z0 = tile_block_origin(tile, blocks_per_tile, degree_per_tile)
    span = blocks_per_tile // CHUNK_BLOCKS
    return (
        x0 // CHUNK_BLOCKS,
        z0 // CHUNK_BLOCKS,
        x0 // CHUNK_BLOCKS + span - 1,
        z0 // CHUNK_BLOCKS + span - 1,
    )


def read_region_chunks(path: Path) -> dict[int, tuple[int, bytes]]:
    """Read all chunks of a region file: header index -> (timestamp, payload).

    The header index is ``local_cz * 32 + local_cx``.  The payload is the raw
    on-disk chunk record (4-byte big-endian length + 1-byte compression type +
    compressed data); it is copied verbatim, never decompressed.  Corrupt or
    truncated entries are skipped with a warning so a damaged neighbour file
    can never abort a whole merge.
    """
    data = path.read_bytes()
    chunks: dict[int, tuple[int, bytes]] = {}
    if len(data) < 2 * SECTOR_BYTES:
        if data:
            logger.warning(
                "Region %s: truncated header (%d bytes); treating as empty",
                path,
                len(data),
            )
        return chunks
    for i in range(1024):
        entry = data[i * 4 : i * 4 + 4]
        offset = (entry[0] << 16) | (entry[1] << 8) | entry[2]
        sector_count = entry[3]
        if offset == 0 and sector_count == 0:
            continue
        start = offset * SECTOR_BYTES
        if offset < 2 or start + 4 > len(data):
            logger.warning(
                "Region %s: chunk %d offset outside file; skipped", path, i
            )
            continue
        length = int.from_bytes(data[start : start + 4], "big")
        end = start + 4 + length
        if length < 1 or end > len(data):
            logger.warning(
                "Region %s: chunk %d corrupt length %d; skipped", path, i, length
            )
            continue
        timestamp = int.from_bytes(
            data[SECTOR_BYTES + i * 4 : SECTOR_BYTES + i * 4 + 4], "big"
        )
        chunks[i] = (timestamp, data[start:end])
    return chunks


def write_region_atomic(path: Path, chunks: dict[int, tuple[int, bytes]]) -> None:
    """Write *chunks* as a region file via tmp-file + atomic rename."""
    offsets = bytearray(SECTOR_BYTES)
    stamps = bytearray(SECTOR_BYTES)
    body = bytearray()
    sector = 2
    for i in sorted(chunks):
        timestamp, payload = chunks[i]
        nsec = (len(payload) + SECTOR_BYTES - 1) // SECTOR_BYTES
        if nsec > 255 or sector + nsec > 0xFFFFFF:
            # Oversized chunks need .mcc sidecar files (unsupported); a region
            # exceeding 2^24 sectors cannot be addressed.  Neither occurs with
            # WorldPainter exports - skip defensively rather than corrupt.
            logger.error(
                "Region %s: chunk %d needs %d sectors; DROPPED (unsupported "
                "oversized chunk)",
                path,
                i,
                nsec,
            )
            continue
        offsets[i * 4 : i * 4 + 4] = bytes(
            [(sector >> 16) & 0xFF, (sector >> 8) & 0xFF, sector & 0xFF, nsec]
        )
        stamps[i * 4 : i * 4 + 4] = (timestamp & 0xFFFFFFFF).to_bytes(4, "big")
        body += payload
        body += b"\x00" * (-len(payload) % SECTOR_BYTES)
        sector += nsec
    tmp = path.with_name(f"{path.name}.tmp.{os.getpid()}.{threading.get_ident()}")
    try:
        with open(tmp, "wb") as fh:
            fh.write(offsets)
            fh.write(stamps)
            fh.write(body)
            fh.flush()
            # Durability before rename: without this, a power loss can leave a
            # zero-length renamed file, silently losing the neighbour chunks
            # that were already merged into the previous version of dest.
            os.fsync(fh.fileno())
        os.replace(tmp, path)
    finally:
        if tmp.exists():
            tmp.unlink(missing_ok=True)


def _move_atomic(src: Path, dest: Path) -> None:
    """Move *src* to *dest* without ever exposing a half-copied dest."""
    try:
        os.rename(src, dest)
    except OSError:
        tmp = dest.with_name(
            f"{dest.name}.tmp.{os.getpid()}.{threading.get_ident()}"
        )
        try:
            shutil.copyfile(src, tmp)
            os.replace(tmp, dest)
        finally:
            if tmp.exists():
                tmp.unlink(missing_ok=True)
        src.unlink(missing_ok=True)


def merge_tile_region(
    src: Path,
    dest_dir: Path,
    tile: str,
    blocks_per_tile: int,
    degree_per_tile: int = 1,
) -> str:
    """Merge one exported region file of *tile* into the final region dir.

    Only chunks geographically owned by *tile* are written; chunks already in
    the destination (owned by neighbouring tiles) are preserved.  Returns the
    action taken: ``moved`` (fast path, whole region owned and dest absent),
    ``merged`` (combined with existing dest), ``rewritten`` (filtered copy,
    dest was absent) or ``skipped`` (no owned chunks in src).
    """
    coords = parse_region_name(src.name)
    if coords is None:
        dest = dest_dir / src.name
        if not dest.exists():
            _move_atomic(src, dest)
            return "moved"
        return "skipped"
    rx, rz = coords
    cx0, cz0, cx1, cz1 = tile_chunk_bounds(tile, blocks_per_tile, degree_per_tile)
    lo_x = max(cx0 - rx * REGION_CHUNKS, 0)
    hi_x = min(cx1 - rx * REGION_CHUNKS, REGION_CHUNKS - 1)
    lo_z = max(cz0 - rz * REGION_CHUNKS, 0)
    hi_z = min(cz1 - rz * REGION_CHUNKS, REGION_CHUNKS - 1)
    if lo_x > hi_x or lo_z > hi_z:
        return "skipped"  # region lies entirely outside the tile (pure overhang)
    fully_owned = (lo_x, lo_z, hi_x, hi_z) == (
        0,
        0,
        REGION_CHUNKS - 1,
        REGION_CHUNKS - 1,
    )
    dest = dest_dir / src.name
    with _lock_for(dest), _FileLock(dest):
        dest_exists = dest.exists()
        if fully_owned and not dest_exists:
            _move_atomic(src, dest)
            return "moved"
        src_chunks = read_region_chunks(src)
        owned = {
            i: v
            for i, v in src_chunks.items()
            if lo_x <= (i % REGION_CHUNKS) <= hi_x
            and lo_z <= (i // REGION_CHUNKS) <= hi_z
        }
        if not owned:
            return "skipped"
        merged = read_region_chunks(dest) if dest_exists else {}
        merged.update(owned)
        write_region_atomic(dest, merged)
        return "merged" if dest_exists else "rewritten"


__all__ = [
    "merge_tile_region",
    "parse_region_name",
    "read_region_chunks",
    "sweep_tmp_files",
    "tile_block_origin",
    "tile_chunk_bounds",
    "write_region_atomic",
]
