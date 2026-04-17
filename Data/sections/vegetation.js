// vegetation
// Requires: lib/utils.js (applyDensityMappingToLayer, loadTileImage)
if (settingsVanillaPopulation === "False") {

	var plainsFilter = wp.createFilter()
		.onlyOnLayer(plainsLayer)
		.go();

	var desertFilter = wp.createFilter()
		.onlyOnLayer(desertLayer)
		.go();

	var savannahFilter = wp.createFilter()
		.onlyOnLayer(savannahLayer)
		.go();

	var tundraFilter = wp.createFilter()
		.onlyOnLayer(tundraLayer)
		.go();

	var jungleFilter = wp.createFilter()
		.onlyOnLayer(jungleLayer)
		.go();

	if (settingsBuildings === "True") {
		heightMap(landuse)
			.applyToTerrain()
			.fromColour(255, 0, 0).toTerrain(48) //cobblestone
			.go();
	}

	// --- Spruce / Pine trees ---
	var spruceImage = loadTileImage('pine');
	applyDensityMappingToLayer(spruceImage, spruceLayer, null);
	heightMap(landuse)
		.applyToLayer(spruceLayer)
		.fromColour(127, 31, 0).toLevel(15)
		.go();

	// --- Deciduous trees ---
	var deciduousImage = loadTileImage('deciduous');
	applyDensityMappingToLayer(deciduousImage, deciduousLayer, null);
	heightMap(landuse)
		.applyToLayer(deciduousLayer)
		.fromColour(127, 63, 0).toLevel(15)
		.go();

	// --- Jungle / Evergreen trees ---
	var jungleImage = loadTileImage('jungle');
	// Non-jungle zones: apply all density to small trees first
	applyDensityMappingToLayer(jungleImage, smallTreeEvergreenLayer, null);

	wp.applyLayer(smallTreeEvergreenLayer)
		.toWorld(world)
		.withFilter(jungleFilter)
		.toLevel(0)
		.go();

	// Jungle zones get full evergreen density
	applyDensityMappingToLayer(jungleImage, evergreenLayer, jungleFilter);

	// --- Mixed / Acacia vegetation ---
	var mixedImage = loadTileImage('mixed');

	// Savannah and desert get acacia
	applyDensityMappingToLayer(mixedImage, acaciaLayer, savannahFilter);
	heightMap(landuse)
		.withFilter(savannahFilter)
		.applyToLayer(acaciaLayer)
		.fromColour(127, 127, 0).toLevel(15)
		.go();

	applyDensityMappingToLayer(mixedImage, acaciaLayer, desertFilter);
	heightMap(landuse)
		.withFilter(desertFilter)
		.applyToLayer(acaciaLayer)
		.fromColour(127, 127, 0).toLevel(15)
		.go();

	// Plains and tundra get mixed layer
	applyDensityMappingToLayer(mixedImage, mixedLayer, plainsFilter);
	heightMap(landuse)
		.withFilter(plainsFilter)
		.applyToLayer(mixedLayer)
		.fromColour(127, 127, 0).toLevel(15)
		.go();

	applyDensityMappingToLayer(mixedImage, mixedLayer, tundraFilter);
	heightMap(landuse)
		.withFilter(tundraFilter)
		.applyToLayer(mixedLayer)
		.fromColour(127, 127, 0).toLevel(15)
		.go();

	//remove acacia on cold biomes
	heightMap(climateImage)
		.applyToLayer(acaciaLayer)
		.fromColour(200, 255, 80).toLevel(0) //Cfa - plains C8FF50
		.fromColour(100, 255, 80).toLevel(0) //Cfb - plains 64FF50
		.fromColour(50, 200, 0).toLevel(0) //Cfc - plains 32C800
		.fromColour(255, 0, 255).toLevel(0) //Dsa - plains FF00FF
		.fromColour(200, 0, 200).toLevel(0) //Dsb - plains C800C8
		.fromColour(150, 50, 150).toLevel(0) //Dsc - plains 963296
		.fromColour(150, 100, 150).toLevel(0) //Dsd - plains 966496
		.fromColour(170, 175, 255).toLevel(0) //Dwa - taiga AAAFFF
		.fromColour(90, 120, 220).toLevel(0) //Dwb - taiga 5A78DC
		.fromColour(75, 80, 180).toLevel(0) //Dwc - taiga 4B50B4
		.fromColour(50, 0, 135).toLevel(0) //Dwd - taiga 320087
		.fromColour(0, 255, 255).toLevel(0) //Dfa - plains 00FFFF
		.fromColour(55, 200, 255).toLevel(0) //Dfb - plains 37C8FF
		.fromColour(0, 125, 125).toLevel(0) //Dfc - taiga 007D7D
		.fromColour(0, 70, 95).toLevel(0) //Dfd - taiga 00465F
		.fromColour(178, 178, 178).toLevel(0) //ET - snowy_tundra B2B2B2
		.fromColour(102, 102, 102).toLevel(0) //EF - snowy_tundra 666666
		.fromColour(255, 255, 255).toLevel(0) //Beach, gets later replaced by ocean 000000
		.go();

	//remove mixed on warm biomes
	heightMap(climateImage)
		.applyToLayer(mixedLayer)
		.fromColour(0, 0, 255).toLevel(0) //Af - jungle_edge 0000FF
		.fromColour(0, 120, 255).toLevel(0) //Am - jungle_edge 0078FF
		.fromColour(70, 170, 250).toLevel(0) //Aw - savannah 46AAFA
		.fromColour(255, 0, 0).toLevel(0) //BWh - desert FF0000
		.fromColour(255, 150, 150).toLevel(0) //BWk - desert FF9696
		.fromColour(245, 165, 0).toLevel(0) //BSh - savannah F5A500
		.fromColour(255, 220, 100).toLevel(0) //BSk - desert FFDC64
		.fromColour(255, 255, 0).toLevel(0) //Csa - plains FFFF00
		.fromColour(200, 200, 0).toLevel(0) //Csb - plains C8C800
		.fromColour(150, 255, 150).toLevel(0) //Cwa - plains 96FF96
		.fromColour(100, 200, 100).toLevel(0) //Cwb - plains 64C864
		.fromColour(50, 150, 50).toLevel(0) //Cwc - plains 329632
		.go();


	if (settingsShrubs === "True") {

		var shrubsImage = loadTileImage('shrubs');

		// Plains shrubs (sparse at low density)
		heightMap(shrubsImage)
			.withFilter(plainsFilter)
			.applyToLayer(shrubsLayer)
			.fromLevels(0, 15).toLevel(0)
			.fromLevels(16, 31).toLevel(0)
			.fromLevels(32, 47).toLevel(0)
			.fromLevels(48, 63).toLevel(0)
			.fromLevels(64, 79).toLevel(2)
			.fromLevels(80, 95).toLevel(4)
			.fromLevels(96, 111).toLevel(6)
			.fromLevels(112, 127).toLevel(7)
			.fromLevels(128, 143).toLevel(8)
			.fromLevels(144, 159).toLevel(9)
			.fromLevels(160, 175).toLevel(10)
			.fromLevels(176, 191).toLevel(11)
			.fromLevels(192, 207).toLevel(12)
			.fromLevels(208, 223).toLevel(13)
			.fromLevels(224, 239).toLevel(14)
			.fromLevels(240, 255).toLevel(15)
			.go();

		// Tundra shrubs (full density mapping)
		applyDensityMappingToLayer(shrubsImage, shrubsLayer, tundraFilter);

		// Desert and savannah get cactus shrubs
		applyDensityMappingToLayer(shrubsImage, shrubsLayerWithCactuses, desertFilter);
		applyDensityMappingToLayer(shrubsImage, shrubsLayerWithCactuses, savannahFilter);

	}


	var herbsImage = loadTileImage('herbs');
	heightMap(herbsImage)
		.applyToLayer(herbsLayer)
		.fromLevels(0, 15).toLevel(0)
		.fromLevels(16, 31).toLevel(1)
		.fromLevels(32, 47).toLevel(1)
		.fromLevels(48, 63).toLevel(1)
		.fromLevels(64, 79).toLevel(1)
		.fromLevels(80, 95).toLevel(2)
		.fromLevels(96, 111).toLevel(2)
		.fromLevels(112, 127).toLevel(2)
		.fromLevels(128, 143).toLevel(2)
		.fromLevels(144, 159).toLevel(2)
		.fromLevels(160, 175).toLevel(3)
		.fromLevels(176, 191).toLevel(3)
		.fromLevels(192, 207).toLevel(3)
		.fromLevels(208, 223).toLevel(3)
		.fromLevels(224, 239).toLevel(3)
		.fromLevels(240, 255).toLevel(4)
		.go();

	if (isVersionAtLeast("1-16")) {

		var witherRoseImage = loadTileImage('wither_rose');
		heightMap(witherRoseImage)
			.applyToLayer(halfetiRose)
			.fromLevels(0, 253).toLevel(1)
			.fromLevels(254, 255).toLevel(0)
			.go();

	}


	print("vegetation created");

}
