"use strict";
// wp_daemon_driver.js — Daemon entry point for WorldPainter scripting
// Executed once per JVM lifetime by wpscript. Loops over tile requests from stdin.
//
// Static config is passed as positional CLI arguments (same as wpscript.js
// minus the 5 tile-specific args: directionLatitude, latitude,
// directionLongitute, longitute, heightmapName).
//
// Per-tile args arrive as NDJSON on stdin:
//   {"tile": "N48E008", "dir_lat": "N", "lat": 48, "dir_lon": "E", "lon": 8}
//
// Responses are written as NDJSON to stdout:
//   {"status": "ready"}
//   {"status": "done", "tile": "N48E008"}
//   {"status": "error", "tile": "N48E008", "message": "..."}
//   {"status": "shutdown"}

// ---------------------------------------------------------------------------
// 1. Parse static CLI arguments
// ---------------------------------------------------------------------------

function parseIntArg(value) {
	return parseInt(value, 10);
}

// Static argument spec — same as wpscript.js STARTUP_ARGUMENTS but with
// tile-specific entries (indices 1–4 and 33) removed and replaced by their
// daemon-driver counterparts received via stdin.
var STATIC_ARG_SPEC = [
	{ name: "path" },                            // 0
	// (directionLatitude  — tile-specific, comes from stdin)
	// (latitude           — tile-specific, comes from stdin)
	// (directionLongitute — tile-specific, comes from stdin)
	// (longitute          — tile-specific, comes from stdin)
	{ name: "scale",         parser: parseIntArg }, // 1
	{ name: "tilesPerMap",   parser: parseIntArg }, // 2
	{ name: "verticalScale", parser: parseIntArg }, // 3

	{ name: "settingsBorders" },                 // 4
	{ name: "settingsStateBorders" },            // 5
	{ name: "settingsHighways" },                // 6
	{ name: "settingsStreets" },                 // 7
	{ name: "settingsSmallStreets" },            // 8
	{ name: "settingsBuildings" },               // 9
	{ name: "settingsOres" },                    // 10
	{ name: "settingsNetherite" },               // 11
	{ name: "settingsFarms" },                   // 12
	{ name: "settingsMeadows" },                 // 13
	{ name: "settingsQuarrys" },                 // 14
	{ name: "settingsAerodrome" },               // 15
	{ name: "settingsMobSpawner" },              // 16
	{ name: "settingsAnimalSpawner" },           // 17
	{ name: "settingsRivers" },                  // 18
	{ name: "settingsStreams" },                  // 19
	{ name: "settingsVolcanos" },                // 20
	{ name: "settingsShrubs" },                  // 21
	{ name: "settingsCrops" },                   // 22
	{ name: "settingsMapVersion" },              // 23
	{ name: "settingsMapOffset" },               // 24
	{ name: "settingsLowerBuildLimit", parser: parseIntArg }, // 25
	{ name: "settingsUpperBuildLimit", parser: parseIntArg }, // 26
	{ name: "settingsVanillaPopulation" },       // 27
	// (heightmapName — tile-specific, comes from stdin as msg.tile)
	{ name: "biomeSource" },                     // 28
	{ name: "oreModifier" },                     // 29
	{ name: "mod_BOP" },                         // 30
	{ name: "mod_BYG" },                         // 31
	{ name: "mod_Terralith" },                   // 32
	{ name: "mod_williamWythers" },              // 33
	{ name: "mod_Create" }                       // 34
];

var staticArgs = {};
for (var i = 0; i < STATIC_ARG_SPEC.length; i += 1) {
	var spec = STATIC_ARG_SPEC[i];
	var raw = arguments[i];
	staticArgs[spec.name] = (typeof spec.parser === "function")
		? spec.parser(raw)
		: raw;
}

// ---------------------------------------------------------------------------
// 2. Set up stdout / stdin streams
// ---------------------------------------------------------------------------

var stdout = new java.io.PrintStream(java.lang.System.out, true, "UTF-8");
var stdin  = new java.io.BufferedReader(
	new java.io.InputStreamReader(java.lang.System.in, "UTF-8"));

// Redirect Java's System.out to stderr so that wpscript.js print() calls and
// WP log lines do not pollute the NDJSON protocol on stdout.
java.lang.System.setOut(java.lang.System.err);

// ---------------------------------------------------------------------------
// 3. Initialise Nashorn ScriptEngineManager (once, shared across tiles)
// ---------------------------------------------------------------------------

var ScriptEngineManager = javax.script.ScriptEngineManager;
var manager = new ScriptEngineManager();

// ---------------------------------------------------------------------------
// 4. Helper: inject all globals into a per-tile engine
// ---------------------------------------------------------------------------

