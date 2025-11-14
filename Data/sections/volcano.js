//volcano
if (settingsVolcanos === "True") {

	heightMap(landuse)
		.applyToTerrain()
		.withFilter(noWaterFilter)
		.fromColour(255, 128, 0).toTerrain(38) //terrain=lava
		.go();

	heightMap(landuse)
		.withFilter(noWaterFilter)
		.applyToLayer(volcanoBorderLayer)
		.fromColour(255, 100, 0).toLevel(1) //custom terrain = obsidian or blackstone border for lava
		.go();

	if (mod_BOP === "True") {
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(biomesLayer)
			.fromColour(255, 128, 0).toLevel(BIOME_BOP_VOLCANO)
			.fromColour(255, 100, 0).toLevel(BIOME_BOP_VOLCANO)
			.fromColour(255, 63, 0).toLevel(BIOME_BOP_VOLCANO)
			.go();
	}

	if (mod_Terralith === "True") {
		heightMap(landuse)
			.withFilter(noWaterFilter)
			.applyToLayer(biomesLayer)
			.fromColour(255, 128, 0).toLevel(BIOME_TERRALITH_VOLCANIC_PEAKS)
			.fromColour(255, 100, 0).toLevel(BIOME_TERRALITH_VOLCANIC_PEAKS)
			.fromColour(255, 63, 0).toLevel(BIOME_TERRALITH_VOLCANIC_PEAKS)
			.go();
	}

}

