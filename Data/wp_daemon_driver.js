"use strict";
// wp_daemon_driver.js — Daemon entry point for WorldPainter scripting.
// Executed once per JVM lifetime by wpscript.  Loops over tile requests
// from stdin.
//
// Uses Nashorn's loadWithNewGlobal() to isolate each tile's execution
// in a fresh global scope.  This correctly records the source URL for
// wpscript.js so that nested load("utils.js") and load("sections/...")
// calls resolve relative to the script's directory.
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
// 3. Build the full arguments array matching wpscript.js STARTUP_ARGUMENTS.
//
//    loadWithNewGlobal(script, arg0, arg1, …) passes the extra arguments
//    as the script's top-level `arguments` array, which wpscript.js's
//    (function(args){…})(arguments) IIFE reads.
//
//    Order: 0:path, 1:dirLat, 2:lat, 3:dirLon, 4:lon,
//           5:scale, 6:tilesPerMap, 7:verticalScale,
//           8-26:settings*, 27:mapVersion, 28:mapOffset,
//           29:lowerLimit, 30:upperLimit, 31:vanillaPop,
//           32:heightmapName, 33:biomeSource, 34:oreModifier,
//           35-39:mod_*
// -------------------------------------------------------------------

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

// -------------------------------------------------------------------
// 4. Per-tile execution via loadWithNewGlobal()
//
//    loadWithNewGlobal creates a fresh Nashorn global whose [[Prototype]]
//    is the current (daemon-driver) global.  This means `wp` (injected
//    by WorldPainter's Java host into the driver's global) is visible
//    inside wpscript.js via prototype inheritance.
//
//    The script path must be canonical (no symlinks) so Nashorn can
//    derive a directory URL for nested load() resolution.
// -------------------------------------------------------------------

var _canonicalScriptPath = null;

function getCanonicalScriptPath() {
	if (_canonicalScriptPath !== null) return _canonicalScriptPath;
	var f = new java.io.File(staticArgs.path + "/wpscript.js");
	_canonicalScriptPath = String(f.getCanonicalPath());
	return _canonicalScriptPath;
}

function runTile(msg) {
	var fullArgs = buildFullArgs(staticArgs, msg);

	// Set user.dir before loadWithNewGlobal so that scripts which use
	// File I/O resolve relative paths correctly.
	var origCwd = java.lang.System.getProperty("user.dir");
	java.lang.System.setProperty("user.dir", staticArgs.path);

	try {
		var argsForLoad = [getCanonicalScriptPath()].concat(fullArgs);
		loadWithNewGlobal.apply(null, argsForLoad);
	} finally {
		java.lang.System.setProperty("user.dir", origCwd);
	}
}

// -------------------------------------------------------------------
// 5. Main loop
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
		runTile(msg);
		stdout.println(JSON.stringify({ status: "done", tile: tileName }));
	} catch (tileErr) {
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
