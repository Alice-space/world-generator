"use strict";
// wp_daemon_driver.js — Daemon entry point for WorldPainter scripting.
// Executed once per JVM lifetime by wpscript.  Loops over tile requests
// from stdin.
//
// Uses Nashorn's load() in the parent engine with global-state
// save/restore between tiles.  This avoids the loadWithNewGlobal()
// prototype-inheritance issue where `wp` is not visible.
//
// Protocol (NDJSON on stdin/stdout):
//   → {"status": "ready"}
//   ← {"tile":"N48E008","dir_lat":"N","lat":48,"dir_lon":"E","lon":8}
//   → {"status":"done","tile":"N48E008"}
//   ← {"command":"shutdown"}
//   → {"status":"shutdown"}

// -------------------------------------------------------------------
// 1. Parse static CLI arguments
// -------------------------------------------------------------------

function parseIntArg(value) { return parseInt(value, 10); }

var STATIC_ARG_SPEC = [
	{ name: "path" },                                // 0
	{ name: "scale",         parser: parseIntArg },  // 1
	{ name: "tilesPerMap",   parser: parseIntArg },  // 2
	{ name: "verticalScale", parser: parseIntArg },  // 3
	{ name: "settingsBorders" },                     // 4
	{ name: "settingsStateBorders" },                // 5
	{ name: "settingsHighways" },                    // 6
	{ name: "settingsStreets" },                     // 7
	{ name: "settingsSmallStreets" },                // 8
	{ name: "settingsBuildings" },                   // 9
	{ name: "settingsOres" },                        // 10
	{ name: "settingsNetherite" },                   // 11
	{ name: "settingsFarms" },                       // 12
	{ name: "settingsMeadows" },                     // 13
	{ name: "settingsQuarrys" },                     // 14
	{ name: "settingsAerodrome" },                   // 15
	{ name: "settingsMobSpawner" },                  // 16
	{ name: "settingsAnimalSpawner" },               // 17
	{ name: "settingsRivers" },                      // 18
	{ name: "settingsStreams" },                     // 19
	{ name: "settingsVolcanos" },                    // 20
	{ name: "settingsShrubs" },                      // 21
	{ name: "settingsCrops" },                       // 22
	{ name: "settingsMapVersion" },                  // 23
	{ name: "settingsMapOffset" },                   // 24
	{ name: "settingsLowerBuildLimit", parser: parseIntArg }, // 25
	{ name: "settingsUpperBuildLimit", parser: parseIntArg }, // 26
	{ name: "settingsVanillaPopulation" },           // 27
	{ name: "biomeSource" },                         // 28
	{ name: "oreModifier" },                         // 29
	{ name: "mod_BOP" },                             // 30
	{ name: "mod_BYG" },                             // 31
	{ name: "mod_Terralith" },                       // 32
	{ name: "mod_williamWythers" },                  // 33
	{ name: "mod_Create" }                           // 34
];

var staticArgs = {};
for (var i = 0; i < STATIC_ARG_SPEC.length; i += 1) {
	var spec = STATIC_ARG_SPEC[i];
	var raw = arguments[i];
	staticArgs[spec.name] = (typeof spec.parser === "function")
		? spec.parser(raw)
		: raw;
}

// -------------------------------------------------------------------
// 2. I/O setup
// -------------------------------------------------------------------

var stdout = new java.io.PrintStream(java.lang.System.out, true, "UTF-8");
var stdin  = new java.io.BufferedReader(
	new java.io.InputStreamReader(java.lang.System.in, "UTF-8"));

// Divert wpscript.js print() / WP log lines to stderr.
java.lang.System.setOut(java.lang.System.err);

// -------------------------------------------------------------------
// 3. Per-tile execution via load() in the parent engine
//
//    We save the current global-property snapshot before each tile,
//    update tile-specific globals (directionLatitude, latitude, …),
//    load() wpscript.js (which executes inline), then delete any
//    properties that the script added and restore overwritten ones.
//    This keeps the engine clean without needing a child scope.
// -------------------------------------------------------------------

var scriptPath = staticArgs.path + "/wpscript.js";

