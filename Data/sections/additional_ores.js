//additional ores
if (settingsOres === "True") {

	var clayImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_clay.png').go();

	wp.applyHeightMap(clayImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(clayDepositLayer)
		.fromLevels(0, 15).toLevel(8)
		.fromLevels(16, 31).toLevel(7)
		.fromLevels(32, 47).toLevel(7)
		.fromLevels(48, 63).toLevel(6)
		.fromLevels(64, 79).toLevel(6)
		.fromLevels(80, 95).toLevel(5)
		.fromLevels(96, 111).toLevel(5)
		.fromLevels(112, 127).toLevel(4)
		.fromLevels(128, 143).toLevel(4)
		.fromLevels(144, 159).toLevel(3)
		.fromLevels(160, 175).toLevel(3)
		.fromLevels(176, 191).toLevel(2)
		.fromLevels(192, 207).toLevel(2)
		.fromLevels(208, 223).toLevel(1)
		.fromLevels(224, 239).toLevel(1)
		.fromLevels(240, 255).toLevel(0)
		.go();

	var coalImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_coal.png').go();

	wp.applyHeightMap(coalImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(coalDepositLayer)
		.fromLevels(0, 15).toLevel(8)
		.fromLevels(16, 31).toLevel(7)
		.fromLevels(32, 47).toLevel(7)
		.fromLevels(48, 63).toLevel(6)
		.fromLevels(64, 79).toLevel(6)
		.fromLevels(80, 95).toLevel(5)
		.fromLevels(96, 111).toLevel(5)
		.fromLevels(112, 127).toLevel(4)
		.fromLevels(128, 143).toLevel(4)
		.fromLevels(144, 159).toLevel(3)
		.fromLevels(160, 175).toLevel(3)
		.fromLevels(176, 191).toLevel(2)
		.fromLevels(192, 207).toLevel(2)
		.fromLevels(208, 223).toLevel(1)
		.fromLevels(224, 239).toLevel(1)
		.fromLevels(240, 255).toLevel(0)
		.go();

	var diamondImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_diamond.png').go();

	wp.applyHeightMap(diamondImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(diamondDepositLayer)
		.fromLevels(0, 15).toLevel(8)
		.fromLevels(16, 31).toLevel(7)
		.fromLevels(32, 47).toLevel(7)
		.fromLevels(48, 63).toLevel(6)
		.fromLevels(64, 79).toLevel(6)
		.fromLevels(80, 95).toLevel(5)
		.fromLevels(96, 111).toLevel(5)
		.fromLevels(112, 127).toLevel(4)
		.fromLevels(128, 143).toLevel(4)
		.fromLevels(144, 159).toLevel(3)
		.fromLevels(160, 175).toLevel(3)
		.fromLevels(176, 191).toLevel(2)
		.fromLevels(192, 207).toLevel(2)
		.fromLevels(208, 223).toLevel(1)
		.fromLevels(224, 239).toLevel(1)
		.fromLevels(240, 255).toLevel(0)
		.go();

	if (isVersionAtLeast("1-18")) {
		wp.applyHeightMap(diamondImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.applyToLayer(deepslateDiamondDepositLayer)
			.fromLevels(0, 15).toLevel(8)
			.fromLevels(16, 31).toLevel(7)
			.fromLevels(32, 47).toLevel(7)
			.fromLevels(48, 63).toLevel(6)
			.fromLevels(64, 79).toLevel(6)
			.fromLevels(80, 95).toLevel(5)
			.fromLevels(96, 111).toLevel(5)
			.fromLevels(112, 127).toLevel(4)
			.fromLevels(128, 143).toLevel(4)
			.fromLevels(144, 159).toLevel(3)
			.fromLevels(160, 175).toLevel(3)
			.fromLevels(176, 191).toLevel(2)
			.fromLevels(192, 207).toLevel(2)
			.fromLevels(208, 223).toLevel(1)
			.fromLevels(224, 239).toLevel(1)
			.fromLevels(240, 255).toLevel(0)
			.go();
	}

	var goldImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_gold.png').go();

	wp.applyHeightMap(goldImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(goldDepositLayer)
		.fromLevels(0, 15).toLevel(8)
		.fromLevels(16, 31).toLevel(7)
		.fromLevels(32, 47).toLevel(7)
		.fromLevels(48, 63).toLevel(6)
		.fromLevels(64, 79).toLevel(6)
		.fromLevels(80, 95).toLevel(5)
		.fromLevels(96, 111).toLevel(5)
		.fromLevels(112, 127).toLevel(4)
		.fromLevels(128, 143).toLevel(4)
		.fromLevels(144, 159).toLevel(3)
		.fromLevels(160, 175).toLevel(3)
		.fromLevels(176, 191).toLevel(2)
		.fromLevels(192, 207).toLevel(2)
		.fromLevels(208, 223).toLevel(1)
		.fromLevels(224, 239).toLevel(1)
		.fromLevels(240, 255).toLevel(0)
		.go();

	if (isVersionAtLeast("1-18")) {
		wp.applyHeightMap(goldImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.applyToLayer(deepslateGoldDepositLayer)
			.fromLevels(0, 15).toLevel(8)
			.fromLevels(16, 31).toLevel(7)
			.fromLevels(32, 47).toLevel(7)
			.fromLevels(48, 63).toLevel(6)
			.fromLevels(64, 79).toLevel(6)
			.fromLevels(80, 95).toLevel(5)
			.fromLevels(96, 111).toLevel(5)
			.fromLevels(112, 127).toLevel(4)
			.fromLevels(128, 143).toLevel(4)
			.fromLevels(144, 159).toLevel(3)
			.fromLevels(160, 175).toLevel(3)
			.fromLevels(176, 191).toLevel(2)
			.fromLevels(192, 207).toLevel(2)
			.fromLevels(208, 223).toLevel(1)
			.fromLevels(224, 239).toLevel(1)
			.fromLevels(240, 255).toLevel(0)
			.go();
	}

	var ironImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_iron.png').go();

	wp.applyHeightMap(ironImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(ironDepositLayer)
		.fromLevels(0, 15).toLevel(8)
		.fromLevels(16, 31).toLevel(7)
		.fromLevels(32, 47).toLevel(7)
		.fromLevels(48, 63).toLevel(6)
		.fromLevels(64, 79).toLevel(6)
		.fromLevels(80, 95).toLevel(5)
		.fromLevels(96, 111).toLevel(5)
		.fromLevels(112, 127).toLevel(4)
		.fromLevels(128, 143).toLevel(4)
		.fromLevels(144, 159).toLevel(3)
		.fromLevels(160, 175).toLevel(3)
		.fromLevels(176, 191).toLevel(2)
		.fromLevels(192, 207).toLevel(2)
		.fromLevels(208, 223).toLevel(1)
		.fromLevels(224, 239).toLevel(1)
		.fromLevels(240, 255).toLevel(0)
		.go();

	if (isVersionAtLeast("1-18")) {
		wp.applyHeightMap(ironImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.applyToLayer(deepslateIronDepositLayer)
			.fromLevels(0, 15).toLevel(8)
			.fromLevels(16, 31).toLevel(7)
			.fromLevels(32, 47).toLevel(7)
			.fromLevels(48, 63).toLevel(6)
			.fromLevels(64, 79).toLevel(6)
			.fromLevels(80, 95).toLevel(5)
			.fromLevels(96, 111).toLevel(5)
			.fromLevels(112, 127).toLevel(4)
			.fromLevels(128, 143).toLevel(4)
			.fromLevels(144, 159).toLevel(3)
			.fromLevels(160, 175).toLevel(3)
			.fromLevels(176, 191).toLevel(2)
			.fromLevels(192, 207).toLevel(2)
			.fromLevels(208, 223).toLevel(1)
			.fromLevels(224, 239).toLevel(1)
			.fromLevels(240, 255).toLevel(0)
			.go();
	}

	if ((isVersionAtLeast("1-16")) && settingsNetherite === "True") {
		var netheriteImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_netherite.png').go();

		wp.applyHeightMap(netheriteImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.applyToLayer(netheriteDepositLayer)
			.fromLevels(0, 15).toLevel(8)
			.fromLevels(16, 31).toLevel(7)
			.fromLevels(32, 47).toLevel(7)
			.fromLevels(48, 63).toLevel(6)
			.fromLevels(64, 79).toLevel(6)
			.fromLevels(80, 95).toLevel(5)
			.fromLevels(96, 111).toLevel(5)
			.fromLevels(112, 127).toLevel(4)
			.fromLevels(128, 143).toLevel(4)
			.fromLevels(144, 159).toLevel(3)
			.fromLevels(160, 175).toLevel(3)
			.fromLevels(176, 191).toLevel(2)
			.fromLevels(192, 207).toLevel(2)
			.fromLevels(208, 223).toLevel(1)
			.fromLevels(224, 239).toLevel(1)
			.fromLevels(240, 255).toLevel(0)
			.go();
	}

	var quartzImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_quartz.png').go();

	wp.applyHeightMap(quartzImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(quartzDepositLayer)
		.fromLevels(0, 15).toLevel(8)
		.fromLevels(16, 31).toLevel(7)
		.fromLevels(32, 47).toLevel(7)
		.fromLevels(48, 63).toLevel(6)
		.fromLevels(64, 79).toLevel(6)
		.fromLevels(80, 95).toLevel(5)
		.fromLevels(96, 111).toLevel(5)
		.fromLevels(112, 127).toLevel(4)
		.fromLevels(128, 143).toLevel(4)
		.fromLevels(144, 159).toLevel(3)
		.fromLevels(160, 175).toLevel(3)
		.fromLevels(176, 191).toLevel(2)
		.fromLevels(192, 207).toLevel(2)
		.fromLevels(208, 223).toLevel(1)
		.fromLevels(224, 239).toLevel(1)
		.fromLevels(240, 255).toLevel(0)
		.go();

	var redstoneImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_redstone.png').go();

	wp.applyHeightMap(redstoneImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(redstoneDepositLayer)
		.fromLevels(0, 15).toLevel(8)
		.fromLevels(16, 31).toLevel(7)
		.fromLevels(32, 47).toLevel(7)
		.fromLevels(48, 63).toLevel(6)
		.fromLevels(64, 79).toLevel(6)
		.fromLevels(80, 95).toLevel(5)
		.fromLevels(96, 111).toLevel(5)
		.fromLevels(112, 127).toLevel(4)
		.fromLevels(128, 143).toLevel(4)
		.fromLevels(144, 159).toLevel(3)
		.fromLevels(160, 175).toLevel(3)
		.fromLevels(176, 191).toLevel(2)
		.fromLevels(192, 207).toLevel(2)
		.fromLevels(208, 223).toLevel(1)
		.fromLevels(224, 239).toLevel(1)
		.fromLevels(240, 255).toLevel(0)
		.go();

	if (isVersionAtLeast("1-18")) {
		wp.applyHeightMap(redstoneImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.applyToLayer(deepslateRedstoneDepositLayer)
			.fromLevels(0, 15).toLevel(8)
			.fromLevels(16, 31).toLevel(7)
			.fromLevels(32, 47).toLevel(7)
			.fromLevels(48, 63).toLevel(6)
			.fromLevels(64, 79).toLevel(6)
			.fromLevels(80, 95).toLevel(5)
			.fromLevels(96, 111).toLevel(5)
			.fromLevels(112, 127).toLevel(4)
			.fromLevels(128, 143).toLevel(4)
			.fromLevels(144, 159).toLevel(3)
			.fromLevels(160, 175).toLevel(3)
			.fromLevels(176, 191).toLevel(2)
			.fromLevels(192, 207).toLevel(2)
			.fromLevels(208, 223).toLevel(1)
			.fromLevels(224, 239).toLevel(1)
			.fromLevels(240, 255).toLevel(0)
			.go();
	}

	if (isVersionAtLeast("1-17")) {

		var copperImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_copper.png').go();

		wp.applyHeightMap(copperImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.applyToLayer(copperDepositLayer)
			.fromLevels(0, 15).toLevel(8)
			.fromLevels(16, 31).toLevel(7)
			.fromLevels(32, 47).toLevel(7)
			.fromLevels(48, 63).toLevel(6)
			.fromLevels(64, 79).toLevel(6)
			.fromLevels(80, 95).toLevel(5)
			.fromLevels(96, 111).toLevel(5)
			.fromLevels(112, 127).toLevel(4)
			.fromLevels(128, 143).toLevel(4)
			.fromLevels(144, 159).toLevel(3)
			.fromLevels(160, 175).toLevel(3)
			.fromLevels(176, 191).toLevel(2)
			.fromLevels(192, 207).toLevel(2)
			.fromLevels(208, 223).toLevel(1)
			.fromLevels(224, 239).toLevel(1)
			.fromLevels(240, 255).toLevel(0)
			.go();

		if (isVersionAtLeast("1-18")) {
			wp.applyHeightMap(copperImage)
				.toWorld(world)
				.shift(shiftLongitute, shiftLatitude)
				.applyToLayer(deepslateCopperDepositLayer)
				.fromLevels(0, 15).toLevel(8)
				.fromLevels(16, 31).toLevel(7)
				.fromLevels(32, 47).toLevel(7)
				.fromLevels(48, 63).toLevel(6)
				.fromLevels(64, 79).toLevel(6)
				.fromLevels(80, 95).toLevel(5)
				.fromLevels(96, 111).toLevel(5)
				.fromLevels(112, 127).toLevel(4)
				.fromLevels(128, 143).toLevel(4)
				.fromLevels(144, 159).toLevel(3)
				.fromLevels(160, 175).toLevel(3)
				.fromLevels(176, 191).toLevel(2)
				.fromLevels(192, 207).toLevel(2)
				.fromLevels(208, 223).toLevel(1)
				.fromLevels(224, 239).toLevel(1)
				.fromLevels(240, 255).toLevel(0)
				.go();
		}

	}

	if (mod_Create === "True") {

		var mod_Create_zincImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_zinc.png').go();
		var mod_Create_zincDepositLayer = loadLayerFromFile('wpscript/ores/mods/create_zinc_deposit.layer');
		var mod_Create_deepslateZincDepositLayer = loadLayerFromFile('wpscript/ores/mods/create_zinc_deposit_deepslate.layer');

		wp.applyHeightMap(mod_Create_zincImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.applyToLayer(mod_Create_zincDepositLayer)
			.fromLevels(0, 15).toLevel(8)
			.fromLevels(16, 31).toLevel(7)
			.fromLevels(32, 47).toLevel(7)
			.fromLevels(48, 63).toLevel(6)
			.fromLevels(64, 79).toLevel(6)
			.fromLevels(80, 95).toLevel(5)
			.fromLevels(96, 111).toLevel(5)
			.fromLevels(112, 127).toLevel(4)
			.fromLevels(128, 143).toLevel(4)
			.fromLevels(144, 159).toLevel(3)
			.fromLevels(160, 175).toLevel(3)
			.fromLevels(176, 191).toLevel(2)
			.fromLevels(192, 207).toLevel(2)
			.fromLevels(208, 223).toLevel(1)
			.fromLevels(224, 239).toLevel(1)
			.fromLevels(240, 255).toLevel(0)
			.go();

		if (isVersionAtLeast("1-18")) {

			wp.applyHeightMap(mod_Create_zincImage)
				.toWorld(world)
				.shift(shiftLongitute, shiftLatitude)
				.applyToLayer(mod_Create_deepslateZincDepositLayer)
				.fromLevels(0, 15).toLevel(8)
				.fromLevels(16, 31).toLevel(7)
				.fromLevels(32, 47).toLevel(7)
				.fromLevels(48, 63).toLevel(6)
				.fromLevels(64, 79).toLevel(6)
				.fromLevels(80, 95).toLevel(5)
				.fromLevels(96, 111).toLevel(5)
				.fromLevels(112, 127).toLevel(4)
				.fromLevels(128, 143).toLevel(4)
				.fromLevels(144, 159).toLevel(3)
				.fromLevels(160, 175).toLevel(3)
				.fromLevels(176, 191).toLevel(2)
				.fromLevels(192, 207).toLevel(2)
				.fromLevels(208, 223).toLevel(1)
				.fromLevels(224, 239).toLevel(1)
				.fromLevels(240, 255).toLevel(0)
				.go();

		}

	}

}

if (true) {

	//last, replace the under water terrain
	wp.applyHeightMap(bathymetryImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToTerrain()
		.withFilter(waterFilter)
		.fromLevels(0, 254).toTerrain(36) //worldpainter beaches (sand gravel clay)
		.go();

}

