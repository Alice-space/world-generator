//vegetation
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
		wp.applyHeightMap(landuse)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.applyToTerrain()
			.fromColour(255, 0, 0).toTerrain(48) //cobblestone
			.go();
	}


	var spruceImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_pine.png').go();
	wp.applyHeightMap(spruceImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(spruceLayer)
		.fromLevels(0, 15).toLevel(0)
		.fromLevels(16, 31).toLevel(1)
		.fromLevels(32, 47).toLevel(2)
		.fromLevels(48, 63).toLevel(3)
		.fromLevels(64, 79).toLevel(4)
		.fromLevels(80, 95).toLevel(5)
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

	wp.applyHeightMap(landuse)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(spruceLayer)
		.fromColour(127, 31, 0).toLevel(15)
		.go();

	var deciduousImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_deciduous.png').go();
	wp.applyHeightMap(deciduousImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(deciduousLayer)
		.fromLevels(0, 15).toLevel(0)
		.fromLevels(16, 31).toLevel(1)
		.fromLevels(32, 47).toLevel(2)
		.fromLevels(48, 63).toLevel(3)
		.fromLevels(64, 79).toLevel(4)
		.fromLevels(80, 95).toLevel(5)
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

	wp.applyHeightMap(landuse)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(deciduousLayer)
		.fromColour(127, 63, 0).toLevel(15)
		.go();

	var jungleImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_jungle.png').go();
	wp.applyHeightMap(jungleImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(smallTreeEvergreenLayer)
		.fromLevels(0, 15).toLevel(0)
		.fromLevels(16, 31).toLevel(1)
		.fromLevels(32, 47).toLevel(2)
		.fromLevels(48, 63).toLevel(3)
		.fromLevels(64, 79).toLevel(4)
		.fromLevels(80, 95).toLevel(5)
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

	wp.applyLayer(smallTreeEvergreenLayer)
		.toWorld(world)
		.withFilter(jungleFilter)
		.toLevel(0)
		.go();

	wp.applyHeightMap(jungleImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(jungleFilter)
		.applyToLayer(evergreenLayer)
		.fromLevels(0, 15).toLevel(0)
		.fromLevels(16, 31).toLevel(1)
		.fromLevels(32, 47).toLevel(2)
		.fromLevels(48, 63).toLevel(3)
		.fromLevels(64, 79).toLevel(4)
		.fromLevels(80, 95).toLevel(5)
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

	var mixedImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_mixed.png').go();

	wp.applyHeightMap(mixedImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(savannahFilter)
		.applyToLayer(acaciaLayer)
		.fromLevels(0, 15).toLevel(0)
		.fromLevels(16, 31).toLevel(1)
		.fromLevels(32, 47).toLevel(2)
		.fromLevels(48, 63).toLevel(3)
		.fromLevels(64, 79).toLevel(4)
		.fromLevels(80, 95).toLevel(5)
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

	wp.applyHeightMap(landuse)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(savannahFilter)
		.applyToLayer(acaciaLayer)
		.fromColour(127, 127, 0).toLevel(15)
		.go();

	wp.applyHeightMap(mixedImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(desertFilter)
		.applyToLayer(acaciaLayer)
		.fromLevels(0, 15).toLevel(0)
		.fromLevels(16, 31).toLevel(1)
		.fromLevels(32, 47).toLevel(2)
		.fromLevels(48, 63).toLevel(3)
		.fromLevels(64, 79).toLevel(4)
		.fromLevels(80, 95).toLevel(5)
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

	wp.applyHeightMap(landuse)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(desertFilter)
		.applyToLayer(acaciaLayer)
		.fromColour(127, 127, 0).toLevel(15)
		.go();

	wp.applyHeightMap(mixedImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(plainsFilter)
		.applyToLayer(mixedLayer)
		.fromLevels(0, 15).toLevel(0)
		.fromLevels(16, 31).toLevel(1)
		.fromLevels(32, 47).toLevel(2)
		.fromLevels(48, 63).toLevel(3)
		.fromLevels(64, 79).toLevel(4)
		.fromLevels(80, 95).toLevel(5)
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

	wp.applyHeightMap(landuse)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(plainsFilter)
		.applyToLayer(mixedLayer)
		.fromColour(127, 127, 0).toLevel(15)
		.go();

	wp.applyHeightMap(mixedImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(tundraFilter)
		.applyToLayer(mixedLayer)
		.fromLevels(0, 15).toLevel(0)
		.fromLevels(16, 31).toLevel(1)
		.fromLevels(32, 47).toLevel(2)
		.fromLevels(48, 63).toLevel(3)
		.fromLevels(64, 79).toLevel(4)
		.fromLevels(80, 95).toLevel(5)
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

	wp.applyHeightMap(landuse)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(tundraFilter)
		.applyToLayer(mixedLayer)
		.fromColour(127, 127, 0).toLevel(15)
		.go();

	//remove arcacia on cold biomes
	wp.applyHeightMap(climateImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
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
	wp.applyHeightMap(climateImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
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

		var shrubsImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_shrubs.png').go();
		wp.applyHeightMap(shrubsImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
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

		wp.applyHeightMap(shrubsImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.withFilter(tundraFilter)
			.applyToLayer(shrubsLayer)
			.fromLevels(0, 15).toLevel(0)
			.fromLevels(16, 31).toLevel(1)
			.fromLevels(32, 47).toLevel(2)
			.fromLevels(48, 63).toLevel(3)
			.fromLevels(64, 79).toLevel(4)
			.fromLevels(80, 95).toLevel(5)
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

		wp.applyHeightMap(shrubsImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.withFilter(desertFilter)
			.applyToLayer(shrubsLayerWithCactuses)
			.fromLevels(0, 15).toLevel(0)
			.fromLevels(16, 31).toLevel(1)
			.fromLevels(32, 47).toLevel(2)
			.fromLevels(48, 63).toLevel(3)
			.fromLevels(64, 79).toLevel(4)
			.fromLevels(80, 95).toLevel(5)
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

		wp.applyHeightMap(shrubsImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.withFilter(savannahFilter)
			.applyToLayer(shrubsLayerWithCactuses)
			.fromLevels(0, 15).toLevel(0)
			.fromLevels(16, 31).toLevel(1)
			.fromLevels(32, 47).toLevel(2)
			.fromLevels(48, 63).toLevel(3)
			.fromLevels(64, 79).toLevel(4)
			.fromLevels(80, 95).toLevel(5)
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

	}


	var herbsImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_herbs.png').go();
	wp.applyHeightMap(herbsImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
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

		var witherRoseImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_wither_rose.png').go();
		wp.applyHeightMap(witherRoseImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.applyToLayer(halfetiRose)
			.fromLevels(0, 253).toLevel(1)
			.fromLevels(254, 255).toLevel(0)
			.go();

	}


	print("vegetation created");

}

