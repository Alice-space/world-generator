// vanilla ores
// Requires: lib/utils.js (applyLayerToWorld)
if (settingsVanillaPopulation === "False") {

	// Base ore layers (all versions)
	applyLayerToWorld(coalOreLayer, oreModifier);
	applyLayerToWorld(diamondOreLayer, oreModifier);
	applyLayerToWorld(emeraldOreLayer, oreModifier);
	applyLayerToWorld(goldOreLayer, oreModifier);
	applyLayerToWorld(ironOreLayer, oreModifier);
	applyLayerToWorld(lapisOreLayer, oreModifier);
	applyLayerToWorld(quartzBlockLayer, oreModifier);
	applyLayerToWorld(redstoneOreLayer, oreModifier);
	applyLayerToWorld(clayDepositLayer, oreModifier);
	applyLayerToWorld(dirtDepositLayer, oreModifier);
	applyLayerToWorld(gravelDepositLayer, oreModifier);
	applyLayerToWorld(undergroundLavaLayer, oreModifier);
	applyLayerToWorld(redSandDepositLayer, oreModifier);
	applyLayerToWorld(sandDepositLayer, oreModifier);
	applyLayerToWorld(undergroundWaterLayer, oreModifier);
	applyLayerToWorld(undergroundLavaLakeLayer, oreModifier);
	applyLayerToWorld(andesiteDepositLayer, oreModifier);
	applyLayerToWorld(dioriteDepositLayer, oreModifier);
	applyLayerToWorld(graniteDepositLayer, oreModifier);

	if (isVersionAtLeast("1-17")) {
		applyLayerToWorld(tuffDepositLayer, oreModifier);
		applyLayerToWorld(dripstoneDepositLayer, oreModifier);
		applyLayerToWorld(copperOreLayer, oreModifier);
	}

	if (isVersionAtLeast("1-18")) {
		applyLayerToWorld(deepslateDiamondOreLayer, oreModifier);
		applyLayerToWorld(deepslateEmeraldOreLayer, oreModifier);
		applyLayerToWorld(deepslateGoldOreLayer, oreModifier);
		applyLayerToWorld(deepslateIronOreLayer, oreModifier);
		applyLayerToWorld(deepslateCopperOreLayer, oreModifier);
		applyLayerToWorld(deepslateLapisOreLayer, oreModifier);
		applyLayerToWorld(deepslateRedstoneOreLayer, oreModifier);
	}

	if (mod_Create === "True") {

		var mod_Create_zincOreLayer = loadLayerFromFile('wpscript/ores/mods/create_zinc_ore.layer');
		var mod_Create_deepslateZincOreLayer = loadLayerFromFile('wpscript/ores/mods/create_zinc_ore_deepslate.layer');
		var mod_Create_veridium = loadLayerFromFile('wpscript/ores/mods/create_veridium.layer');
		var mod_Create_crimsite = loadLayerFromFile('wpscript/ores/mods/create_crimsite.layer');
		var mod_Create_limestone = loadLayerFromFile('wpscript/ores/mods/create_limestone.layer');

		applyLayerToWorld(mod_Create_zincOreLayer, oreModifier);
		applyLayerToWorld(mod_Create_veridium, oreModifier);
		applyLayerToWorld(mod_Create_crimsite, oreModifier);
		applyLayerToWorld(mod_Create_limestone, oreModifier);

		if (isVersionAtLeast("1-18")) {
			applyLayerToWorld(mod_Create_deepslateZincOreLayer, oreModifier);
		}

	}

}
