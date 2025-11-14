"use strict";
//Tested with MET Version 1.5.6
//Tested with Worldpainter Version 2.22.0
//Tested with QGIS Version 3.34.1
//Other versions will most likely work, but it is not guaranteed
//Created by DerMattinger

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

var SECTION_SEQUENCE = [
	// shift calculations
	"shift",
	// variables
	"variables",
	// layers
	"layers",
	// heightmap
	"heightmap",
	// terrain import (important! after the world was created)
	"terrain_import",
	// custom biomes (important! after the world was created)
	"custom_biomes",
	// filters
	"filters",
	// climate
	"climate",
	// terrain
	"terrain",
	// water
	"water",
	// vegetation
	"vegetation",
	// steep mountains (after vegetation)
	"steep_mountains",
	// volcano
	"volcano",
	// landuse
	"landuse",
	// borders
	"borders",
	// adjust water depht on rivers and lakes
	"water_depth_adjustments",
	// remove temporary layers for filtering mixed vegetation
	"mixed_layer_cleanup",
	// delete duplicate XdeepWater layers
	"deepwater_cleanup",
	// roads
	"roads",
	// vanilla ores 
	"vanilla_ores",
	// caves
	"caves",
	// additional ores
	"additional_ores",
	// 1.12 & 1.18+ populate layer
	"populate_layers",
	// export
	"export"
];

loadSections(SECTION_SEQUENCE);

function loadSections(sectionNames) {
	for (var i = 0; i < sectionNames.length; i += 1) {
		load("sections/" + sectionNames[i] + ".js");
	}
}
