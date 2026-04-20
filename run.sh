#!/bin/sh
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ulimit -s unlimited
ulimit -n 100000
export MAGICK_CONFIGURE_PATH=$HOME/.config/ImageMagick
export INSTALL4J_ADD_VM_PARAMS="-Xmx8G"
# Use venv Python if available, fall back to system Python
if [ -x "$SCRIPT_DIR/venv/bin/python3" ]; then
    PYTHON="$SCRIPT_DIR/venv/bin/python3"
else
    PYTHON=python3
fi
xvfb-run "$PYTHON" -m world_generator.cli "$@"
