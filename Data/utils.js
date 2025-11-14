"use strict";

// Shared helper utilities for WorldPainter scripting. Loaded via load("utils.js").
var VERSION_SEQUENCE = ["1-12", "1-16", "1-17", "1-18", "1-19", "1-20"]; // ordered for comparisons
var EXTENDED_SCALE_VALUES = [5, 10, 15, 20, 25, 30];

function versionIndex(version) {
	for (var i = 0; i < VERSION_SEQUENCE.length; i += 1) {
		if (VERSION_SEQUENCE[i] === version) {
			return i;
		}
	}
	return -1;
}

function isVersionAtLeast(version) {
	var current = versionIndex(settingsMapVersion);
	var target = versionIndex(version);
	return current !== -1 && target !== -1 && current >= target;
}

function isVersionAtMost(version) {
	var current = versionIndex(settingsMapVersion);
	var target = versionIndex(version);
	return current !== -1 && target !== -1 && current <= target;
}

function isVersionBetween(minVersion, maxVersion) {
	return isVersionAtLeast(minVersion) && isVersionAtMost(maxVersion);
}

function isVersionOneOf(versions) {
	for (var i = 0; i < versions.length; i += 1) {
		if (settingsMapVersion === versions[i]) {
			return true;
		}
	}
	return false;
}

function loadLayerFromFile(relativePath) {
	return wp.getLayer().fromFile(path + relativePath).go();
}

function loadNamedLayer(name) {
	return wp.getLayer().withName(name).go();
}

function cropsEnabled() {
	return String(settingsCrops).toLowerCase() !== "false";
}

function loadCropSensitiveLayer(enabledPath, disabledPath) {
	return cropsEnabled() ? loadLayerFromFile(enabledPath) : loadLayerFromFile(disabledPath);
}

var VERTICAL_SCALE_CONFIG = {
	"1000": { legacy: [61, 71] },
	"500": { legacy: [60, 80] },
	"300": { legacy: [58, 91] },
	"200": { legacy: [56, 106] },
	"100": { legacy: [50, 150] },
	"75": { legacy: [47, 180] },
	"50": { legacy: [39, 239] },
	"35": { legacy: [39, 239], modern: [29, 315], modernMinVersion: "1-18" },
	"30": { legacy: [39, 239], modern: [24, 357], modernMinVersion: "1-18" },
	"25": { legacy: [39, 239], modern: [16, 416], modernMinVersion: "1-18" },
	"20": { legacy: [39, 239], modern: [4, 504], modernMinVersion: "1-18" },
	"15": { legacy: [39, 239], modern: [-15, 652], modernMinVersion: "1-18" },
	"10": { legacy: [39, 239], modern: [-53, 947], modernMinVersion: "1-18" },
	"5": { legacy: [39, 239], modern: [-168, 1832], modernMinVersion: "1-18" }
};

function getLevelRangeForScale(scale) {
	var config = VERTICAL_SCALE_CONFIG[String(scale)];
	if (!config) {
		return null;
	}
	if (config.modern && isVersionAtLeast(config.modernMinVersion || "1-18")) {
		return config.modern;
	}
	return config.legacy;
}

function buildWorldFromHeightmap(options) {
	return wp.createWorld()
		.fromHeightMap(options.heightMap)
		.shift(options.shiftLongitute, options.shiftLatitude)
		.fromLevels(0, 65535).toLevels(options.levelRange[0], options.levelRange[1])
		.withMapFormat(options.mapFormat)
		.go();
}

function createWorldForScale(scale, options) {
	var levelRange = getLevelRangeForScale(scale);
	if (!levelRange) {
		throw new Error("Unsupported vertical scale: " + scale);
	}
	var fullOptions = {
		heightMap: options.heightMap,
		shiftLongitute: options.shiftLongitute,
		shiftLatitude: options.shiftLatitude,
		mapFormat: options.mapFormat,
		levelRange: levelRange
	};
	return buildWorldFromHeightmap(fullOptions);
}

var BATHYMETRY_SCALE_MAP = {
	"300": 0.2,
	"200": 0.3,
	"100": 0.4,
	"75": 0.5,
	"50": 0.6,
	"35": 0.7,
	"25": 0.8,
	"10": 0.9,
	"5": 1.0
};

function getBathymetryScaleFor(scale) {
	var value = BATHYMETRY_SCALE_MAP[String(scale)];
	return typeof value === "number" ? value : 1.0;
}

function requiresExtendedHeightLimit(scale, tilesPerMapValue) {
	if (tilesPerMapValue !== 1) {
		return false;
	}
	for (var i = 0; i < EXTENDED_SCALE_VALUES.length; i += 1) {
		if (EXTENDED_SCALE_VALUES[i] === scale) {
			return isVersionAtLeast("1-18");
		}
	}
	return false;
}

function resolvePlatformWorld(scale, tilesPerMapValue) {
	var useExtended = requiresExtendedHeightLimit(scale, tilesPerMapValue);
	if (settingsMapVersion === "1-12") {
		return 'wpscript/1-12.world';
	}
	if (settingsMapVersion === "1-16") {
		return 'wpscript/1-16.world';
	}
	if (settingsMapVersion === "1-17") {
		return 'wpscript/1-17.world';
	}
	if (settingsMapVersion === "1-18") {
		return useExtended ? 'wpscript/1-18-ex.world' : 'wpscript/1-18.world';
	}
	if (settingsMapVersion === "1-19" || settingsMapVersion === "1-20") {
		return useExtended ? 'wpscript/1-19-ex.world' : 'wpscript/1-19.world';
	}
	return 'wpscript/1-12.world';
}

function resolveGameTypeWorld(scale, tilesPerMapValue) {
	if (settingsMapVersion === "1-12") {
		return 'wpscript/1-12.world';
	}
	if (settingsMapVersion === "1-16") {
		return 'wpscript/1-16.world';
	}
	if (settingsMapVersion === "1-17") {
		return 'wpscript/1-17.world';
	}
	if (requiresExtendedHeightLimit(scale, tilesPerMapValue)) {
		return 'wpscript/1-18-ex.world';
	}
	if (isVersionAtLeast("1-18")) {
		return 'wpscript/1-18.world';
	}
	return 'wpscript/1-12.world';
}

function loadWorldTemplate(relativePath) {
	return wp.getWorld().fromFile(path + relativePath).go();
}

function copyGameTypeFromTemplate(world, scale, tilesPerMapValue) {
	var template = loadWorldTemplate(resolveGameTypeWorld(scale, tilesPerMapValue));
	world.setGameType(template.getGameType());
}
