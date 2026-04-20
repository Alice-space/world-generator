#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WP_LIB="/opt/worldpainter/lib"
javac -cp "$WP_LIB/*" "$SCRIPT_DIR/WriteConfig.java" && \
java -cp "$WP_LIB/*:$SCRIPT_DIR" WriteConfig "$@"
