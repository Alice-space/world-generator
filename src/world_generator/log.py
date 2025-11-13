from __future__ import annotations

import logging
import sys
from pathlib import Path
from typing import Literal

LogLevel = Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]


def setup_logging(level: LogLevel = "INFO", log_file: Path | str | None = None) -> None:
    """Set up application-wide logging with a single file handler and optional console output."""
    handlers = []
    if log_file:
        handler = logging.FileHandler(Path(log_file).expanduser().resolve())
        handler.setLevel(level)
        fmt = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
        handler.setFormatter(fmt)
        handlers.append(handler)
    console = logging.StreamHandler(sys.stdout)
    console.setLevel(level)
    console_fmt = logging.Formatter("%(name)s - %(levelname)s - %(message)s")
    console.setFormatter(console_fmt)
    handlers.append(console)

    logging.basicConfig(
        level=level,
        handlers=handlers,
        force=True,
    )

