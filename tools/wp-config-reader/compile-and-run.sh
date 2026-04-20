#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
WP_LIB="/opt/worldpainter/lib"

echo "=== Compiling ReadConfig.java ==="
javac -cp "$WP_LIB/*" "$SCRIPT_DIR/ReadConfig.java"
if [ $? -ne 0 ]; then
    echo "Compilation failed!" >&2
    exit 1
fi

echo "=== Running ReadConfig ==="
java -cp "$WP_LIB/*:$SCRIPT_DIR" ReadConfig "$REPO_ROOT/Docker/config" | tee "$SCRIPT_DIR/current-config.yaml"
