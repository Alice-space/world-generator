//water
if (true) {

	if (settingsRivers === "True") {

		//waterbodies
		heightMap(waterImage)
			.withFilter(noWaterFilter)
			.applyToTerrain()
			.fromLevels(0, 230).toTerrain(37) //water on rivers and lakes
			.go();

		heightMap(waterImage)
			.withFilter(noWaterFilter)
			.applyToLayer(biomesLayer)
			.fromLevels(0, 230).toLevel(BIOME_RIVER)
			.go();

		//rivers
		heightMap(riverImage)
			.withFilter(noWaterFilterForRivers)
			.applyToTerrain()
			.fromLevels(0, 230).toTerrain(37) //water on rivers and lakes
			.go();
		heightMap(riverImage)
			.withFilter(noWaterFilterForRivers)
			.applyToLayer(biomesLayer)
			.fromLevels(0, 230).toLevel(BIOME_RIVER)
			.go();

	}

	//swamp
	heightMap(wetImage)
		.applyToLayer(swampTerrain)
		.withFilter(noWaterFilter)
		.fromColour(0, 127, 127).toLevel(1)
		.go();

	if (settingsVanillaPopulation === "False") {
		heightMap(wetImage)
			.applyToLayer(swampLayer) //build in swamp layer with trees, etc.
			.withFilter(noWaterFilter)
			.fromColour(0, 127, 127).toLevel(15)
			.go();

		if (isVersionAtLeast("1-17")) {
			heightMap(wetImage)
				.applyToLayer(dripleafsLayer) //dripleafs
				.withFilter(noWaterFilter)
				.fromColour(0, 127, 127).toLevel(15)
				.go();
		}
	}

	heightMap(wetImage)
		.applyToLayer(biomesLayer)
		.withFilter(noWaterFilter)
		.fromColour(0, 127, 127).toLevel(BIOME_SWAMP)
		.go();

	if (isVersionAtLeast("1-19")) {

		//add mangroveTerrain
		heightMap(climateImage)
			.applyToLayer(mangroveTerrain)
			.withFilter(swampFilterBelowDegrees)
			.fromColour(0, 0, 255).toLevel(1)
			.fromColour(0, 120, 255).toLevel(1)
			.go();

		//remove swampTerrain from mangroves
		heightMap(climateImage)
			.applyToLayer(swampTerrain)
			.withFilter(swampFilterBelowDegrees)
			.fromColour(0, 0, 255).toLevel(0)
			.fromColour(0, 120, 255).toLevel(0)
			.go();

		//add mangroveBiome
		heightMap(climateImage)
			.applyToLayer(biomesLayer)
			.withFilter(swampFilterBelowDegrees)
			.fromColour(0, 0, 255).toLevel(BIOME_MANGROVE_SWAMP)
			.fromColour(0, 120, 255).toLevel(BIOME_MANGROVE_SWAMP)
			.go();

		if (settingsVanillaPopulation === "False") {
			//add mangroveLayer
			heightMap(climateImage)
				.applyToLayer(mangroveLayer)
				.withFilter(swampFilterBelowDegrees)
				.fromColour(0, 0, 255).toLevel(15)
				.fromColour(0, 120, 255).toLevel(15)
				.go();

			//remove swampLayer from mangroves (last, because this is the swampFilter)
			heightMap(climateImage)
				.applyToLayer(swampLayer)
				.withFilter(swampFilterBelowDegrees)
				.fromColour(0, 0, 255).toLevel(0)
				.fromColour(0, 120, 255).toLevel(0)
				.go();
		}

	}

	//glacier
	heightMap(wetImage)
		.applyToTerrain()
		.withFilter(noWaterFilter)
		.fromColour(200, 200, 200).toTerrain(snowTerrain) //terrain=deep_snow
		.go();

	//stream
	if (settingsStreams === "True") {
		heightMap(streamImage)
			.applyToTerrain()
			.withFilter(noWaterFilter)
			.fromLevels(0, 254).toTerrain(37) //water on stream
			.go();
		heightMap(streamImage)
			.applyToLayer(biomesLayer)
			.fromLevels(0, 254).toLevel(BIOME_RIVER)
			.go();
	}

	//snow
	var snowImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_snow.png').go();

	heightMap(snowImage)
		.withFilter(noWaterFilter)
		.applyToLayer(snow1deep)
		.fromLevels(112, 127).toLevel(1)
		.go();

	heightMap(snowImage)
		.withFilter(noWaterFilter)
		.applyToLayer(snow2deep)
		.fromLevels(128, 143).toLevel(1)
		.go();

	heightMap(snowImage)
		.withFilter(noWaterFilter)
		.applyToLayer(snow3deep)
		.fromLevels(144, 159).toLevel(1)
		.go();

	heightMap(snowImage)
		.withFilter(noWaterFilter)
		.applyToLayer(snow4deep)
		.fromLevels(160, 175).toLevel(1)
		.go();

	heightMap(snowImage)
		.withFilter(noWaterFilter)
		.applyToLayer(snow5deep)
		.fromLevels(176, 191).toLevel(1)
		.go();

	heightMap(snowImage)
		.withFilter(noWaterFilter)
		.applyToLayer(snow6deep)
		.fromLevels(192, 207).toLevel(1)
		.go();

	heightMap(snowImage)
		.withFilter(noWaterFilter)
		.applyToLayer(snow7deep)
		.fromLevels(208, 223).toLevel(1)
		.go();

	heightMap(snowImage)
		.withFilter(noWaterFilter)
		.applyToLayer(snow8deep)
		.fromLevels(224, 239).toLevel(1)
		.go();

	heightMap(snowImage)
		.withFilter(noWaterFilter)
		.applyToLayer(snowBlock)
		.fromLevels(240, 255).toLevel(1)
		.go();

	heightMap(snowImage)
		.withFilter(noWaterFilter)
		.applyToLayer(biomesLayer)
		.fromLevels(112, 255).toLevel(BIOME_FROZEN_PEAKS) //change biome to frozen peaks where snow is generated
		.go();

	//last, replace the under water terrain
	heightMap(bathymetryImage)
		.applyToTerrain()
		.withFilter(waterFilter)
		.fromLevels(0, 254).toTerrain(37) //temporary water (for rivers and other filter operations, later beaches)
		.go();

	if (settingsVanillaPopulation === "False") {

		//frozen ocean
		heightMap(oceanTempImage)
			.withFilter(oceanFilter)
			.applyToLayer(biomesLayer)
			.fromLevels(0, 1).toLevel(BIOME_FROZEN_OCEAN)
			.go();
		heightMap(oceanTempImage)
			.withFilter(oceanFilter)
			.applyToLayer(coldOceanLayer)
			.fromLevels(0, 1).toLevel(15)
			.go();
		heightMap(oceanTempImage)
			.withFilter(oceanFilter)
			.applyToLayer(frostLayer)
			.fromLevels(0, 1).toLevel(1)
			.go();

		//remove oceanLayer
		heightMap(oceanTempImage)
			.withFilter(oceanFilter)
			.applyToLayer(oceanLayer)
			.fromLevels(0, 1).toLevel(0)
			.go();

		//frozen deep ocean
		heightMap(oceanTempImage)
			.withFilter(deepOceanFilter)
			.applyToLayer(biomesLayer)
			.fromLevels(0, 1).toLevel(BIOME_DEEP_FROZEN_OCEAN)
			.go();
		heightMap(oceanTempImage)
			.withFilter(deepOceanFilter)
			.applyToLayer(deepColdOceanLayer)
			.fromLevels(0, 1).toLevel(15)
			.go();
		heightMap(oceanTempImage)
			.withFilter(deepOceanFilter)
			.applyToLayer(frostLayer)
			.fromLevels(0, 1).toLevel(1)
			.go();

		//remove deepOceanLayer
		heightMap(oceanTempImage)
			.withFilter(deepOceanFilter)
			.applyToLayer(deepOceanLayer)
			.fromLevels(0, 1).toLevel(0)
			.go();

		if (isVersionAtLeast("1-16")) {

			//corals (biome = warm ocean)
			heightMap(coralsImage)
				.withFilter(oceanCoralFilter)
				.applyToLayer(biomesLayer)
				.fromColour(0, 0, 0).toLevel(BIOME_WARM_OCEAN)
				.go();
			heightMap(coralsImage)
				.withFilter(oceanCoralFilter)
				.applyToLayer(warmOceanLayer)
				.fromColour(0, 0, 0).toLevel(15)
				.go();
			//remove oceanLayer
			heightMap(coralsImage)
				.withFilter(oceanCoralFilter)
				.applyToLayer(oceanLayer)
				.fromColour(0, 0, 0).toLevel(0)
				.go();

			//cold ocean
			heightMap(oceanTempImage)
				.withFilter(oceanFilter)
				.applyToLayer(biomesLayer)
				.fromLevels(2, 75).toLevel(BIOME_COLD_OCEAN)
				.go();
			heightMap(oceanTempImage)
				.withFilter(oceanFilter)
				.applyToLayer(coldOceanLayer)
				.fromLevels(2, 75).toLevel(15)
				.go();
			//remove oceanLayer
			heightMap(oceanTempImage)
				.withFilter(oceanFilter)
				.applyToLayer(oceanLayer)
				.fromLevels(2, 75).toLevel(0)
				.go();

			//cold deep ocean
			heightMap(oceanTempImage)
				.withFilter(deepOceanFilter)
				.applyToLayer(biomesLayer)
				.fromLevels(2, 75).toLevel(BIOME_DEEP_COLD_OCEAN)
				.go();
			heightMap(oceanTempImage)
				.withFilter(deepOceanFilter)
				.applyToLayer(deepColdOceanLayer)
				.fromLevels(2, 75).toLevel(15)
				.go();
			//remove deepOceanLayer
			heightMap(oceanTempImage)
				.withFilter(deepOceanFilter)
				.applyToLayer(deepOceanLayer)
				.fromLevels(2, 75).toLevel(0)
				.go();

			//lukewarm ocean
			heightMap(oceanTempImage)
				.withFilter(oceanFilter)
				.applyToLayer(biomesLayer)
				.fromLevels(180, 220).toLevel(BIOME_LUKEWARM_OCEAN)
				.go();
			heightMap(oceanTempImage)
				.withFilter(oceanFilter)
				.applyToLayer(lukewarmOceanLayer)
				.fromLevels(180, 220).toLevel(15)
				.go();
			//remove oceanLayer
			heightMap(oceanTempImage)
				.withFilter(oceanFilter)
				.applyToLayer(oceanLayer)
				.fromLevels(180, 220).toLevel(0)
				.go();

			//deep lukewarm ocean
			heightMap(oceanTempImage)
				.withFilter(deepOceanFilter)
				.applyToLayer(biomesLayer)
				.fromLevels(180, 255).toLevel(BIOME_DEEP_LUKEWARM_OCEAN)
				.go();
			heightMap(oceanTempImage)
				.withFilter(deepOceanFilter)
				.applyToLayer(deepLukewarmOceanLayer)
				.fromLevels(180, 255).toLevel(15)
				.go();
			//remove deepOceanLayer
			heightMap(oceanTempImage)
				.withFilter(deepOceanFilter)
				.applyToLayer(deepOceanLayer)
				.fromLevels(180, 255).toLevel(0)
				.go();

			//warm ocean without corals (lukewarm ocean)
			heightMap(oceanTempImage)
				.withFilter(oceanFilter)
				.applyToLayer(biomesLayer)
				.fromLevels(221, 255).toLevel(BIOME_LUKEWARM_OCEAN)
				.go();
			heightMap(oceanTempImage)
				.withFilter(oceanFilter)
				.applyToLayer(warmOceanLayerWithoutCoral)
				.fromLevels(221, 255).toLevel(15)
				.go();
			//remove oceanLayer
			heightMap(oceanTempImage)
				.withFilter(oceanFilter)
				.applyToLayer(oceanLayer)
				.fromLevels(221, 255).toLevel(0)
				.go();
		}

	} else {

		//frozen ocean
		heightMap(oceanTempImage)
			.withFilter(oceanFilter)
			.applyToLayer(biomesLayer)
			.fromLevels(0, 1).toLevel(BIOME_FROZEN_OCEAN)
			.go();
		//remove oceanLayer
		heightMap(oceanTempImage)
			.withFilter(oceanFilter)
			.applyToLayer(oceanLayer)
			.fromLevels(0, 1).toLevel(0)
			.go();

		//frozen deep ocean
		heightMap(oceanTempImage)
			.withFilter(deepOceanFilter)
			.applyToLayer(biomesLayer)
			.fromLevels(0, 1).toLevel(BIOME_DEEP_FROZEN_OCEAN)
			.go();
		//remove deepOceanLayer
		heightMap(oceanTempImage)
			.withFilter(deepOceanFilter)
			.applyToLayer(deepOceanLayer)
			.fromLevels(0, 1).toLevel(0)
			.go();

		//corals (biome = warm ocean)
		heightMap(coralsImage)
			.withFilter(oceanCoralFilter)
			.applyToLayer(biomesLayer)
			.fromColour(0, 0, 0).toLevel(BIOME_WARM_OCEAN)
			.go();
		//remove oceanLayer
		heightMap(coralsImage)
			.withFilter(oceanCoralFilter)
			.applyToLayer(oceanLayer)
			.fromColour(0, 0, 0).toLevel(0)
			.go();

		//cold ocean
		heightMap(oceanTempImage)
			.withFilter(oceanFilter)
			.applyToLayer(biomesLayer)
			.fromLevels(2, 75).toLevel(BIOME_COLD_OCEAN)
			.go();
		//remove oceanLayer
		heightMap(oceanTempImage)
			.withFilter(oceanFilter)
			.applyToLayer(oceanLayer)
			.fromLevels(2, 75).toLevel(0)
			.go();

		//cold deep ocean
		heightMap(oceanTempImage)
			.withFilter(deepOceanFilter)
			.applyToLayer(biomesLayer)
			.fromLevels(2, 75).toLevel(BIOME_DEEP_COLD_OCEAN)
			.go();
		//remove deepOceanLayer
		heightMap(oceanTempImage)
			.withFilter(deepOceanFilter)
			.applyToLayer(deepOceanLayer)
			.fromLevels(2, 75).toLevel(0)
			.go();

		//remove oceanLayer
		heightMap(oceanTempImage)
			.withFilter(oceanFilter)
			.applyToLayer(oceanLayer)
			.fromLevels(76, 179).toLevel(0)
			.go();
		//remove deepOceanLayer
		heightMap(oceanTempImage)
			.withFilter(deepOceanFilter)
			.applyToLayer(deepOceanLayer)
			.fromLevels(76, 179).toLevel(0)
			.go();

		//lukewarm ocean
		heightMap(oceanTempImage)
			.withFilter(oceanFilter)
			.applyToLayer(biomesLayer)
			.fromLevels(180, 220).toLevel(BIOME_LUKEWARM_OCEAN)
			.go();
		//remove oceanLayer
		heightMap(oceanTempImage)
			.withFilter(oceanFilter)
			.applyToLayer(oceanLayer)
			.fromLevels(180, 220).toLevel(0)
			.go();

		//deep lukewarm ocean
		heightMap(oceanTempImage)
			.withFilter(deepOceanFilter)
			.applyToLayer(biomesLayer)
			.fromLevels(180, 255).toLevel(BIOME_DEEP_LUKEWARM_OCEAN)
			.go();
		//remove deepOceanLayer
		heightMap(oceanTempImage)
			.withFilter(deepOceanFilter)
			.applyToLayer(deepOceanLayer)
			.fromLevels(180, 255).toLevel(0)
			.go();

		//warm ocean without corals (lukewarm ocean)
		heightMap(oceanTempImage)
			.withFilter(oceanFilter)
			.applyToLayer(biomesLayer)
			.fromLevels(221, 255).toLevel(BIOME_LUKEWARM_OCEAN)
			.go();
		//remove oceanLayer
		heightMap(oceanTempImage)
			.withFilter(oceanFilter)
			.applyToLayer(oceanLayer)
			.fromLevels(221, 255).toLevel(0)
			.go();

	}

	print("water and rivers created");
}

