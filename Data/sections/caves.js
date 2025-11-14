//caves
if (true) {

	wp.applyLayer(cavesLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(7)
		.go();

	wp.applyLayer(cavernsLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(7)
		.go();

	wp.applyLayer(chasmsLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(7)
		.go();

	if (isVersionAtLeast("1-17")) {

		wp.applyLayer(amethystGeodesLayer)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

	}

}

