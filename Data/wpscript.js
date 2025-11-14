"use strict";
//Tested with MET Version 1.5.6
//Tested with Worldpainter Version 2.22.0
//Tested with QGIS Version 3.34.1
//Other versions will most likely work, but it is not guaranteed
//Created by DerMattinger

//startup parameters
if (true) {

	var path = arguments[0];
	var directionLatitude = arguments[1];
	var latitude = parseInt(arguments[2]);
	var directionLongitute = arguments[3];
	var longitute = parseInt(arguments[4]);
	var scale = parseInt(arguments[5]);
	var tilesPerMap = parseInt(arguments[6]);
	var verticalScale = parseInt(arguments[7]);

	var settingsBorders = arguments[8];
	var settingsStateBorders = arguments[9];
	var settingsHighways = arguments[10];
	var settingsStreets = arguments[11];
	var settingsSmallStreets = arguments[12];
	var settingsBuildings = arguments[13];
	var settingsOres = arguments[14];
	var settingsNetherite = arguments[15];
	var settingsFarms = arguments[16];
	var settingsMeadows = arguments[17];
	var settingsQuarrys = arguments[18];
	var settingsAerodrome = arguments[19];
	var settingsMobSpawner = arguments[20];
	var settingsAnimalSpawner = arguments[21];
	var settingsRivers = arguments[22];
	var settingsStreams = arguments[23];
	var settingsVolcanos = arguments[24];
	var settingsShrubs = arguments[25];
	var settingsCrops = arguments[26];
	var settingsMapVersion = arguments[27];
	var settingsMapOffset = arguments[28];
	var settingsLowerBuildLimit = parseInt(arguments[29]);
	var settingsUpperBuildLimit = parseInt(arguments[30]);
	var settingsVanillaPopulation = arguments[31];
	var heightmapName = arguments[32];
	var biomeSource = arguments[33];
	var oreModifier = arguments[34];
	var mod_BOP = arguments[35];
	var mod_BYG = arguments[36];
	var mod_Terralith = arguments[37];
	var mod_williamWythers = arguments[38];
	var mod_Create = arguments[39];
}

load("utils.js");

//shift calculations
load("sections/shift.js");

//variables
load("sections/variables.js");

//layers
load("sections/layers.js");

//heightmap
load("sections/heightmap.js");

//terrain import (important! after the world was created)
load("sections/terrain_import.js");

//custom biomes (important! after the world was created)
load("sections/custom_biomes.js");

//filters
load("sections/filters.js");

//climate
load("sections/climate.js");

//terrain
load("sections/terrain.js");

//water
load("sections/water.js");

//vegetation
load("sections/vegetation.js");

//steep mountains (after vegetation)
load("sections/steep_mountains.js");

//volcano
load("sections/volcano.js");

//landuse
load("sections/landuse.js");

//borders
load("sections/borders.js");

//adjust water depht on rivers and lakes
load("sections/water_depth_adjustments.js");

//remove temporary layers for filtering mixed vegetation
load("sections/mixed_layer_cleanup.js");

//delete duplicate XdeepWater layers
load("sections/deepwater_cleanup.js");

//roads
load("sections/roads.js");

//vanilla ores 
load("sections/vanilla_ores.js");

//caves
load("sections/caves.js");

//additional ores
load("sections/additional_ores.js");

//1.12 & 1.18+ populate layer
load("sections/populate_layers.js");

//export
load("sections/export.js");
