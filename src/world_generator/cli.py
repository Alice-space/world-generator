from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

from .log import setup_logging
from .pipeline import run


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(prog="world-generator")
    p.add_argument("--config", "-c", type=Path, help="Path to config YAML (default: ./config.yaml)")
    p.add_argument("--log-level", choices=["DEBUG","INFO","WARNING","ERROR"], default="INFO", help="Log level (default: INFO)")
    p.add_argument("--log-file", type=Path, help="Optional log file path")
    args = p.parse_args(argv)
    setup_logging(level=args.log_level, log_file=args.log_file)
    try:
        run(cfg_path=args.config)
    except (KeyboardInterrupt, SystemExit):
        logging.getLogger(__name__).info("Interrupted by user")
        return 130
    except Exception as e:
        logging.getLogger(__name__).exception("Pipeline failed: %s", e)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

