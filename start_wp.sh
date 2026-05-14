#!/bin/bash
cd /home/alice/Documents/SSDDataDisk1T/world-generator
export PYTHONPATH=src
exec xvfb-run -a -s "-screen 0 1024x768x24" venv/bin/python -c '
import sys, logging
logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format="%(asctime)s %(levelname)s %(name)s %(message)s"
)
from world_generator.config import load_config
from world_generator.wpscript import wp_generate
config = load_config("config-50.yaml")
print("Starting WorldPainter generation...", flush=True)
wp_generate(config)
print("WorldPainter generation completed!", flush=True)
'
