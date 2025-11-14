//borders
if (settingsBorders === "True") {

	heightMap(borderImage)
		.withFilter(noWaterFilter)
		.applyToLayer(borderLayer)
		.fromLevels(0, 254).toLevel(1)
		.go();
	//remove border on water / wetland
	heightMap(waterImage)
		.applyToLayer(borderLayer)
		.fromLevels(0, 230).toLevel(0)
		.go();
	heightMap(riverImage)
		.applyToLayer(borderLayer)
		.withFilter(noWaterFilterForRivers)
		.fromLevels(0, 230).toLevel(0)
		.go();
	heightMap(wetImage)
		.applyToLayer(borderLayer)
		.fromColour(0, 127, 127).toLevel(0)
		.fromColour(0, 127, 0).toLevel(0)
		.go();

	//remove border from oceans
	heightMap(bathymetryImage)
		.applyToLayer(borderLayer)
		.fromLevels(0, 254).toLevel(0)
		.go();

	//remove border from streets
	heightMap(road)
		.applyToLayer(borderLayer)
		.fromColour(0, 0, 0).toLevel(0)
		.fromColour(200, 200, 200).toLevel(0)
		.go();
	//remove other layers from border
	heightMap(borderImage)
		.applyToLayer(farmDirtLayer)
		.fromLevels(0, 254).toLevel(0)
		.go();
	heightMap(borderImage)
		.applyToLayer(farmWheatLayer)
		.fromLevels(0, 254).toLevel(0)
		.go();
	heightMap(borderImage)
		.applyToLayer(farmPotatoesLayer)
		.fromLevels(0, 254).toLevel(0)
		.go();
	heightMap(borderImage)
		.applyToLayer(farmCarrotsLayer)
		.fromLevels(0, 254).toLevel(0)
		.go();
	heightMap(borderImage)
		.applyToLayer(farmBeetrootLayer)
		.fromLevels(0, 254).toLevel(0)
		.go();

}

