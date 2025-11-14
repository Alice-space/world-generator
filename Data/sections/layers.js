//layers
if (true) {

	var frostLayer = loadNamedLayer("Frost");
	var swampLayer = loadNamedLayer('Swamp');
	var biomesLayer = loadNamedLayer("Biomes");
	var cavesLayer = loadNamedLayer("Caves");
	var cavernsLayer = loadNamedLayer("Caverns");
	var chasmsLayer = loadNamedLayer("Chasms");
	var populateLayer = loadNamedLayer("Populate");

	var riverLayer = loadLayerFromFile('wpscript/layer/river.layer');
	var glacierLayer = loadLayerFromFile('wpscript/layer/glacier.layer');
	var swampTerrain = loadLayerFromFile('wpscript/layer/swamp.layer');

	if (isVersionAtLeast("1-19")) {
		var mangroveTerrain = loadLayerFromFile('wpscript/layer/mangroves_floor.layer');
		var mangroveLayer = loadLayerFromFile('wpscript/schematics/mangroves.layer');
	}

	if (settingsMapVersion === "1-20") {
		var cherryBlossumTreesLayer = loadLayerFromFile('wpscript/schematics/cherry_blossum_trees.layer');
	}

	var mixedLayer = isVersionAtLeast("1-16")
		? loadLayerFromFile('wpscript/layer/mixed.layer')
		: loadLayerFromFile('wpscript/layer/mixed_reduced.layer');

	var acaciaLayer = loadLayerFromFile('wpscript/layer/acacia.layer');
	var shrubsLayer = loadLayerFromFile('wpscript/layer/shrubs.layer');
	var shrubsLayerWithCactuses = loadLayerFromFile('wpscript/layer/shrubs_cactuses.layer');

	var herbsLayer = isVersionAtLeast("1-16")
		? loadCropSensitiveLayer('wpscript/layer/herbs.layer', 'wpscript/layer/herbs_without_crops.layer')
		: loadCropSensitiveLayer('wpscript/layer/herbs_reduced.layer', 'wpscript/layer/herbs_reduced_without_crops.layer');

	var grassLayer = loadLayerFromFile('wpscript/layer/grass.layer');

	var bigRoadLayer = loadLayerFromFile('wpscript/roads/big_road.layer');
	var middleRoadLayer = isVersionOneOf(["1-12", "1-16"])
		? loadLayerFromFile('wpscript/roads/middle_road_old.layer')
		: loadLayerFromFile('wpscript/roads/middle_road.layer');
	var bigRoadBridge1Layer = loadLayerFromFile('wpscript/roads/big_road_bridge_1.layer');
	var middleRoadBridge1Layer = loadLayerFromFile('wpscript/roads/middle_road_bridge_1.layer');
	var bigRoadBridge2Layer = loadLayerFromFile('wpscript/roads/big_road_bridge_2.layer');
	var middleRoadBridge2Layer = loadLayerFromFile('wpscript/roads/middle_road_bridge_2.layer');
	var bigRoadBridge3Layer = loadLayerFromFile('wpscript/roads/big_road_bridge_3.layer');
	var middleRoadBridge3Layer = loadLayerFromFile('wpscript/roads/middle_road_bridge_3.layer');

	var farmDirtLayer = loadLayerFromFile('wpscript/farm/farm_dirt.layer');
	var farmWheatLayer = loadLayerFromFile('wpscript/farm/farm_wheat.layer');
	var farmPotatoesLayer = loadLayerFromFile('wpscript/farm/farm_potatoes.layer');
	var farmCarrotsLayer = loadLayerFromFile('wpscript/farm/farm_carrots.layer');
	var farmBeetrootLayer = loadLayerFromFile('wpscript/farm/farm_beetroot.layer');
	var berryBushesLayer = loadLayerFromFile('wpscript/layer/berry_bushes.layer');
	var quarryLayer = loadLayerFromFile('wpscript/layer/quarry.layer');

	var borderLayer = loadLayerFromFile('wpscript/layer/border.layer');

	var spruceLayer = isVersionAtLeast("1-16")
		? loadLayerFromFile('wpscript/layer/spruce.layer')
		: loadLayerFromFile('wpscript/layer/spruce_reduced.layer');

	var deciduousLayer = isVersionAtLeast("1-16")
		? loadLayerFromFile('wpscript/layer/deciduous.layer')
		: loadLayerFromFile('wpscript/layer/deciduous_reduced.layer');
	var evergreenLayer = isVersionAtLeast("1-16")
		? loadLayerFromFile('wpscript/layer/jungle_bamboo.layer')
		: loadLayerFromFile('wpscript/layer/jungle.layer');
	var smallTreeEvergreenLayer = isVersionAtLeast("1-16")
		? loadLayerFromFile('wpscript/layer/jungle_bamboo_only_small.layer')
		: loadLayerFromFile('wpscript/layer/jungle_only_small.layer');

	var water1deep = loadLayerFromFile('wpscript/layer/water/water1deep.layer');
	var water2deep = loadLayerFromFile('wpscript/layer/water/water2deep.layer');
	var water3deep = loadLayerFromFile('wpscript/layer/water/water3deep.layer');
	var water4deep = loadLayerFromFile('wpscript/layer/water/water4deep.layer');
	var water5deep = loadLayerFromFile('wpscript/layer/water/water5deep.layer');

	var snow1deep = loadLayerFromFile('wpscript/layer/snow/snow1deep.layer');
	var snow2deep = loadLayerFromFile('wpscript/layer/snow/snow2deep.layer');
	var snow3deep = loadLayerFromFile('wpscript/layer/snow/snow3deep.layer');
	var snow4deep = loadLayerFromFile('wpscript/layer/snow/snow4deep.layer');
	var snow5deep = loadLayerFromFile('wpscript/layer/snow/snow5deep.layer');
	var snow6deep = loadLayerFromFile('wpscript/layer/snow/snow6deep.layer');
	var snow7deep = loadLayerFromFile('wpscript/layer/snow/snow7deep.layer');
	var snow8deep = loadLayerFromFile('wpscript/layer/snow/snow8deep.layer');
	var snowBlock = loadLayerFromFile('wpscript/layer/snow/snow_block.layer');

	var oceanLayer = loadLayerFromFile('wpscript/ocean/ocean_reduced.layer');
	var deepOceanLayer = loadLayerFromFile('wpscript/ocean/deep_ocean_reduced.layer');
	var coldOceanLayer = loadLayerFromFile('wpscript/ocean/cold_ocean_reduced.layer');
	var deepColdOceanLayer = loadLayerFromFile('wpscript/ocean/deep_cold_ocean_reduced.layer');

	if (isVersionAtLeast("1-16")) {
		var oceanLayer = loadLayerFromFile('wpscript/ocean/ocean.layer');
		var deepOceanLayer = loadLayerFromFile('wpscript/ocean/deep_ocean.layer');
		var coldOceanLayer = loadLayerFromFile('wpscript/ocean/cold_ocean.layer');
		var deepColdOceanLayer = loadLayerFromFile('wpscript/ocean/deep_cold_ocean.layer');
	}

	var lukewarmOceanLayer = loadLayerFromFile('wpscript/ocean/lukewarm_ocean.layer');
	var deepLukewarmOceanLayer = loadLayerFromFile('wpscript/ocean/deep_lukewarm_ocean.layer');
	var warmOceanLayer = loadLayerFromFile('wpscript/ocean/warm_ocean.layer');
	var warmOceanLayerWithoutCoral = loadLayerFromFile('wpscript/ocean/warm_ocean_nocoral.layer');

	var oceanTempImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_ocean_temp.png').go();
	var coralsImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_corals.png').go();
	var latitudeImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_latitude.png').go();
	var longitudeImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_longitude.png').go();

	var plainsLayer = loadLayerFromFile('wpscript/layer/temporary/plains.layer');
	var desertLayer = loadLayerFromFile('wpscript/layer/temporary/desert.layer');
	var savannahLayer = loadLayerFromFile('wpscript/layer/temporary/savannah.layer');
	var tundraLayer = loadLayerFromFile('wpscript/layer/temporary/tundra.layer');
	var jungleLayer = loadLayerFromFile('wpscript/layer/temporary/jungle.layer');
	var halfetiRose = loadLayerFromFile('wpscript/layer/halfeti-rose.layer');

	var volcanoBorderLayer = isVersionAtLeast("1-16")
		? loadLayerFromFile('wpscript/layer/volcano_blackstone_border.layer')
		: loadLayerFromFile('wpscript/layer/volcano_obsidian_border.layer');

	var endPortalLayer = loadLayerFromFile('wpscript/schematics/end_portal.layer');
	var mobSpawnerLayer = loadLayerFromFile('wpscript/schematics/water_mob_spawners.layer');
	var animalSpawnerLayer = loadLayerFromFile('wpscript/schematics/animal_spawners_reduced.layer');
	if (isVersionAtLeast("1-18")) {
		mobSpawnerLayer = loadLayerFromFile('wpscript/schematics/new_water_mob_spawners.layer');
		animalSpawnerLayer = loadLayerFromFile('wpscript/schematics/new_animal_spawners.layer');
	} else if (isVersionBetween("1-16", "1-17")) {
		animalSpawnerLayer = loadLayerFromFile('wpscript/schematics/animal_spawners.layer');
	}
	var eastereggCreatorLayer = loadLayerFromFile('wpscript/schematics/easter_egg_creator.layer');

	var coalOreLayer = loadLayerFromFile('wpscript/ores/coal_ore.layer');
	var coalDepositLayer = loadLayerFromFile('wpscript/ores/coal_deposit.layer');
	var diamondOreLayer = loadLayerFromFile('wpscript/ores/diamond_ore.layer');
	var diamondDepositLayer = loadLayerFromFile('wpscript/ores/diamond_deposit.layer');
	var emeraldOreLayer = loadLayerFromFile('wpscript/ores/emerald_ore.layer');
	var goldDepositLayer = loadLayerFromFile('wpscript/ores/gold_deposit.layer');
	var goldOreLayer = loadLayerFromFile('wpscript/ores/gold_ore.layer');
	var ironDepositLayer = loadLayerFromFile('wpscript/ores/iron_deposit.layer');
	var ironOreLayer = loadLayerFromFile('wpscript/ores/iron_ore.layer');
	var lapisOreLayer = loadLayerFromFile('wpscript/ores/lapis_ore.layer');
	var redstoneOreLayer = loadLayerFromFile('wpscript/ores/redstone_ore.layer');
	var redstoneDepositLayer = loadLayerFromFile('wpscript/ores/redstone_deposit.layer');

	if (isVersionAtLeast("1-18")) {
		var deepslateCopperOreLayer = loadLayerFromFile('wpscript/ores/copper_ore_deepslate.layer');
		var deepslateCopperDepositLayer = loadLayerFromFile('wpscript/ores/copper_deposit_deepslate.layer');
		var deepslateDiamondOreLayer = loadLayerFromFile('wpscript/ores/diamond_ore_deepslate.layer');
		var deepslateDiamondDepositLayer = loadLayerFromFile('wpscript/ores/diamond_deposit_deepslate.layer');
		var deepslateEmeraldOreLayer = loadLayerFromFile('wpscript/ores/emerald_ore_deepslate.layer');
		var deepslateGoldDepositLayer = loadLayerFromFile('wpscript/ores/gold_deposit_deepslate.layer');
		var deepslateGoldOreLayer = loadLayerFromFile('wpscript/ores/gold_ore_deepslate.layer');
		var deepslateIronDepositLayer = loadLayerFromFile('wpscript/ores/iron_deposit_deepslate.layer');
		var deepslateIronOreLayer = loadLayerFromFile('wpscript/ores/iron_ore_deepslate.layer');
		var deepslateLapisOreLayer = loadLayerFromFile('wpscript/ores/lapis_ore_deepslate.layer');
		var deepslateRedstoneOreLayer = loadLayerFromFile('wpscript/ores/redstone_ore_deepslate.layer');
		var deepslateRedstoneDepositLayer = loadLayerFromFile('wpscript/ores/redstone_deposit_deepslate.layer');
		var clayDepositLayer = loadLayerFromFile('wpscript/ores/clay_deposit.layer');
		var quartzBlockLayer = loadLayerFromFile('wpscript/ores/quartz_block.layer');
		var quartzDepositLayer = loadLayerFromFile('wpscript/ores/quartz_deposit.layer');
		var clayDepositLayer = loadLayerFromFile('wpscript/ores/clay_deposit.layer');
		var dirtDepositLayer = loadLayerFromFile('wpscript/ores/dirt_deposit.layer');
		var gravelDepositLayer = loadLayerFromFile('wpscript/ores/gravel_deposit.layer');
		var redSandDepositLayer = loadLayerFromFile('wpscript/ores/red_sand_deposit.layer');
		var sandDepositLayer = loadLayerFromFile('wpscript/ores/sand_deposit.layer');
		var andesiteDepositLayer = loadLayerFromFile('wpscript/ores/andesite_deposit.layer');
		var dioriteDepositLayer = loadLayerFromFile('wpscript/ores/diorite_deposit.layer');
		var graniteDepositLayer = loadLayerFromFile('wpscript/ores/granite_deposit.layer');
		var undergroundLavaLayer = loadLayerFromFile('wpscript/ores/underground_lava.layer');
		var undergroundLavaLakeLayer = loadLayerFromFile('wpscript/ores/lava_lake.layer');
		var undergroundWaterLayer = loadLayerFromFile('wpscript/ores/underground_water.layer');
	} else {
		var clayDepositLayer = loadLayerFromFile('wpscript/ores/clay_deposit_reduced.layer');
		var quartzBlockLayer = loadLayerFromFile('wpscript/ores/quartz_block_reduced.layer');
		var quartzDepositLayer = loadLayerFromFile('wpscript/ores/quartz_deposit_reduced.layer');
		var clayDepositLayer = loadLayerFromFile('wpscript/ores/clay_deposit_reduced.layer');
		var dirtDepositLayer = loadLayerFromFile('wpscript/ores/dirt_deposit_reduced.layer');
		var gravelDepositLayer = loadLayerFromFile('wpscript/ores/gravel_deposit_reduced.layer');
		var redSandDepositLayer = loadLayerFromFile('wpscript/ores/red_sand_deposit_reduced.layer');
		var sandDepositLayer = loadLayerFromFile('wpscript/ores/sand_deposit_reduced.layer');
		var andesiteDepositLayer = loadLayerFromFile('wpscript/ores/andesite_deposit_reduced.layer');
		var dioriteDepositLayer = loadLayerFromFile('wpscript/ores/diorite_deposit_reduced.layer');
		var graniteDepositLayer = loadLayerFromFile('wpscript/ores/granite_deposit_reduced.layer');
		var undergroundLavaLayer = loadLayerFromFile('wpscript/ores/underground_lava_reduced.layer');
		var undergroundLavaLakeLayer = loadLayerFromFile('wpscript/ores/lava_lake_reduced.layer');
		var undergroundWaterLayer = loadLayerFromFile('wpscript/ores/underground_water_reduced.layer');
	}

	if (isVersionAtLeast("1-16")) {
		var netheriteDepositLayer = loadLayerFromFile('wpscript/ores/netherite_deposit.layer');
	}
	if (isVersionAtLeast("1-17")) {
		var tuffDepositLayer = loadLayerFromFile('wpscript/ores/tuff_deposit.layer');
		var dripstoneDepositLayer = loadLayerFromFile('wpscript/ores/dripstone_deposit.layer');
		var copperOreLayer = loadLayerFromFile('wpscript/ores/copper_ore.layer');
		var copperDepositLayer = loadLayerFromFile('wpscript/ores/copper_deposit.layer');
		var dripleafsLayer = loadLayerFromFile('wpscript/schematics/dripleafs.layer');
		var amethystGeodesLayer = loadLayerFromFile('wpscript/schematics/amethyst_geodes.layer');
	}

	var bathymetryImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_bathymetry.png').go();

	var road = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_road.png').go();

	var waterImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_water.png').go();
	var streamImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_stream.png').go();
	var riverImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_river.png').go();
	var wetImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_wet.png').go();

	var landuse = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_landuse.png').go();

	var borderImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_border.png').go();

	print("images imported");

}

