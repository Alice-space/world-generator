//adjust water depht on rivers and lakes
if (settingsRivers === "True") {

	wp.applyHeightMap(waterImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(noWaterFilter)
		.applyToLayer(water1deep)
		.fromLevels(120, 230).toLevel(1)
		.go();

	wp.applyHeightMap(waterImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(noWaterFilter)
		.applyToLayer(water2deep)
		.fromLevels(70, 119).toLevel(1)
		.go();

	wp.applyHeightMap(waterImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(noWaterFilter)
		.applyToLayer(water3deep)
		.fromLevels(30, 69).toLevel(1)
		.go();

	wp.applyHeightMap(waterImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(noWaterFilter)
		.applyToLayer(water4deep)
		.fromLevels(2, 29).toLevel(1)
		.go();

	wp.applyHeightMap(waterImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(noWaterFilter)
		.applyToLayer(water5deep)
		.fromLevels(0, 1).toLevel(1)
		.go();

	wp.applyHeightMap(riverImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(noWaterFilterForRivers)
		.applyToLayer(water1deep)
		.fromLevels(140, 230).toLevel(1)
		.go();

	wp.applyHeightMap(riverImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(water2deep)
		.withFilter(noWaterFilterForRivers)
		.fromLevels(70, 139).toLevel(1)
		.go();

	wp.applyHeightMap(riverImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(water3deep)
		.withFilter(noWaterFilterForRivers)
		.fromLevels(30, 69).toLevel(1)
		.go();

	wp.applyHeightMap(riverImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(water4deep)
		.withFilter(noWaterFilterForRivers)
		.fromLevels(2, 29).toLevel(1)
		.go();

	wp.applyHeightMap(riverImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(water5deep)
		.withFilter(noWaterFilterForRivers)
		.fromLevels(0, 1).toLevel(1)
		.go();
}

if (settingsStreams === "True") {
	wp.applyHeightMap(streamImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(water1deep)
		.fromLevels(0, 254).toLevel(1)
		.go();
}