// Build the full arguments array matching wpscript.js STARTUP_ARGUMENTS.
function buildFullArgs(stArgs, msg) {
	return [
		stArgs.path,
		String(msg.dir_lat),
		parseInt(msg.lat, 10),
		String(msg.dir_lon),
		parseInt(msg.lon, 10),
		stArgs.scale,
		stArgs.tilesPerMap,
		stArgs.verticalScale,
		stArgs.settingsBorders,
		stArgs.settingsStateBorders,
		stArgs.settingsHighways,
		stArgs.settingsStreets,
		stArgs.settingsSmallStreets,
		stArgs.settingsBuildings,
		stArgs.settingsOres,
		stArgs.settingsNetherite,
		stArgs.settingsFarms,
		stArgs.settingsMeadows,
		stArgs.settingsQuarrys,
		stArgs.settingsAerodrome,
		stArgs.settingsMobSpawner,
		stArgs.settingsAnimalSpawner,
		stArgs.settingsRivers,
		stArgs.settingsStreams,
		stArgs.settingsVolcanos,
		stArgs.settingsShrubs,
		stArgs.settingsCrops,
		stArgs.settingsMapVersion,
		stArgs.settingsMapOffset,
		stArgs.settingsLowerBuildLimit,
		stArgs.settingsUpperBuildLimit,
		stArgs.settingsVanillaPopulation,
		String(msg.tile),       // heightmapName
		stArgs.biomeSource,
		stArgs.oreModifier,
		stArgs.mod_BOP,
		stArgs.mod_BYG,
		stArgs.mod_Terralith,
		stArgs.mod_williamWythers,
		stArgs.mod_Create
	];
}

function runTile(msg) {
	var fullArgs = buildFullArgs(staticArgs, msg);

	// Save a snapshot of current global property names.
	// We only snapshot OWN properties (not inherited) to keep it fast.
	var saved = {};
	var beforeKeys = Object.getOwnPropertyNames(this);
	for (var k = 0; k < beforeKeys.length; k += 1) {
		var key = beforeKeys[k];
		saved[key] = this[key];
	}

	// Inject tile-specific arguments as global variables.
	// wpscript.js reads these via GLOBAL_CONTEXT[name] (assigned by
	// the assignStartupArguments IIFE).
	var specOrder = [
		"path", "directionLatitude", "latitude", "directionLongitute",
		"longitute", "scale", "tilesPerMap", "verticalScale",
		"settingsBorders", "settingsStateBorders", "settingsHighways",
		"settingsStreets", "settingsSmallStreets", "settingsBuildings",
		"settingsOres", "settingsNetherite", "settingsFarms",
		"settingsMeadows", "settingsQuarrys", "settingsAerodrome",
		"settingsMobSpawner", "settingsAnimalSpawner",
		"settingsRivers", "settingsStreams", "settingsVolcanos",
		"settingsShrubs", "settingsCrops", "settingsMapVersion",
		"settingsMapOffset", "settingsLowerBuildLimit",
		"settingsUpperBuildLimit", "settingsVanillaPopulation",
		"heightmapName", "biomeSource", "oreModifier",
		"mod_BOP", "mod_BYG", "mod_Terralith",
		"mod_williamWythers", "mod_Create"
	];
	for (var j = 0; j < specOrder.length; j += 1) {
		this[specOrder[j]] = fullArgs[j];
	}

	// Also provide `arguments` as a JS array for wpscript.js compatibility.
	this["arguments"] = fullArgs;

	// Execute wpscript.js via Nashorn's load().  This uses the parent
	// global scope so `wp` and all built-ins are directly available.
	load(scriptPath);

	// Cleanup: delete properties added by the script and restore
	// overwritten ones.
	var afterKeys = Object.getOwnPropertyNames(this);
	for (var m = 0; m < afterKeys.length; m += 1) {
		var key2 = afterKeys[m];
		if (key2 in saved) {
			// Restore original value
			this[key2] = saved[key2];
		} else {
			// Delete if not in saved snapshot (added by wpscript.js)
			// Skip built-in / internal properties
			if (key2 === "arguments" || key2 === "wp" ||
			    key2 === "GLOBAL_CONTEXT") {
				continue;
			}
			try { delete this[key2]; } catch (e) { /* non-configurable */ }
		}
	}
}

// -------------------------------------------------------------------
// 4. Main loop
// -------------------------------------------------------------------

stdout.println(JSON.stringify({ status: "ready" }));

var line;
while ((line = stdin.readLine()) !== null) {
	line = String(line).trim();
	if (line.length === 0) continue;

	var msg;
	try { msg = JSON.parse(line); }
	catch (e) {
		java.lang.System.err.println("[wp_daemon_driver] bad JSON: " + line);
		continue;
	}

	if (msg.command === "shutdown") {
		stdout.println(JSON.stringify({ status: "shutdown" }));
		break;
	}

	var tileName = String(msg.tile || "unknown");
	try {
		var origCwd = java.lang.System.getProperty("user.dir");
		java.lang.System.setProperty("user.dir", staticArgs.path);

		runTile(msg);

		java.lang.System.setProperty("user.dir", origCwd);
		stdout.println(JSON.stringify({ status: "done", tile: tileName }));
	} catch (tileErr) {
		try { java.lang.System.setProperty("user.dir", origCwd); } catch (e) {}
		var sw = new java.io.StringWriter();
		tileErr.printStackTrace(new java.io.PrintWriter(sw));
		java.lang.System.err.println("[wp_daemon_driver] ERROR tile=" + tileName + " : " + sw);
		stdout.println(JSON.stringify({
			status: "error",
			tile: tileName,
			message: String(tileErr)
		}));
	}
}
