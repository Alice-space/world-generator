def calculateTiles(xMin: float, yMax: float) -> str:
    """Return a tile identifier like ``N10E123`` from the min X and max Y bounds.

    Example: ``calculateTiles(-73.5, 41.0)`` -> ``N40W073``
    """
    # Calculate longNumber and latNumber
    longNumber = abs(xMin) if xMin <= 0 else xMin
    latNumber = (abs(yMax) + 1) if yMax <= 0 else yMax - 1
    # Determine longDir and latDir
    longDir = "E" if xMin >= 0 else "W"
    latDir = "S" if yMax <= 0 else "N"
    tile = f"{latDir}{latNumber:02}{longDir}{longNumber:03}"
    return tile
