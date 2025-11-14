//vanilla ores 
if (settingsVanillaPopulation === "False") {

	wp.applyLayer(coalOreLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(diamondOreLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(emeraldOreLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(goldOreLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(ironOreLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(lapisOreLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(quartzBlockLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(redstoneOreLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(clayDepositLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(dirtDepositLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(gravelDepositLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(undergroundLavaLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(redSandDepositLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(sandDepositLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(undergroundWaterLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(undergroundLavaLakeLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(andesiteDepositLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(dioriteDepositLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();

	wp.applyLayer(graniteDepositLayer)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.toLevel(oreModifier)
		.go();


	if (isVersionAtLeast("1-17")) {

		wp.applyLayer(tuffDepositLayer)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

		wp.applyLayer(dripstoneDepositLayer)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

		wp.applyLayer(copperOreLayer)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

	}

	if (isVersionAtLeast("1-18")) {

		wp.applyLayer(deepslateDiamondOreLayer)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

		wp.applyLayer(deepslateEmeraldOreLayer)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

		wp.applyLayer(deepslateGoldOreLayer)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

		wp.applyLayer(deepslateIronOreLayer)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

		wp.applyLayer(deepslateCopperOreLayer)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

		wp.applyLayer(deepslateLapisOreLayer)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

		wp.applyLayer(deepslateRedstoneOreLayer)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

	}

	if (mod_Create === "True") {

		var mod_Create_zincOreLayer = loadLayerFromFile('wpscript/ores/mods/create_zinc_ore.layer');
		var mod_Create_deepslateZincOreLayer = loadLayerFromFile('wpscript/ores/mods/create_zinc_ore_deepslate.layer');

		var mod_Create_veridium = loadLayerFromFile('wpscript/ores/mods/create_veridium.layer');
		var mod_Create_crimsite = loadLayerFromFile('wpscript/ores/mods/create_crimsite.layer');
		var mod_Create_limestone = loadLayerFromFile('wpscript/ores/mods/create_limestone.layer');

		wp.applyLayer(mod_Create_zincOreLayer)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

		wp.applyLayer(mod_Create_veridium)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

		wp.applyLayer(mod_Create_crimsite)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

		wp.applyLayer(mod_Create_limestone)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.toLevel(oreModifier)
			.go();

		if (isVersionAtLeast("1-18")) {

			wp.applyLayer(mod_Create_deepslateZincOreLayer)
				.toWorld(world)
				.shift(shiftLongitute, shiftLatitude)
				.toLevel(oreModifier)
				.go();

		}

	}

}

