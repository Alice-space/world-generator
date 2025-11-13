from __future__ import annotations

import logging
import subprocess
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


def magick_run(
    cmd: list[str | Path], *, allow_fail: bool = False, cwd: Path | str | None = None
) -> tuple[str, str]:
    """Run ImageMagick magick/convert/composite command and return stdout/stderr."""
    exe = cmd[0]
    exe = "magick" if str(exe).endswith(("convert", "composite")) else str(exe)
    cmd = [exe] + [str(a) for a in cmd[1:]]
    logger.debug("Running: %s", " ".join(cmd))
    cp = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)
    if cp.returncode != 0 and not allow_fail:
        logger.error("Command failed: %s", " ".join(cmd))
        logger.error("stdout: %s", cp.stdout)
        logger.error("stderr: %s", cp.stderr)
        raise RuntimeError(f"Command failed: {' '.join(cmd)}")
    if cp.stdout:
        logger.debug("stdout: %s", cp.stdout)
    if cp.stderr:
        logger.warning("stderr: %s", cp.stderr)
    return cp.stdout, cp.stderr


def convert(src: str | Path, dst: str | Path, **kwargs: Any) -> None:
    """Thin convenience wrapper around 'convert' (magick convert)."""
    cmd = ["convert", src, *([k, v] if v is not None else [k] for k, v in kwargs.items()), dst]
    magick_run(cmd)


def composite(top: str | Path, base: str | Path, dst: str | Path, **kwargs: Any) -> None:
    """Thin convenience wrapper around 'composite' (magick composite)."""
    cmd = ["composite", *([k, v] if v is not None else [k] for k, v in kwargs.items()), top, base, dst]
    magick_run(cmd)

