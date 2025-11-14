 """Core types and settings for world generator.
 
 Keep backwards compatible re-exports.
 """
 from __future__ import annotations
 
 from .types import OSMSwitch, ConfigDict
 from .settings import Config
 from .log import setup_logging
 
 __all__ = ["Config", "setup_logging", "OSMSwitch", "ConfigDict"]
 
 
