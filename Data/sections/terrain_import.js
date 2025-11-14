//terrain import (important! after the world was created)
if (true) {

	var terrain = wp.getTerrain().fromFile(path + 'wpscript/terrain/ice.terrain').go();
	var iceTerrain = wp.installCustomTerrain(terrain).toWorld(world).inSlot(1).go(); //Slot 1 = 47 see Documentation
	var terrain = wp.getTerrain().fromFile(path + 'wpscript/terrain/gray_concrete.terrain').go();
	var greyConcreteTerrain = wp.installCustomTerrain(terrain).toWorld(world).inSlot(2).go(); //Slot 2 = 48 see Documentation
	var terrain = wp.getTerrain().fromFile(path + 'wpscript/terrain/jungle_steep.terrain').go();
	var jungleSteepTerrain = wp.installCustomTerrain(terrain).toWorld(world).inSlot(3).go(); //Slot 3 = 49 see Documentation
	if (isVersionAtLeast("1-17")) {
		var terrain = wp.getTerrain().fromFile(path + 'wpscript/terrain/snow_powder_snow.terrain').go();
		var importedPowderSnowTerrain = wp.installCustomTerrain(terrain).toWorld(world).inSlot(5).go(); //Slot 5 = 51 see Documentation
	}
	if (settingsVanillaPopulation === "False") {
		var grassTerrain = 0;
	} else {
		var grassTerrain = 1;
	}
	if (isVersionAtLeast("1-17")) {
		var snowTerrain = 51;
		var mossTerrain = 160; //moss
	} else {
		var snowTerrain = 40; //deep_snow
		var mossTerrain = grassTerrain; //grass
	}
	if (isVersionAtLeast("1-19")) {
		var mudTerrain = 158;
	} else {
		var mudTerrain = 3; //coarse dirt
	}

}

