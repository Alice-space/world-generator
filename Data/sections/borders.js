//borders
if (settingsBorders === "True") {

	wp.applyHeightMap(borderImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(noWaterFilter)
		.applyToLayer(borderLayer)
		.fromLevels(0, 254).toLevel(1)
		.go();
	//remove border on water / wetland
	wp.applyHeightMap(waterImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(borderLayer)
		.fromLevels(0, 230).toLevel(0)
		.go();
	wp.applyHeightMap(riverImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(borderLayer)
		.withFilter(noWaterFilterForRivers)
		.fromLevels(0, 230).toLevel(0)
		.go();
	wp.applyHeightMap(wetImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(borderLayer)
		.fromColour(0, 127, 127).toLevel(0)
		.fromColour(0, 127, 0).toLevel(0)
		.go();

	//remove border from oceans
	wp.applyHeightMap(bathymetryImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(borderLayer)
		.fromLevels(0, 254).toLevel(0)
		.go();

	//remove border from streets
	wp.applyHeightMap(road)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(borderLayer)
		.fromColour(0, 0, 0).toLevel(0)
		.fromColour(200, 200, 200).toLevel(0)
		.go();
	//remove other layers from border
	wp.applyHeightMap(borderImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(farmDirtLayer)
		.fromLevels(0, 254).toLevel(0)
		.go();
	wp.applyHeightMap(borderImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(farmWheatLayer)
		.fromLevels(0, 254).toLevel(0)
		.go();
	wp.applyHeightMap(borderImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(farmPotatoesLayer)
		.fromLevels(0, 254).toLevel(0)
		.go();
	wp.applyHeightMap(borderImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(farmCarrotsLayer)
		.fromLevels(0, 254).toLevel(0)
		.go();
	wp.applyHeightMap(borderImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(farmBeetrootLayer)
		.fromLevels(0, 254).toLevel(0)
		.go();

}

