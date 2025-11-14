"""Command line interface for the world generator."""

import argparse
import logging
from pathlib import Path
from typing import Sequence

from .config import load_config
from .pipeline import WorldGenerationPipeline


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Minecraft world generator")
    parser.add_argument(
        "command",
        choices=("run", "preprocess", "tiles"),
        nargs="?",
        default="run",
        help="Pipeline stage to run",
    )
    parser.add_argument(
        "-c",
        "--config",
        type=Path,
        default=None,
        help="Path to config YAML (defaults to config.yaml)",
    )
    parser.add_argument(
        "--log-level",
        default="INFO",
        help="Python logging level (default: INFO)",
    )
    parser.add_argument(
        "--log-file",
        type=Path,
        default=Path("generator.log"),
        help="File to write logs to (default: generator.log)",
    )
    parser.add_argument(
        "--console",
        action="store_true",
        help="Also stream logs to stdout",
    )
    return parser


def _configure_logging(log_file: Path | None, level: str, mirror_console: bool) -> None:
    handlers: list[logging.Handler] = []
    if log_file:
        handlers.append(logging.FileHandler(log_file))
    if mirror_console:
        handlers.append(logging.StreamHandler())
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        handlers=handlers or None,
    )


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    _configure_logging(args.log_file, args.log_level, args.console)

    config = load_config(args.config)
    pipeline = WorldGenerationPipeline(config)

    if args.command == "preprocess":
        pipeline.preprocess()
    elif args.command == "tiles":
        pipeline.generate_tiles()
    else:
        pipeline.run_all()
    return 0


__all__ = ["build_parser", "main"]
