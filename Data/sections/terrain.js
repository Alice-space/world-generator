//terrain
if (true) {

	var groundcoverImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_terrain_reduced_colors.png').go();

	//load custom terrain
	heightMap(groundcoverImage)
		.applyToTerrain()

		.fromColour(0, 0, 0).toTerrain(4) //podzol
		.fromColour(20, 20, 20).toTerrain(mudTerrain) //mud
		.fromColour(50, 60, 30).toTerrain(grassTerrain) //grass

		.fromColour(0, 50, 0).toTerrain(grassTerrain) //grass
		.fromColour(75, 85, 60).toTerrain(grassTerrain) //grass
		.fromColour(55, 70, 50).toTerrain(mossTerrain) //grass

		.fromColour(50, 150, 50).toTerrain(grassTerrain) //grass
		.fromColour(50, 200, 50).toTerrain(grassTerrain) //grass
		.fromColour(95, 100, 75).toTerrain(grassTerrain) //grass

		.fromColour(100, 140, 110).toTerrain(grassTerrain) //grass
		.fromColour(140, 150, 110).toTerrain(grassTerrain) //grass
		.fromColour(155, 160, 110).toTerrain(grassTerrain) //grass

		.fromColour(64, 64, 64).toTerrain(28) //stone
		.fromColour(163, 142, 232).toTerrain(44) //mycellium
		.fromColour(192, 192, 192).toTerrain(40) //deep_snow

		.fromColour(100, 80, 50).toTerrain(grassTerrain) //grass
		.fromColour(100, 85, 60).toTerrain(grassTerrain) //grass
		.fromColour(100, 90, 75).toTerrain(grassTerrain) //grass

		.fromColour(255, 255, 220).toTerrain(40) //deep_snow
		.fromColour(255, 200, 128).toTerrain(5) //sand
		.fromColour(255, 200, 64).toTerrain(5) //sand

		.fromColour(255, 255, 190).toTerrain(5) //sand
		.fromColour(230, 205, 160).toTerrain(5) //sand
		.fromColour(167, 146, 103).toTerrain(grassTerrain) //grass

		.fromColour(166, 152, 126).toTerrain(5) //sand
		.fromColour(173, 143, 115).toTerrain(5) //sand
		.fromColour(155, 127, 103).toTerrain(5) //sand

		.fromColour(164, 135, 91).toTerrain(5) //sand
		.fromColour(158, 144, 117).toTerrain(34) //gravel
		.fromColour(149, 134, 103).toTerrain(grassTerrain) //grass

		.fromColour(190, 150, 120).toTerrain(5) //sand
		.fromColour(190, 130, 80).toTerrain(6) //red_sand
		.fromColour(170, 105, 60).toTerrain(6) //red_sand

		.fromColour(255, 0, 0).toTerrain(6) //red_sand
		.fromColour(128, 50, 0).toTerrain(6) //red_sand
		.fromColour(140, 80, 50).toTerrain(3) //permadirt

		.fromColour(255, 255, 255).toTerrain(40) //deep_snow
		.fromColour(110, 150, 170).toTerrain(40) //deep_snow(ocean)
		.fromColour(25, 50, 110).toTerrain(40) //deep_snow(ocean)

		.fromColour(230, 255, 230).toTerrain(40) //deep_snow
		.fromColour(240, 255, 240).toTerrain(40) //deep_snow
		.fromColour(250, 255, 250).toTerrain(40) //deep_snow

		.go();

	groundcoverImage = null;

	//deep_snow in very cold biomes		
	heightMap(climateImage)
		.applyToTerrain()
		.fromColour(102, 102, 102).toTerrain(40) //ET - deep_snow
		.go();

	//replace the snow again in warm biomes
	heightMap(climateImage)
		.withFilter(snowyFilter)
		.applyToTerrain()
		.fromColour(0, 0, 255).toTerrain(5) //sand
		.fromColour(0, 120, 255).toTerrain(5) //sand
		.fromColour(70, 170, 250).toTerrain(5) //sand
		.fromColour(255, 0, 0).toTerrain(5) //sand
		.fromColour(255, 150, 150).toTerrain(5) //sand
		.fromColour(245, 165, 0).toTerrain(5) //sand
		.fromColour(255, 220, 100).toTerrain(5) //sand
		.fromColour(255, 255, 0).toTerrain(5) //sand
		.fromColour(200, 200, 0).toTerrain(5) //sand
		.fromColour(150, 255, 150).toTerrain(5) //sand
		.fromColour(100, 200, 100).toTerrain(5) //sand
		.fromColour(50, 150, 50).toTerrain(5) //sand
		.fromColour(200, 255, 80).toTerrain(5) //sand
		.fromColour(100, 255, 80).toTerrain(5) //sand
		.fromColour(50, 200, 0).toTerrain(5) //sand
		.fromColour(255, 0, 255).toTerrain(5) //sand
		.fromColour(200, 0, 200).toTerrain(5) //sand
		.fromColour(150, 50, 150).toTerrain(5) //sand
		.fromColour(150, 100, 150).toTerrain(5) //sand
		.fromColour(170, 175, 255).toTerrain(5) //sand
		.fromColour(90, 120, 220).toTerrain(5) //sand
		.fromColour(75, 80, 180).toTerrain(5) //sand
		.fromColour(50, 0, 135).toTerrain(5) //sand
		.fromColour(0, 255, 255).toTerrain(5) //sand
		.fromColour(55, 200, 255).toTerrain(5) //sand
		.fromColour(0, 125, 125).toTerrain(5) //sand
		.fromColour(0, 70, 95).toTerrain(5) //sand
		.fromColour(255, 255, 255).toTerrain(5) //sand
		.go();

	heightMap(climateImage)
		.applyToTerrain()
		.fromColour(255, 255, 255).toTerrain(5) //sand
		.go();

	//oceans
	heightMap(bathymetryImage)
		.applyToTerrain()
		.fromLevels(0, 254).toLevel(36) //beachTerrain
		.go();

	heightMap(latitudeImage)
		.applyToLayer(biomesLayer)
		.withFilter(sandFilter)
		//everything below 60° latitude (south) will be replaced with cold_beach
		.fromLevels(0, 38).toLevel(BIOME_COLD_BEACH)
		.fromLevels(210, 255).toLevel(BIOME_COLD_BEACH)
		.go();

	heightMap(latitudeImage)
		.withFilter(sandFilter)
		.applyToTerrain()
		//everything below 60° latitude (south) will be replaced with ice
		.fromLevels(210, 255).toTerrain(47) //ice
		.go();

	//oceans
	heightMap(bathymetryImage)
		.applyToTerrain()
		.fromLevels(0, 254).toTerrain(37) //waterTerrain
		.go();

	print("terrain created");
}