function injectGlobals(engine, stArgs, msg) {
	// Tile-specific args (from stdin message)
	engine.put("directionLatitude",  String(msg.dir_lat));
	engine.put("latitude",           parseInt(msg.lat, 10));
	engine.put("directionLongitute", String(msg.dir_lon));
	engine.put("longitute",          parseInt(msg.lon, 10));
	engine.put("heightmapName",      String(msg.tile));

	// Static args
	engine.put("path",                      stArgs.path);
	engine.put("scale",                     stArgs.scale);
	engine.put("tilesPerMap",               stArgs.tilesPerMap);
	engine.put("verticalScale",             stArgs.verticalScale);

	engine.put("settingsBorders",           stArgs.settingsBorders);
	engine.put("settingsStateBorders",      stArgs.settingsStateBorders);
	engine.put("settingsHighways",          stArgs.settingsHighways);
	engine.put("settingsStreets",           stArgs.settingsStreets);
	engine.put("settingsSmallStreets",      stArgs.settingsSmallStreets);
	engine.put("settingsBuildings",         stArgs.settingsBuildings);
	engine.put("settingsOres",              stArgs.settingsOres);
	engine.put("settingsNetherite",         stArgs.settingsNetherite);
	engine.put("settingsFarms",             stArgs.settingsFarms);
	engine.put("settingsMeadows",           stArgs.settingsMeadows);
	engine.put("settingsQuarrys",           stArgs.settingsQuarrys);
	engine.put("settingsAerodrome",         stArgs.settingsAerodrome);
	engine.put("settingsMobSpawner",        stArgs.settingsMobSpawner);
	engine.put("settingsAnimalSpawner",     stArgs.settingsAnimalSpawner);
	engine.put("settingsRivers",            stArgs.settingsRivers);
	engine.put("settingsStreams",           stArgs.settingsStreams);
	engine.put("settingsVolcanos",          stArgs.settingsVolcanos);
	engine.put("settingsShrubs",            stArgs.settingsShrubs);
	engine.put("settingsCrops",             stArgs.settingsCrops);
	engine.put("settingsMapVersion",        stArgs.settingsMapVersion);
	engine.put("settingsMapOffset",         stArgs.settingsMapOffset);
	engine.put("settingsLowerBuildLimit",   stArgs.settingsLowerBuildLimit);
	engine.put("settingsUpperBuildLimit",   stArgs.settingsUpperBuildLimit);
	engine.put("settingsVanillaPopulation", stArgs.settingsVanillaPopulation);
	engine.put("biomeSource",               stArgs.biomeSource);
	engine.put("oreModifier",               stArgs.oreModifier);
	engine.put("mod_BOP",                   stArgs.mod_BOP);
	engine.put("mod_BYG",                   stArgs.mod_BYG);
	engine.put("mod_Terralith",             stArgs.mod_Terralith);
	engine.put("mod_williamWythers",        stArgs.mod_williamWythers);
	engine.put("mod_Create",               stArgs.mod_Create);

	// Forward the WorldPainter `wp` API object from the parent engine context
	// into the child engine so all wp.* calls work as normal.
	engine.put("wp", wp); // `wp` is injected by WP's Java host into this (parent) engine
}

// ---------------------------------------------------------------------------
// 5. Helper: evaluate wpscript.js inside a child engine
//    The existing wpscript.js calls load("utils.js") and
//    load("sections/lib/utils.js") with paths relative to the Data/ dir.
//    Nashorn resolves load() paths relative to user.dir, so we temporarily
//    set user.dir to staticArgs.path while the child engine evaluates.
// ---------------------------------------------------------------------------

function runTileEngine(msg) {
	var engine = manager.getEngineByName("nashorn");

	// Set user.dir so relative load() calls in wpscript.js resolve correctly.
	// NOTE: user.dir is a JVM-global property; this is safe here because the
	// daemon is single-threaded (one tile at a time).
	var origCwd = java.lang.System.getProperty("user.dir");
	java.lang.System.setProperty("user.dir", staticArgs.path);

	try {
		injectGlobals(engine, staticArgs, msg);

		// Evaluate wpscript.js via FileReader so it runs inside the child engine
		// scope. The script's own load("sections/...") calls will resolve
		// relative to the now-set user.dir = staticArgs.path.
		var reader = new java.io.FileReader(staticArgs.path + "/wpscript.js");
		try {
			engine.eval(reader);
		} finally {
			reader.close();
		}
	} finally {
		// Always restore user.dir even if tile fails
		java.lang.System.setProperty("user.dir", origCwd);
	}
}

// ---------------------------------------------------------------------------
// 6. Main loop
// ---------------------------------------------------------------------------

stdout.println(JSON.stringify({ status: "ready" }));

var line;
while ((line = stdin.readLine()) !== null) {
	line = String(line).trim();
	if (line.length === 0) {
		continue; // ignore blank lines
	}

	var msg;
	try {
		msg = JSON.parse(line);
	} catch (parseErr) {
		// Malformed JSON — log to stderr and continue
		java.lang.System.err.println("[wp_daemon_driver] JSON parse error: " + parseErr + " | line: " + line);
		continue;
	}

	// Shutdown command
	if (msg.command === "shutdown") {
		stdout.println(JSON.stringify({ status: "shutdown" }));
		break;
	}

	// Tile request
	var tileName = String(msg.tile || "unknown");
	try {
		runTileEngine(msg);
		stdout.println(JSON.stringify({ status: "done", tile: tileName }));
	} catch (tileErr) {
		var errMsg = String(tileErr);
		java.lang.System.err.println("[wp_daemon_driver] ERROR tile=" + tileName + " : " + errMsg);
		stdout.println(JSON.stringify({
			status: "error",
			tile: tileName,
			message: errMsg
		}));
	}
}
// stdin closed — exit cleanly (JVM will terminate)
