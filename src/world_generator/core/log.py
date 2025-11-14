from __future__ import annotations

import logging
import sys
from pathlib import Path
from typing import Literal

LogLevel = Literal["DEBUG", "INFO", "WARNING", "ERROR"]


def setup_logging(level: LogLevel = "INFO", log_file: Path | str | None = None) -> None:
    """Set up application-wide logging with a single file handler and optional console output."""
    handlers: list[logging.Handler] = []
    if log_file:
        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setFormatter(
            logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
        )
        handlers.append(file_handler)
    console = logging.StreamHandler(sys.stdout)
    console.setLevel(level)
    console_fmt = logging.Formatter("%(name)s - %(levelname)s - %(message)s")
    console.setFormatter(console_fmt)
    handlers.append(console)
    logging.basicConfig(handlers=handlers, level=level, force=True)
