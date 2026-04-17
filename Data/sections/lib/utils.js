// WorldPainter script utility functions
// Load via: load("sections/lib/utils.js")
// Requires: global variables 'path', 'tile', 'world', 'shiftLongitute', 'shiftLatitude'
// and all constants from sections/lib/constants.js to be available.

// ---------------------------------------------------------------------------
// Image helpers
// ---------------------------------------------------------------------------

/**
 * Load a tile-specific PNG from the image_exports directory.
 * Equivalent of: wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_' + name + '.png').go()
 *
 * @param {string} name - Image name suffix, e.g. "snow", "clay", "road"
 * @returns heightmap image object
 */
function loadTileImage(name) {
    return wp.getHeightMap()
        .fromFile(path + 'image_exports/' + tile + '/' + tile + '_' + name + '.png')
        .go();
}

// ---------------------------------------------------------------------------
// Layer application helpers
// ---------------------------------------------------------------------------

/**
 * Apply a layer to the world with the global shift and a given level.
 * Replaces the boilerplate:
 *   wp.applyLayer(layer).toWorld(world).shift(shiftLongitute, shiftLatitude).toLevel(level).go()
 *
 * @param {object} layer  - WorldPainter layer object
 * @param {number} level  - Target density/level value
 */
function applyLayerToWorld(layer, level) {
    wp.applyLayer(layer)
        .toWorld(world)
        .shift(shiftLongitute, shiftLatitude)
        .toLevel(level)
        .go();
}

/**
 * Apply a layer to the world with the global shift, a filter, and a given level.
 *
 * @param {object} layer   - WorldPainter layer object
 * @param {object} filter  - WorldPainter filter object (may be null)
 * @param {number} level   - Target density/level value
 */
function applyLayerToWorldWithFilter(layer, filter, level) {
    wp.applyLayer(layer)
        .toWorld(world)
        .shift(shiftLongitute, shiftLatitude)
        .withFilter(filter)
        .toLevel(level)
        .go();
}

// ---------------------------------------------------------------------------
// heightMap chain helpers
// ---------------------------------------------------------------------------

/**
 * Apply a standard 16-step linear density mapping (0-255 -> 15-0) from an
 * image to a layer. Used for tree/vegetation density layers where brighter
 * image pixels mean LOWER density (0 = full, 255 = none).
 *
 * Replaces the repeated pattern:
 *   heightMap(img).applyToLayer(layer)
 *     .fromLevels(0, 15).toLevel(0) ... .fromLevels(240, 255).toLevel(15).go()
 *
 * @param {object} image  - Source heightmap image
 * @param {object} layer  - Target layer
 * @param {object} [filter] - Optional filter (pass null to skip)
 */
function applyDensityMappingToLayer(image, layer, filter) {
    var chain = heightMap(image);
    if (filter) {
        chain = chain.withFilter(filter);
    }
    chain.applyToLayer(layer)
        .fromLevels(0, 15).toLevel(0)
        .fromLevels(16, 31).toLevel(1)
        .fromLevels(32, 47).toLevel(2)
        .fromLevels(48, 63).toLevel(3)
        .fromLevels(64, 79).toLevel(4)
        .fromLevels(80, 95).toLevel(5)
        .fromLevels(96, 111).toLevel(6)
        .fromLevels(112, 127).toLevel(7)
        .fromLevels(128, 143).toLevel(8)
        .fromLevels(144, 159).toLevel(9)
        .fromLevels(160, 175).toLevel(10)
        .fromLevels(176, 191).toLevel(11)
        .fromLevels(192, 207).toLevel(12)
        .fromLevels(208, 223).toLevel(13)
        .fromLevels(224, 239).toLevel(14)
        .fromLevels(240, 255).toLevel(15)
        .go();
}

/**
 * Apply an inverted 16-step density mapping (0-255 -> 8-0) from an image
 * to a deposit layer. Used for ore/deposit layers where bright pixels mean
 * HIGH abundance (0 = 8, 255 = 0).
 *
 * Replaces the repeated pattern in additional_ores.js:
 *   heightMap(img).applyToLayer(layer)
 *     .fromLevels(0, 15).toLevel(8) ... .fromLevels(240, 255).toLevel(0).go()
 *
 * @param {object} image  - Source heightmap image
 * @param {object} layer  - Target layer
 */
function applyDepositMappingToLayer(image, layer) {
    heightMap(image).applyToLayer(layer)
        .fromLevels(0, 15).toLevel(8)
        .fromLevels(16, 31).toLevel(7)
        .fromLevels(32, 47).toLevel(7)
        .fromLevels(48, 63).toLevel(6)
        .fromLevels(64, 79).toLevel(6)
        .fromLevels(80, 95).toLevel(5)
        .fromLevels(96, 111).toLevel(5)
        .fromLevels(112, 127).toLevel(4)
        .fromLevels(128, 143).toLevel(4)
        .fromLevels(144, 159).toLevel(3)
        .fromLevels(160, 175).toLevel(3)
        .fromLevels(176, 191).toLevel(2)
        .fromLevels(192, 207).toLevel(2)
        .fromLevels(208, 223).toLevel(1)
        .fromLevels(224, 239).toLevel(1)
        .fromLevels(240, 255).toLevel(0)
        .go();
}
