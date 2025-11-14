//steep mountains (after vegetation)
if (true) {

	if (new java.io.File(path + 'image_exports/' + tile + '/heightmap/' + tile + '_slope.png').isFile()) {
		var slope = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/heightmap/' + tile + '_slope.png').go();
		heightMap(slope)
			.applyToTerrain()
			.fromLevels(20500, 65535).toTerrain(9) //mesa
			.go();
	} else {
		var slope = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_slope.png').go();
		heightMap(slope)
			.applyToTerrain()
			.fromLevels(80, 255).toTerrain(9) //mesa
			.go();
	}

	wp.applyLayer(mixedLayer).toWorld(world).withFilter(mesaFilter).toLevel(0).go();
	wp.applyLayer(acaciaLayer).toWorld(world).withFilter(mesaFilter).toLevel(0).go();
	wp.applyLayer(shrubsLayer).toWorld(world).withFilter(mesaFilter).toLevel(0).go();
	wp.applyLayer(shrubsLayerWithCactuses).toWorld(world).withFilter(mesaFilter).toLevel(0).go();
	wp.applyLayer(herbsLayer).toWorld(world).withFilter(mesaFilter).toLevel(0).go();
	wp.applyLayer(spruceLayer).toWorld(world).withFilter(mesaFilter).toLevel(0).go();
	wp.applyLayer(deciduousLayer).toWorld(world).withFilter(mesaFilter).toLevel(0).go();
	wp.applyLayer(evergreenLayer).toWorld(world).withFilter(mesaFilter).toLevel(0).go();
	wp.applyLayer(smallTreeEvergreenLayer).toWorld(world).withFilter(mesaFilter).toLevel(0).go();

	//define different steep terrain for different biomes
	heightMap(climateImage)
		.withFilter(mesaFilter)
		.applyToTerrain()
		.fromColour(0, 0, 255).toLevel(49) //Af - jungle_edge 0000FF 
		.fromColour(0, 120, 255).toLevel(49) //Am - jungle_edge 0078FF
		.fromColour(70, 170, 250).toLevel(28) //Aw - savannah 46AAFA
		.fromColour(255, 0, 0).toLevel(9) //BWh - desert FF0000
		.fromColour(255, 150, 150).toLevel(9) //BWk - desert FF9696
		.fromColour(245, 165, 0).toLevel(28) //BSh - savannah F5A500
		.fromColour(255, 220, 100).toLevel(9) //BSk - desert FFDC64
		.fromColour(255, 255, 0).toLevel(28) //Csa - plains FFFF00
		.fromColour(200, 200, 0).toLevel(28) //Csb - plains C8C800
		.fromColour(150, 255, 150).toLevel(28) //Cwa - plains 96FF96
		.fromColour(100, 200, 100).toLevel(28) //Cwb - plains 64C864
		.fromColour(50, 150, 50).toLevel(28) //Cwc - plains 329632
		.fromColour(200, 255, 80).toLevel(28) //Cfa - plains C8FF50
		.fromColour(100, 255, 80).toLevel(28) //Cfb - plains 64FF50
		.fromColour(50, 200, 0).toLevel(28) //Cfc - plains 32C800
		.fromColour(255, 0, 255).toLevel(28) //Dsa - plains FF00FF
		.fromColour(200, 0, 200).toLevel(9) //Dsb - plains C800C8
		.fromColour(150, 50, 150).toLevel(28) //Dsc - plains 963296
		.fromColour(150, 100, 150).toLevel(28) //Dsd - plains 966496
		.fromColour(170, 175, 255).toLevel(28) //Dwa - taiga AAAFFF
		.fromColour(90, 120, 220).toLevel(28) //Dwb - taiga 5A78DC
		.fromColour(75, 80, 180).toLevel(28) //Dwc - taiga 4B50B4
		.fromColour(50, 0, 135).toLevel(28) //Dwd - taiga 320087
		.fromColour(0, 255, 255).toLevel(28) //Dfa - plains 00FFFF
		.fromColour(55, 200, 255).toLevel(28) //Dfb - plains 37C8FF
		.fromColour(0, 125, 125).toLevel(28) //Dfc - taiga 007D7D
		.fromColour(0, 70, 95).toLevel(28) //Dfd - taiga 00465F
		.fromColour(178, 178, 178).toLevel(28) //ET - snowy_tundra B2B2B2
		.fromColour(102, 102, 102).toLevel(28) //EF - snowy_tundra 666666
		.fromColour(255, 255, 255).toLevel(28) //Beach, gets later replaced by ocean 000000
		.go();

}

