from __future__ import annotations

import logging
import subprocess
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


def magick_run(
    args: list[str | Path], **kwargs: Any
) -> subprocess.CompletedProcess[bytes]:
    try:
        return subprocess.run(
            [str(a) for a in args], capture_output=True, check=True, **kwargs
        )
    except subprocess.CalledProcessError as e:
        logger.error("ImageMagick failed: %s", e.stderr.decode(errors="replace"))
        raise


def convert(src: str | Path, dst: str | Path, **kwargs: Any) -> None:
    magick_run(["convert", "-verbose", str(src), str(dst)], **kwargs)


def composite(
    top: str | Path, base: str | Path, dst: str | Path, **kwargs: Any
) -> None:
    magick_run(
        ["composite", "-verbose", "-gravity", "center", str(top), str(base), str(dst)],
        **kwargs,
    )
