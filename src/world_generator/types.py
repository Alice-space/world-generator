from __future__ import annotations

from typing import Dict

# Minimal typing for OSM feature toggles
OSMSwitch = Dict[str, bool]

# Optional typed dict for config keys (lightweight shim without Pydantic)
class ConfigDict(Dict[str, object]):
    pass

