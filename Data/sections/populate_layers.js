//1.12 & 1.18+ populate layer
if (settingsVanillaPopulation === "True" && (settingsMapVersion === "1-12" || isVersionAtLeast("1-18"))) {

	wp.applyLayer(populateLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(1)
		.go();

}

