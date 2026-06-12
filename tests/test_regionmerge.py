"""Unit tests for chunk-level region merging.

Run directly (no pytest needed):  python3 tests/test_regionmerge.py
regionmerge has no third-party deps, so it is imported standalone to keep the
test runnable on machines without the full pipeline environment.
"""

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

_MODULE_PATH = (
    Path(__file__).resolve().parents[1]
    / "src"
    / "world_generator"
    / "regionmerge.py"
)
_spec = importlib.util.spec_from_file_location("regionmerge", _MODULE_PATH)
regionmerge = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(regionmerge)

BPT = 2240  # blocks_per_tile used throughout (1:50 config)


def payload(tag: bytes) -> bytes:
    """Fake on-disk chunk record: 4-byte length + compression byte + data."""
    data = b"\x02" + tag  # compression type 2 (zlib) + opaque bytes
    return len(data).to_bytes(4, "big") + data


def region_with(path: Path, entries: dict) -> None:
    chunks = {i: (1234, payload(tag)) for i, tag in entries.items()}
    regionmerge.write_region_atomic(path, chunks)


def idx(cx: int, cz: int) -> int:
    return cz * 32 + cx


class TileMathTest(unittest.TestCase):
    def test_origins_match_shift_js(self):
        # Values cross-checked against sections/shift.js and observed exports
        self.assertEqual(regionmerge.tile_block_origin("N00E006", BPT), (13440, -2240))
        self.assertEqual(regionmerge.tile_block_origin("N00E000", BPT), (0, -2240))
        self.assertEqual(regionmerge.tile_block_origin("S01E006", BPT), (13440, 0))
        self.assertEqual(regionmerge.tile_block_origin("S49E014", BPT), (31360, 107520))
        self.assertEqual(
            regionmerge.tile_block_origin("N89W180", BPT), (-403200, -201600)
        )
        self.assertEqual(
            regionmerge.tile_block_origin("S90E179", BPT), (400960, 199360)
        )

    def test_chunk_bounds(self):
        # N00E006: blocks x 13440..15679, z -2240..-1
        self.assertEqual(
            regionmerge.tile_chunk_bounds("N00E006", BPT), (840, -140, 979, -1)
        )

    def test_bad_names_rejected(self):
        with self.assertRaises(ValueError):
            regionmerge.tile_block_origin("X00E006", BPT)
        self.assertIsNone(regionmerge.parse_region_name("level.dat"))
        self.assertEqual(regionmerge.parse_region_name("r.4.-119.mca"), (4, -119))


class RoundTripTest(unittest.TestCase):
    def test_write_read_roundtrip(self):
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / "r.0.0.mca"
            entries = {idx(0, 0): b"a", idx(31, 31): b"b", idx(5, 7): b"c" * 5000}
            region_with(p, entries)
            back = regionmerge.read_region_chunks(p)
            self.assertEqual(set(back), set(entries))
            for i, tag in entries.items():
                self.assertEqual(back[i][1], payload(tag))
            # File is sector-aligned with 2-sector header
            self.assertEqual(p.stat().st_size % 4096, 0)
            self.assertGreaterEqual(p.stat().st_size, 3 * 4096)

    def test_corrupt_entries_skipped(self):
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / "r.0.0.mca"
            region_with(p, {idx(1, 1): b"ok"})
            raw = bytearray(p.read_bytes())
            # Add a header entry pointing past EOF
            i = idx(2, 2)
            raw[i * 4 : i * 4 + 4] = bytes([0, 1, 0, 1])  # offset 256 -> beyond file
            p.write_bytes(bytes(raw))
            back = regionmerge.read_region_chunks(p)
            self.assertEqual(set(back), {idx(1, 1)})


