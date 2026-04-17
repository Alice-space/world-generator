// additional ores
// Requires: lib/utils.js (applyDepositMappingToLayer, loadTileImage)
if (settingsOres === "True") {

	var clayImage = loadTileImage('clay');
	applyDepositMappingToLayer(clayImage, clayDepositLayer);

	var coalImage = loadTileImage('coal');
	applyDepositMappingToLayer(coalImage, coalDepositLayer);

	var diamondImage = loadTileImage('diamond');
	applyDepositMappingToLayer(diamondImage, diamondDepositLayer);

	if (isVersionAtLeast("1-18")) {
		applyDepositMappingToLayer(diamondImage, deepslateDiamondDepositLayer);
	}

	var goldImage = loadTileImage('gold');
	applyDepositMappingToLayer(goldImage, goldDepositLayer);

	if (isVersionAtLeast("1-18")) {
		applyDepositMappingToLayer(goldImage, deepslateGoldDepositLayer);
	}

	var ironImage = loadTileImage('iron');
	applyDepositMappingToLayer(ironImage, ironDepositLayer);

	if (isVersionAtLeast("1-18")) {
		applyDepositMappingToLayer(ironImage, deepslateIronDepositLayer);
	}

	if ((isVersionAtLeast("1-16")) && settingsNetherite === "True") {
		var netheriteImage = loadTileImage('netherite');
		applyDepositMappingToLayer(netheriteImage, netheriteDepositLayer);
	}

	var quartzImage = loadTileImage('quartz');
	applyDepositMappingToLayer(quartzImage, quartzDepositLayer);

	var redstoneImage = loadTileImage('redstone');
	applyDepositMappingToLayer(redstoneImage, redstoneDepositLayer);

	if (isVersionAtLeast("1-18")) {
		applyDepositMappingToLayer(redstoneImage, deepslateRedstoneDepositLayer);
	}

	if (isVersionAtLeast("1-17")) {

		var copperImage = loadTileImage('copper');
		applyDepositMappingToLayer(copperImage, copperDepositLayer);

		if (isVersionAtLeast("1-18")) {
			applyDepositMappingToLayer(copperImage, deepslateCopperDepositLayer);
		}

	}

	if (mod_Create === "True") {

		var mod_Create_zincImage = loadTileImage('zinc');
		var mod_Create_zincDepositLayer = loadLayerFromFile('wpscript/ores/mods/create_zinc_deposit.layer');
		var mod_Create_deepslateZincDepositLayer = loadLayerFromFile('wpscript/ores/mods/create_zinc_deposit_deepslate.layer');

		applyDepositMappingToLayer(mod_Create_zincImage, mod_Create_zincDepositLayer);

		if (isVersionAtLeast("1-18")) {
			applyDepositMappingToLayer(mod_Create_zincImage, mod_Create_deepslateZincDepositLayer);
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
