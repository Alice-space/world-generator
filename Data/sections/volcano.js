//volcano
if (settingsVolcanos === "True") {

	wp.applyHeightMap(landuse)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToTerrain()
		.withFilter(noWaterFilter)
		.fromColour(255, 128, 0).toTerrain(38) //terrain=lava
		.go();

	wp.applyHeightMap(landuse)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(noWaterFilter)
		.applyToLayer(volcanoBorderLayer)
		.fromColour(255, 100, 0).toLevel(1) //custom terrain = obsidian or blackstone border for lava
		.go();

	if (mod_BOP === "True") {
		wp.applyHeightMap(landuse)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.withFilter(noWaterFilter)
			.applyToLayer(biomesLayer)
			.fromColour(255, 128, 0).toLevel(BIOME_BOP_VOLCANO)
			.fromColour(255, 100, 0).toLevel(BIOME_BOP_VOLCANO)
			.fromColour(255, 63, 0).toLevel(BIOME_BOP_VOLCANO)
			.go();
	}

	if (mod_Terralith === "True") {
		wp.applyHeightMap(landuse)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.withFilter(noWaterFilter)
			.applyToLayer(biomesLayer)
			.fromColour(255, 128, 0).toLevel(BIOME_TERRALITH_VOLCANIC_PEAKS)
			.fromColour(255, 100, 0).toLevel(BIOME_TERRALITH_VOLCANIC_PEAKS)
			.fromColour(255, 63, 0).toLevel(BIOME_TERRALITH_VOLCANIC_PEAKS)
			.go();
	}

}