class MergeTest(unittest.TestCase):
    """Simulate the real N00E000|N00E001 shared boundary region r.4.-1.

    N00E000 owns chunks cx 0..139; region 4 covers cx 128..159, so it owns
    local cols 0..11.  Its WorldPainter export also contains void overhang
    cols 12..15 (128-block tile grid).  N00E001 owns cx 140..279 -> local
    cols 12..31, and its export contains overhang cols 8..11.
    """

    def make_exports(self, td: Path):
        a = td / "A" / "r.4.-1.mca"
        b = td / "B" / "r.4.-1.mca"
        a.parent.mkdir()
        b.parent.mkdir()
        region_with(
            a, {idx(c, z): b"A%d.%d" % (c, z) for c in range(0, 16) for z in (0, 31)}
        )
        region_with(
            b, {idx(c, z): b"B%d.%d" % (c, z) for c in range(8, 32) for z in (0, 31)}
        )
        return a, b

    def check_final(self, dest: Path):
        back = regionmerge.read_region_chunks(dest)
        # full 32 columns present, no holes
        self.assertEqual(len(back), 64)
        for z in (0, 31):
            for c in range(0, 12):  # owned by A
                self.assertEqual(back[idx(c, z)][1], payload(b"A%d.%d" % (c, z)))
            for c in range(12, 32):  # owned by B — overhang from A must not leak
                self.assertEqual(back[idx(c, z)][1], payload(b"B%d.%d" % (c, z)))

    def test_merge_order_independent(self):
        for order in ("AB", "BA"):
            with tempfile.TemporaryDirectory() as td:
                td = Path(td)
                a, b = self.make_exports(td)
                dest = td / "world"
                dest.mkdir()
                seq = [(a, "N00E000"), (b, "N00E001")]
                if order == "BA":
                    seq.reverse()
                for src, tile in seq:
                    regionmerge.merge_tile_region(src, dest, tile, BPT)
                self.check_final(dest / "r.4.-1.mca")

    def test_remerge_idempotent(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            a, b = self.make_exports(td)
            dest = td / "world"
            dest.mkdir()
            regionmerge.merge_tile_region(a, dest, "N00E000", BPT)
            regionmerge.merge_tile_region(b, dest, "N00E001", BPT)
            first = (dest / "r.4.-1.mca").read_bytes()
            # Re-export of A merged again (retry path) must not change content
            a2 = td / "A2" / "r.4.-1.mca"
            a2.parent.mkdir()
            region_with(
                a2,
                {idx(c, z): b"A%d.%d" % (c, z) for c in range(0, 16) for z in (0, 31)},
            )
            regionmerge.merge_tile_region(a2, dest, "N00E000", BPT)
            self.assertEqual((dest / "r.4.-1.mca").read_bytes(), first)

    def test_fully_owned_fast_path_moves(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            # N00E001 spans regions x 4..8; region 5..7 (cx 160..255) fully owned
            src = td / "r.5.-1.mca"
            region_with(src, {idx(0, 0): b"x"})
            dest = td / "world"
            dest.mkdir()
            action = regionmerge.merge_tile_region(src, dest, "N00E001", BPT)
            self.assertEqual(action, "moved")
            self.assertFalse(src.exists())
            self.assertTrue((dest / "r.5.-1.mca").exists())

    def test_overhang_only_region_skipped(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            # Region x=3 (cx 96..127) is entirely outside N00E001 (cx 140..279)
            src = td / "r.3.-1.mca"
            region_with(src, {idx(31, 0): b"void"})
            dest = td / "world"
            dest.mkdir()
            action = regionmerge.merge_tile_region(src, dest, "N00E001", BPT)
            self.assertEqual(action, "skipped")
            self.assertFalse((dest / "r.3.-1.mca").exists())

    def test_non_region_file_moved_once(self):
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            src = td / "stray.dat"
            src.write_bytes(b"hello")
            dest = td / "world"
            dest.mkdir()
            self.assertEqual(
                regionmerge.merge_tile_region(src, dest, "N00E001", BPT), "moved"
            )
            src2 = td / "stray.dat"
            src2.write_bytes(b"other")
            self.assertEqual(
                regionmerge.merge_tile_region(src2, dest, "N00E001", BPT), "skipped"
            )
            self.assertEqual((dest / "stray.dat").read_bytes(), b"hello")


if __name__ == "__main__":
    unittest.main(verbosity=2)
