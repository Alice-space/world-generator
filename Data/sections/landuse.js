//landuse
if (true) {

	//beach
	heightMap(landuse)
		.applyToTerrain()
		.withFilter(noWaterFilter)
		.fromColour(255, 255, 127).toTerrain(5) //terrain=sand
		.go();
	heightMap(landuse)
		.withFilter(noWaterFilter)
		.applyToLayer(biomesLayer)
		.fromColour(255, 255, 127).toLevel(BIOME_BEACH) //biome=beach
		.go();

	if (mod_BOP === "True") {
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(biomesLayer)
			.fromColour(255, 255, 127).toLevel(BIOME_BOP_DUNE_BEACH) //biome=dune beach
			.go();
	}

	//grass	
	heightMap(landuse)
		.withFilter(noWaterFilter)
		.applyToLayer(grassLayer)
		.fromColour(0, 200, 0).toLevel(1) //terrain=gras
		.go();

	//bare_stone
	heightMap(landuse)
		.applyToTerrain()
		.withFilter(noWaterFilter)
		.fromColour(50, 50, 50).toTerrain(28) //terrain=stone
		.go();

	//farm
	if (settingsFarms === "True") {

		heightMap(landuse)
			.applyToTerrain()
			.withFilter(noWaterFilter)
			.fromColour(255, 215, 0).toTerrain(1) //terrain=gras
			.fromColour(255, 215, 1).toTerrain(1) //terrain=gras
			.fromColour(255, 216, 0).toTerrain(1) //terrain=gras
			.fromColour(255, 216, 1).toTerrain(1) //terrain=gras
			.fromColour(254, 215, 0).toTerrain(1) //terrain=gras
			.fromColour(254, 215, 1).toTerrain(1) //terrain=gras
			.fromColour(254, 216, 0).toTerrain(1) //terrain=gras
			.fromColour(254, 216, 1).toTerrain(1) //terrain=gras
			.go();
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(farmDirtLayer)
			.fromColour(255, 215, 0).toLevel(1)
			.fromColour(255, 215, 1).toLevel(1)
			.fromColour(255, 216, 0).toLevel(1)
			.fromColour(255, 216, 1).toLevel(1)
			.fromColour(254, 215, 0).toLevel(1)
			.fromColour(254, 215, 1).toLevel(1)
			.fromColour(254, 216, 0).toLevel(1)
			.fromColour(254, 216, 1).toLevel(1)
			.go();
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(farmWheatLayer)
			.fromColour(255, 215, 0).toLevel(1)
			.fromColour(255, 215, 1).toLevel(1)
			.go();
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(farmPotatoesLayer)
			.fromColour(255, 216, 0).toLevel(1)
			.fromColour(255, 216, 1).toLevel(1)
			.go();
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(farmCarrotsLayer)
			.fromColour(254, 215, 0).toLevel(1)
			.fromColour(254, 215, 1).toLevel(1)
			.go();
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(farmBeetrootLayer)
			.fromColour(254, 216, 0).toLevel(1)
			.fromColour(254, 216, 1).toLevel(1)
			.go();
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(biomesLayer)
			.fromColour(255, 215, 0).toLevel(BIOME_MEADOW)
			.fromColour(255, 215, 1).toLevel(BIOME_MEADOW)
			.fromColour(255, 216, 0).toLevel(BIOME_MEADOW)
			.fromColour(255, 216, 1).toLevel(BIOME_MEADOW)
			.fromColour(254, 215, 0).toLevel(BIOME_MEADOW)
			.fromColour(254, 215, 1).toLevel(BIOME_MEADOW)
			.fromColour(254, 216, 0).toLevel(BIOME_MEADOW)
			.fromColour(254, 216, 1).toLevel(BIOME_MEADOW)
			.go();

		//remove farm_dirt on highways and streets
		heightMap(road)
			.applyToLayer(farmDirtLayer)
			.fromColour(0, 0, 0).toLevel(0)
			.fromColour(200, 200, 200).toLevel(0)
			.go();
		//remove farm_crop on street
		heightMap(road)
			.applyToLayer(farmWheatLayer)
			.fromColour(0, 0, 0).toLevel(0)
			.fromColour(200, 200, 200).toLevel(0)
			.go();
		heightMap(road)
			.applyToLayer(farmPotatoesLayer)
			.fromColour(0, 0, 0).toLevel(0)
			.fromColour(200, 200, 200).toLevel(0)
			.go();
		heightMap(road)
			.applyToLayer(farmCarrotsLayer)
			.fromColour(0, 0, 0).toLevel(0)
			.fromColour(200, 200, 200).toLevel(0)
			.go();
		heightMap(road)
			.applyToLayer(farmBeetrootLayer)
			.fromColour(0, 0, 0).toLevel(0)
			.fromColour(200, 200, 200).toLevel(0)
			.go();

		//berry_bushes
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(berryBushesLayer)
			.fromColour(150, 0, 150).toLevel(1)
			.go();
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(biomesLayer)
			.fromColour(150, 0, 150).toLevel(BIOME_MEADOW)
			.go();
		//remove berry_bushes on street
		heightMap(road)
			.applyToLayer(berryBushesLayer)
			.fromColour(0, 0, 0).toLevel(0)
			.fromColour(200, 200, 200).toLevel(0)
			.go();
	}

	//meadow
	if (settingsMeadows === "True") {
		heightMap(landuse)
			.applyToTerrain()
			.withFilter(noWaterFilter)
			.fromColour(0, 255, 0).toTerrain(1) //terrain=gras
			.go();
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(biomesLayer)
			.fromColour(0, 255, 0).toLevel(BIOME_MEADOW)
			.go();
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(grassLayer)
			.fromColour(0, 255, 0).toLevel(1) //terrain=gras
			.go();
		//remove streets on meadow
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(bigRoadLayer)
			.fromColour(0, 255, 0).toLevel(0)
			.go();
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(middleRoadLayer)
			.fromColour(0, 255, 0).toLevel(0)
			.go();
	}

	//quarry
	if (settingsQuarrys === "True") {
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToTerrain()
			.fromColour(100, 100, 100).toTerrain(28) //terrain=stone
			.go();
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(quarryLayer)
			.fromColour(100, 100, 100).toLevel(1)
			.go();
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(biomesLayer)
			.fromColour(100, 100, 100).toLevel(BIOME_WINDSWEPT_GRAVELLY_HILLS)
			.go();
		//remove quarry on street
		heightMap(road)
			.applyToLayer(quarryLayer)
			.fromColour(0, 0, 0).toLevel(0)
			.fromColour(100, 100, 100).toLevel(0)
			.go();
	}

	if (settingsAerodrome === "True") {
		var end_portal = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_aerodrome.png').go();
		heightMap(end_portal)
			.applyToLayer(endPortalLayer)
			.fromColour(0, 127, 127).toLevel(15)
			.go();
	}

	if (settingsMobSpawner === "True") {
		wp.applyLayer(mobSpawnerLayer)
			.toWorld(world)
			.withFilter(waterFilter)
			.toLevel(15)
			.go();
	}

	if (settingsAnimalSpawner === "True") {
		wp.applyLayer(animalSpawnerLayer)
			.toWorld(world)
			.withFilter(noWaterFilter)
			.toLevel(15)
			.go();
	}

	//easter egg
	if (scale > 1023 && tilesPerMap === 1) {
		var easter_eggs = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_easter_eggs.png').go();
		heightMap(easter_eggs)
			.withFilter(noWaterFilter)
			.applyToLayer(eastereggCreatorLayer)
			.fromColour(0, 0, 0).toLevel(15)
			.go();
	}

	print("landuse created");

}

