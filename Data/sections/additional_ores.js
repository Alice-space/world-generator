//additional ores
if (settingsOres === "True") {

	var clayImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_clay.png').go();

	heightMap(clayImage)
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

	heightMap(coalImage)
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

	heightMap(diamondImage)
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
		heightMap(diamondImage)
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

	heightMap(goldImage)
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
		heightMap(goldImage)
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

	heightMap(ironImage)
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
		heightMap(ironImage)
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

		heightMap(netheriteImage)
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

	heightMap(quartzImage)
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

	heightMap(redstoneImage)
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
		heightMap(redstoneImage)
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

		heightMap(copperImage)
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
			heightMap(copperImage)
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

		heightMap(mod_Create_zincImage)
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

			heightMap(mod_Create_zincImage)
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
	heightMap(bathymetryImage)
		.applyToTerrain()
		.withFilter(waterFilter)
		.fromLevels(0, 254).toTerrain(36) //worldpainter beaches (sand gravel clay)
		.go();

}

