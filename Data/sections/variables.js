//variables
if (true) {

	//current biomes
	var BIOME_OCEAN = 0;
	var BIOME_PLAINS = 1;
	var BIOME_DESERT = 2;
	var BIOME_WINDSWEPT_HILLS = 3;
	//var BIOME_MOUNTAINS = 3; //name before 1.18
	//var BIOME_EXTREME_HILLS = 3; //name before 1.13
	var BIOME_FOREST = 4;
	var BIOME_TAIGA = 5;
	var BIOME_SWAMP = 6;
	//var BIOME_SWAMPLAND = 6;//name before 1.13
	var BIOME_RIVER = 7;
	//var BIOME_NETHER_WASTES = 8; //other dimension
	//var BIOME_HELL = 8; //name before 1.13
	//var BIOME_THE_END = 9; //other  dimension
	//var BIOME_SKY = 9; //name before 1.13

	var BIOME_FROZEN_OCEAN = 10;
	var BIOME_FROZEN_RIVER = 11;
	var BIOME_SNOWY_PLAINS = 12;
	//var BIOME_ICE_PLAINS = 12; //name before 1.18
	//var BIOME_SNOWY_TUNDRA = 12; //name before 1.13
	var BIOME_SNOWY_MOUNTAINS = 13;
	//var BIOME_ICE_MOUNTAINS = 13; //name before 1.13
	//var BIOME_MUSHROOM_ISLAND = 14; //no real life equivalent
	//var BIOME_MUSHROOM_FIELDS = 14; //name before 1.18
	//var BIOME_MUSHROOM_ISLAND_SHORE = 15; //no real life equivalant
	//var BIOME_MUSHROOM_FIELD_SHORE = 15; //name before 1.18
	var BIOME_BEACH = 16;
	//var BIOME_DESERT_HILLS = 17; //removed in 1.18
	//var BIOME_WOODED_HILLS = 18; //removed in 1.18
	//var BIOME_FOREST_HILLS = 18; //name before 1.13
	//var BIOME_TAIGA_HILLS = 19; //removed in 1.18

	var BIOME_MOUNTAIN_EDGE = 20;
	//var BIOME_EXTREME_HILLS_EDGE = 20; //name before 1.13
	var BIOME_JUNGLE = 21;
	//var BIOME_JUNGLE_HILLS = 22; //removed in 1.18
	var BIOME_SPARSE_JUNGLE = 23;
	//var BIOME_JUNGLE_EDGE = 23; //name before 1.18
	var BIOME_DEEP_OCEAN = 24;
	var BIOME_STONY_SHORE = 25;
	//var BIOME_STONE_SHORE = 25; //name before 1.18
	//var BIOME_STONE_BEACH = 25; //name before 1.13
	var BIOME_COLD_BEACH = 26;
	//var BIOME_SNOWY_BEACH = 26; //name before 1.18
	var BIOME_BIRCH_FOREST = 27;
	//var BIOME_BIRCH_FOREST_HILLS = 28; //removed in 1.18
	var BIOME_DARK_FOREST = 29;
	//var BIOME_ROOFED_FOREST = 29; //name before 1.13

	var BIOME_SNOWY_TAIGA = 30;
	//var BIOME_COLD_TAIGA = 30; //name before 1.13
	//var BIOME_SNOWY_TAIGA_HILLS = 31; //removed in 1.18
	//var BIOME_COLD_TAIGA_HILLS = 31; //name before 1.13
	var BIOME_OLD_GROWTH_PINE_TAIGA = 32;
	//var BIOME_GIANT_TREE_TAIGA = 32; //name before 1.18
	//var BIOME_MEGA_TAIGA = 32; //name before 1.13
	//var BIOME_GIANT_TREE_TAIGA_HILLS = 33; //removed in 1.18
	//var BIOME_MEGA_TAIGA_HILLS = 33; //name before 1.13
	var BIOME_WINDSWEPT_FOREST = 34;
	//var BIOME_WOODED_MOUNTAINS = 34; //name before 1.18
	//var BIOME_EXTREME_HILLS_PLUS = 34; //name before 1.13
	var BIOME_SAVANNA = 35;
	//var BIOME_SAVANNA_PLATEAU = 36; //removed in 1.18
	var BIOME_BADLANDS = 37;
	//var BIOME_MESA = 37;  //name before 1.13
	var BIOME_WOODED_BADLANDS = 38;
	//var BIOME_WOODED_BADLANDS_PLATEAU = 38; //name before 1.18
	//var BIOME_MESA_PLATEAU_F = 38; //name before 1.13
	//var BIOME_BADLANDS_PLATEAU = 39; //removed in 1.18
	//var BIOME_MESA_PLATEAU = 39; //name before 1.13

	//var BIOME_SMALL_END_ISLANDS = 40; //other dimension
	//var BIOME_END_MIDLANDS = 41; //other dimension
	//var BIOME_END_HIGHLANDS = 42; //other dimension
	//var BIOME_END_BARRENS = 43; //other dimension
	var BIOME_WARM_OCEAN = 44; //new in 1.13
	var BIOME_LUKEWARM_OCEAN = 45; //new in 1.13
	var BIOME_COLD_OCEAN = 46; //new in 1.13
	var BIOME_DEEP_WARM_OCEAN = 47; //new in 1.13
	var BIOME_DEEP_LUKEWARM_OCEAN = 48; //new in 1.13
	var BIOME_DEEP_COLD_OCEAN = 49; //new in 1.13
	var BIOME_DEEP_FROZEN_OCEAN = 50; //new in 1.13

	var BIOME_THE_VOID = 127;

	var BIOME_SUNFLOWER_PLAINS = 129;
	var BIOME_DESERT_LAKES = 130;
	//var BIOME_DESERT_M = 130; //name before 1.13
	var BIOME_WINDSWEPT_GRAVELLY_HILLS = 131;
	//var BIOME_GRAVELLY_MOUNTAINS = 131; //name before 1.18
	//var BIOME_EXTREME_HILLS_M = 131; //name before 1.13
	var BIOME_FLOWER_FOREST = 132;
	var BIOME_TAIGA_MOUNTAINS = 133;
	//var BIOME_TAIGA_M = 133; //name before 1.13
	//var BIOME_SWAMP_HILLS = 134; //removed in 1.18
	//var BIOME_SWAMPLAND_M = 134; //name before 1.13

	var BIOME_ICE_SPIKES = 140;
	//var BIOME_ICE_PLAINS_SPIKES = 140; //name before 1.13
	//var BIOME_ICE_MOUNTAINS_SPIKES = 141; //removed in 1.18
	//var BIOME_MODIFIED_JUNGLE = 149; //removed in 1.18
	//var BIOME_JUNGLE_M = 149; //name before 1.13

	//var BIOME_MODIFIED_JUNGLE_EDGE = 151; //removed in 1.18
	//var BIOME_JUNGLE_EDGE_M = 151; //name before 1.13
	var BIOME_OLD_GROWTH_BIRCH_FOREST = 155;
	//var BIOME_TALL_BIRCH_FOREST = 155; //name before 1.18
	//var BIOME_BIRCH_FOREST_M = 155; //name before 1.13
	//var BIOME_TALL_BIRCH_HILLS = 156; //removed in 1.18
	//var BIOME_BIRCH_FOREST_HILLS_M = 156; //name before 1.13
	//var BIOME_DARK_FOREST_HILLS = 157; //removed in 1.18
	//var BIOME_ROOFED_FOREST_M = 157; //name before 1.13
	var BIOME_SNOWY_TAIGA_MOUNTAINS = 158;
	//var BIOME_COLD_TAIGA_M = 158; //name before 1.13

	var BIOME_OLD_GROWTH_SPRUCE_TAIGA = 160;
	//var BIOME_GIANT_SPRUCE_TAIGA = 160; //name before 1.18
	//var BIOME_MEGA_SPRUCE_TAIGA = 160; //name before 1.13
	var BIOME_GIANT_SPRUCE_TAIGA_HILLS = 161;
	//var BIOME_MEGA_SPRUCE_TAIGA_HILLS = 161; //name before 1.13
	var BIOME_MODIFIED_GRAVELLY_MOUNTAINS = 162;
	//var BIOME_EXTREME_HILLS_PLUS_M = 162; //name before 1.13
	var BIOME_WINDSWEPT_SAVANNA = 163;
	//var BIOME_SHATTERED_SAVANNA = 163; //name before 1.18
	//var BIOME_SAVANNA_M = 163; //name before 1.13
	//var BIOME_WINDSWEPT_SAVANNA = 164; //removed in 1.18
	//var BIOME_SAVANNA_PLATEAU_M = 164; //name before 1.13
	var BIOME_ERODED_BADLANDS = 165;
	//var BIOME_MESA_BRYCE = 165; //name before 1.18
	//var BIOME_MESA_PLATEAU_F_M = 166; //name before 1.13
	//var BIOME_MODIFIED_WOODED_BADLANDS_PLATEAU = 166; //removed in 1.18
	//var BIOME_MODIFIED_BADLANDS_PLATEAU = 167; //removed in 1.18
	//var BIOME_MESA_PLATEAU_M = 167; //name before 1.13
	var BIOME_BAMBOO_JUNGLE = 168;
	//var BIOME_BAMBOO_JUNGLE_HILLS = 169;//removed in 1.18

	//var BIOME_SOUL_SAND_VALLEY = 170; //new in 1.17 //other dimension
	//var BIOME_CRIMSON_FOREST = 171; //new in 1.17 //other dimension
	//var BIOME_WARPED_FOREST = 172; //new in 1.17 //other dimension
	//var BIOME_BASALT_DELTAS = 173; //new in 1.17 //other dimension
	//var BIOME_DRIPSTONE_CAVES = 174; //new in 1.18 //no 3D biomes
	//var BIOME_LUSH_CAVES = 175; //new in 1.18 //no 3D biomes

	var BIOME_CHERRY_GROVE = 246; //new in 1.20

	var BIOME_MANGROVE_SWAMP = 247; //new in 1.19
	//var BIOME_DEEP_DARK = 248; //new in 1.19 //no 3D biomes
	var BIOME_FROZEN_PEAKS = 249; //new in 1.18
	var BIOME_GROVE = 250; //new in 1.18
	var BIOME_JAGGED_PEAKS = 251; //new in 1.18
	var BIOME_MEADOW = 252; //new in 1.18
	var BIOME_SNOWY_SLOPES = 253; //new in 1.18
	var BIOME_STONY_PEAKS = 254; //new in 1.18

	//1.19 backwards compatibility
	if (settingsMapVersion === "1-19") {
		var BIOME_CHERRY_GROVE = BIOME_FOREST; //new in 1.20
	}

	//1.18 backwards compatibility
	if (settingsMapVersion === "1-18") {
		var BIOME_CHERRY_GROVE = BIOME_FOREST; //new in 1.20
		var BIOME_MANGROVE_SWAMP = BIOME_SWAMP; //new in 1.19
		//var BIOME_DEEP_DARK = 248; //new in 1.19
	}

	//1.17 backwards compatibility
	if (settingsMapVersion === "1-17") {
		var BIOME_CHERRY_GROVE = BIOME_FOREST; //new in 1.20
		var BIOME_MANGROVE_SWAMP = BIOME_SWAMP; //new in 1.19
		//var BIOME_DRIPSTONE_CAVES = 174; //new in 1.18 //no 3D biomes
		//var BIOME_LUSH_CAVES = 175; //new in 1.18 //no 3D biomes		
		var BIOME_FROZEN_PEAKS = BIOME_SNOWY_MOUNTAINS; //new in 1.18
		var BIOME_GROVE = BIOME_SNOWY_TAIGA; //new in 1.18
		var BIOME_JAGGED_PEAKS = BIOME_SNOWY_MOUNTAINS; //new in 1.18
		var BIOME_MEADOW = BIOME_PLAINS; //new in 1.18
		var BIOME_SNOWY_SLOPES = BIOME_SNOWY_MOUNTAINS; //new in 1.18
		var BIOME_STONY_PEAKS = BIOME_SNOWY_MOUNTAINS; //new in 1.18
	}

	//1.16 backwards compatibility
	if (settingsMapVersion === "1-16") {
		//var BIOME_SOUL_SAND_VALLEY = BIOME_NETHER_WASTES; //new in 1.17 //other dimension
		//var BIOME_CRIMSON_FOREST = BIOME_NETHER_WASTES; //new in 1.17 //other dimension
		//var BIOME_WARPED_FOREST = BIOME_NETHER_WASTES; //new in 1.17 //other dimension
		//var BIOME_BASALT_DELTAS = BIOME_NETHER_WASTES; //new in 1.17 //other dimension
		//var BIOME_DRIPSTONE_CAVES = 174; //new in 1.18 //no 3D biomes
		//var BIOME_LUSH_CAVES = 175; //new in 1.18 //no 3D biomes	
		var BIOME_CHERRY_GROVE = BIOME_FOREST; //new in 1.20	
		var BIOME_MANGROVE_SWAMP = BIOME_SWAMP; //new in 1.19
		//var BIOME_DEEP_DARK = 248; //new in 1.19
		var BIOME_FROZEN_PEAKS = BIOME_SNOWY_MOUNTAINS; //new in 1.18
		var BIOME_GROVE = BIOME_SNOWY_TAIGA; //new in 1.18
		var BIOME_JAGGED_PEAKS = BIOME_SNOWY_MOUNTAINS; //new in 1.18
		var BIOME_MEADOW = BIOME_PLAINS; //new in 1.18
		var BIOME_SNOWY_SLOPES = BIOME_SNOWY_MOUNTAINS; //new in 1.18
		var BIOME_STONY_PEAKS = BIOME_SNOWY_MOUNTAINS; //new in 1.18
	}

	//1.12 backwards compatibility
	if (settingsMapVersion === "1-12") {
		var BIOME_WARM_OCEAN = BIOME_OCEAN; //new in 1.13
		var BIOME_LUKEWARM_OCEAN = BIOME_OCEAN; //new in 1.13
		var BIOME_COLD_OCEAN = BIOME_OCEAN; //new in 1.13
		var BIOME_DEEP_WARM_OCEAN = BIOME_DEEP_OCEAN; //new in 1.13
		var BIOME_DEEP_LUKEWARM_OCEAN = BIOME_DEEP_OCEAN; //new in 1.13
		var BIOME_DEEP_COLD_OCEAN = BIOME_DEEP_OCEAN; //new in 1.13
		var BIOME_DEEP_FROZEN_OCEAN = BIOME_DEEP_OCEAN; //new in 1.13
		//var BIOME_SOUL_SAND_VALLEY = BIOME_NETHER_WASTES; //new in 1.17 //other dimension
		//var BIOME_CRIMSON_FOREST = BIOME_NETHER_WASTES; //new in 1.17 //other dimension
		//var BIOME_WARPED_FOREST = BIOME_NETHER_WASTES; //new in 1.17 //other dimension
		//var BIOME_BASALT_DELTAS = BIOME_NETHER_WASTES; //new in 1.17 //other dimension
		//var BIOME_DRIPSTONE_CAVES = 174; //new in 1.18 //no 3D biomes
		//var BIOME_LUSH_CAVES = 175; //new in 1.18 //no 3D biomes		
		var BIOME_CHERRY_GROVE = BIOME_FOREST; //new in 1.20
		var BIOME_MANGROVE_SWAMP = BIOME_SWAMP; //new in 1.19
		//var BIOME_DEEP_DARK = 248; //new in 1.19
		var BIOME_FROZEN_PEAKS = BIOME_SNOWY_MOUNTAINS; //new in 1.18
		var BIOME_GROVE = BIOME_SNOWY_TAIGA; //new in 1.18
		var BIOME_JAGGED_PEAKS = BIOME_SNOWY_MOUNTAINS; //new in 1.18
		var BIOME_MEADOW = BIOME_PLAINS; //new in 1.18
		var BIOME_SNOWY_SLOPES = BIOME_SNOWY_MOUNTAINS; //new in 1.18
		var BIOME_STONY_PEAKS = BIOME_SNOWY_MOUNTAINS; //new in 1.18
	}

}

