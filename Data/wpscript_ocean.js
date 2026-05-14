"use strict";
// Ocean-only variant of wpscript.js — skips terrain, landuse, roads, biomes,
// ores, caves, and all land-specific processing.  Only loads water-related
// sections plus their required dependencies (custom_biomes for BIOME_RIVER,
// filters for noWaterFilter/noWaterFilterForRivers).
// Created for world-generator ocean fast path.

var GLOBAL_CONTEXT = Function("return this;")();

function parseIntArg(value) {
	return parseInt(value, 10);
}

var STARTUP_ARGUMENTS = [
	{ name: "path" },
	{ name: "directionLatitude" },
	{ name: "latitude", parser: parseIntArg },
	{ name: "directionLongitute" },
	{ name: "longitute", parser: parseIntArg },
	{ name: "scale", parser: parseIntArg },
	{ name: "tilesPerMap", parser: parseIntArg },
	{ name: "verticalScale", parser: parseIntArg },

	{ name: "settingsBorders" },
	{ name: "settingsStateBorders" },
	{ name: "settingsHighways" },
	{ name: "settingsStreets" },
	{ name: "settingsSmallStreets" },
	{ name: "settingsBuildings" },
	{ name: "settingsOres" },
	{ name: "settingsNetherite" },
	{ name: "settingsFarms" },
	{ name: "settingsMeadows" },
	{ name: "settingsQuarrys" },
	{ name: "settingsAerodrome" },
	{ name: "settingsMobSpawner" },
	{ name: "settingsAnimalSpawner" },
	{ name: "settingsRivers" },
	{ name: "settingsStreams" },
	{ name: "settingsVolcanos" },
	{ name: "settingsShrubs" },
	{ name: "settingsCrops" },
	{ name: "settingsMapVersion" },
	{ name: "settingsMapOffset" },
	{ name: "settingsLowerBuildLimit", parser: parseIntArg },
	{ name: "settingsUpperBuildLimit", parser: parseIntArg },
	{ name: "settingsVanillaPopulation" },
	{ name: "heightmapName" },
	{ name: "biomeSource" },
	{ name: "oreModifier" },
	{ name: "mod_BOP" },
	{ name: "mod_BYG" },
	{ name: "mod_Terralith" },
	{ name: "mod_williamWythers" },
	{ name: "mod_Create" }
];

(function assignStartupArguments(args) {
	for (var i = 0; i < STARTUP_ARGUMENTS.length; i += 1) {
		var spec = STARTUP_ARGUMENTS[i];
		var value = args[i];
		if (typeof spec.parser === "function") {
			value = spec.parser(value);
		}
		GLOBAL_CONTEXT[spec.name] = value;
	}
})(arguments);

load("utils.js");
load("sections/lib/utils.js");

// Construct tile name (normally done by shift.js, but we need it before
// loading climateImage for the ocean fast path).
var tile = "";
if (latitude > 9) {
	tile = tile.concat(directionLatitude + latitude);
} else {
	tile = tile.concat(directionLatitude + "0" + latitude);
}
if (longitute > 99) {
	tile = tile.concat(directionLongitute + longitute);
} else if (longitute > 9) {
	tile = tile.concat(directionLongitute + "0" + longitute);
} else {
	tile = tile.concat(directionLongitute + "00" + longitute);
}

// Load climateImage directly (water.js needs it for mangrove logic).
// We skip the 2336-line climate.js which does full biome mapping —
// we only need the heightmap image loaded for water.js reference checks.
var _climatePath = path + "image_exports/" + tile + "/" + tile + "_climate.png";
print("ocean: loading climate from " + _climatePath);
try {
	var climateImage = wp.getHeightMap().fromFile(_climatePath).go();
	print("ocean: climateImage loaded OK, type=" + typeof climateImage);
} catch (e) {
	print("ocean: ERROR loading climateImage: " + e);
	throw e;
}

// Minimal section sequence for ocean-only tiles.
// climateImage is loaded above (just the PNG, no biome mapping).
// custom_biomes provides BIOME_RIVER/BIOME_MANGROVE_SWAMP.
// filters provides noWaterFilter/noWaterFilterForRivers/swampFilterBelowDegrees.
// shift.js re-defines tile (idempotent — same result as above).
// Skipped vs full wpscript.js: climate (full 2336 lines), terrain, vegetation,
// steep_mountains, volcano, landuse, borders, water_depth_adjustments,
// mixed_layer_cleanup, deepwater_cleanup, roads, vanilla_ores,
// caves, additional_ores, populate_layers.
var SECTION_SEQUENCE = [
	"shift",
	"variables",
	"layers",
	"heightmap",
	"terrain_import",
	"custom_biomes",
	"filters",
	"water",
	"export"
];

function loadSections(sectionNames) {
	for (var i = 0; i < sectionNames.length; i += 1) {
		load("sections/" + sectionNames[i] + ".js");
	}
}

loadSections(SECTION_SEQUENCE);
