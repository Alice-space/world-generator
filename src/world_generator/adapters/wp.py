from __future__ import annotations

import logging
import os
import subprocess
from pathlib import Path
from typing import Optional

from ..utils.tiles import calculate_tiles

logger = logging.getLogger(__name__)


class WorldPainterScriptNotFound(Exception):
    pass


def worldpaint(
    tile: str,
    degree_per_tile: int,
    blocks_per_tile: int,
    height_ratio: int,
    scripts_folder: Path,
    check_exit_code: bool = True,
    timeout: Optional[float] = None,
) -> None:
    scriptjs = Path(scripts_folder, "wpscript.js")
    world_path = Path(scripts_folder, "wpscript", "worldpainter_files", f"{tile}.world")
    world_path.parent.mkdir(parents=True, exist_ok=True)
    if world_path.exists():
        logger.info("World file exists, skipping %s", tile)
        return
    if not scriptjs.exists():
        raise WorldPainterScriptNotFound(f"wpscript.js not found at {scriptjs}")
    args = [
        "wpscript",
        "--tmpdir",
        str(scripts_folder),
    ]
    if not logger.isEnabledFor(logging.DEBUG):
        args.append("--loglevel=ERROR")
    args.extend(
        [
            str(scriptjs),
            str(scripts_folder),
            tile,
            str(degree_per_tile),
            str(blocks_per_tile),
            str(height_ratio),
        ]
    )
    logger.info("Running wpscript for tile %s", tile)
    try:
        # WorldPainter respects JAVA_OPTS; ensure headless by forcing AWT headful off
        env = os.environ.copy()
        env["JAVA_OPTS"] = (env.get("JAVA_OPTS") or "") + " -Djava.awt.headless=true"
        cp = subprocess.run(
            args, capture_output=True, check=check_exit_code, timeout=timeout, env=env
        )
        logger.debug("wpscript stdout: %s", cp.stdout.decode(errors="replace"))
        if cp.stderr:
            logger.debug("wpscript stderr: %s", cp.stderr.decode(errors="replace"))
    except subprocess.TimeoutExpired:
        logger.warning("wpscript for tile %s timed out", tile)
        raise


def worldpaint_export(
    tile: str,
    world_name: str,
    scripts_folder: Path,
    check_exit_code: bool = True,
    timeout: Optional[float] = None,
) -> None:
    from pathlib import Path as _Path
    from typing import Optional as _Optional  # type: ignore

    scriptjs = _Path(scripts_folder, "wpscript.js")
    if not scriptjs.exists():
        raise WorldPainterScriptNotFound(f"wpscript.js not found at {scriptjs}")
    p = _Path(scripts_folder, "render")
    world_path = _Path(
        scripts_folder, "wpscript", "worldpainter_files", f"{tile}.world"
    )
    if not world_path.exists():
        logger.info("World file not found for tile %s, skip render", tile)
        return
    p.mkdir(parents=True, exist_ok=True)
    exports = _Path(scripts_folder, "wpscript", "exports", tile)
    preview = _Path(scripts_folder, "render", f"{tile}.png")
    args = [
        "wpscript",
        "--tmpdir",
        str(scripts_folder),
    ]
    if not logger.isEnabledFor(logging.DEBUG):
        args.append("--loglevel=ERROR")
    args.extend(
        [
            str(scriptjs),
            str(world_path),
            str(world_name),
            str(exports),
            str(preview),
        ]
    )
    logger.info("Rendering tile %s", tile)
    try:
        env = os.environ.copy()
        env["JAVA_OPTS"] = (env.get("JAVA_OPTS") or "") + " -Djava.awt.headless=true"
        cp = subprocess.run(
            args, capture_output=True, check=check_exit_code, timeout=timeout, env=env
        )
        logger.debug("wpscript export stdout: %s", cp.stdout.decode(errors="replace"))
        if cp.stderr:
            logger.debug(
                "wpscript export stderr: %s", cp.stderr.decode(errors="replace")
            )
    except subprocess.TimeoutExpired:
        logger.warning("wpscript export for tile %s timed out", tile)
        raise


def post_merge(scripts_folder: Path, world_name: str) -> Path:
    final = Path(scripts_folder, world_name)
    logger.info("Generating merged tile list")
    exports = Path(scripts_folder, "wpscript", "exports")
    region_dirs = [p for p in exports.iterdir() if p.is_dir()]
    if final.exists():
        import shutil

        shutil.rmtree(final)
    final.mkdir(parents=True, exist_ok=True)
    for d in region_dirs:
        for f in d.iterdir():
            import shutil

            shutil.copy2(f, final / f.name)
    png = Path(scripts_folder, f"{world_name}.png")
    args = [
        "montage",
        "-verbose",
        "-mode",
        "Concatenate",
        "-tile",
        "180x90",
        str(exports / "*" / "*.png"),
        str(png),
    ]
    try:
        subprocess.run(args, capture_output=True, check=True)
        logger.info("Merged preview written to %s", png)
    except subprocess.CalledProcessError as e:
        logger.warning("montage failed: %s", e.stderr.decode(errors="replace"))
    return final
