//climate
if (true) {

	var climateImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_climate.png').go();
	var ecoRegionImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/' + tile + '_ecoregions.png').go();

	if (biomeSource == "koeppen") {

		//base biomes
		wp.applyHeightMap(climateImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.applyToLayer(biomesLayer)
			.fromColour(0, 0, 255).toLevel(BIOME_JUNGLE) //Af 0000FF 
			.fromColour(0, 120, 255).toLevel(BIOME_SPARSE_JUNGLE) //Am 0078FF
			.fromColour(70, 170, 250).toLevel(BIOME_SAVANNA) //Aw 46AAFA
			.fromColour(255, 0, 0).toLevel(BIOME_DESERT) //BWh FF0000
			.fromColour(255, 150, 150).toLevel(BIOME_BADLANDS) //BWk FF9696
			.fromColour(245, 165, 0).toLevel(BIOME_SAVANNA) //BSh F5A500
			.fromColour(255, 220, 100).toLevel(BIOME_DESERT_LAKES) //BSk FFDC64
			.fromColour(255, 255, 0).toLevel(BIOME_SUNFLOWER_PLAINS) //Csa FFFF00
			.fromColour(200, 200, 0).toLevel(BIOME_PLAINS) //Csb C8C800
			.fromColour(150, 255, 150).toLevel(BIOME_PLAINS) //Cwa 96FF96
			.fromColour(100, 200, 100).toLevel(BIOME_PLAINS) //Cwb 64C864
			.fromColour(50, 150, 50).toLevel(BIOME_PLAINS) //Cwc 329632
			.fromColour(200, 255, 80).toLevel(BIOME_FLOWER_FOREST) //Cfa C8FF50
			.fromColour(100, 255, 80).toLevel(BIOME_FLOWER_FOREST) //Cfb 64FF50
			.fromColour(50, 200, 0).toLevel(BIOME_FLOWER_FOREST) //Cfc 32C800
			.fromColour(255, 0, 255).toLevel(BIOME_FOREST) //Dsa FF00FF
			.fromColour(200, 0, 200).toLevel(BIOME_FOREST) //Dsb C800C8
			.fromColour(150, 50, 150).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Dsc 963296
			.fromColour(150, 100, 150).toLevel(BIOME_TAIGA) //Dsd - taiga 966496
			.fromColour(170, 175, 255).toLevel(BIOME_PLAINS) //Dwa AAAFFF
			.fromColour(90, 120, 220).toLevel(BIOME_FOREST) //Dwb 5A78DC
			.fromColour(75, 80, 180).toLevel(BIOME_DARK_FOREST) //Dwc 4B50B4
			.fromColour(50, 0, 135).toLevel(BIOME_TAIGA) //Dwd - taiga 320087
			.fromColour(0, 255, 255).toLevel(BIOME_PLAINS) //Dfa 00FFFF
			.fromColour(55, 200, 255).toLevel(BIOME_FOREST) //Dfb 37C8FF
			.fromColour(0, 125, 125).toLevel(BIOME_TAIGA) //Dfc 007D7D
			.fromColour(0, 70, 95).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Dfd 00465F
			.fromColour(178, 178, 178).toLevel(BIOME_SNOWY_PLAINS) //ET B2B2B2
			.fromColour(102, 102, 102).toLevel(BIOME_SNOWY_PLAINS) //EF 666666
			.fromColour(255, 255, 255).toLevel(BIOME_BEACH) //Beach, gets later replaced by ocean 000000
			.go();

	} else if (biomeSource == "ecoregions") {

		wp.applyHeightMap(ecoRegionImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.applyToLayer(biomesLayer)
			.fromColour(255, 255, 255).toLevel(BIOME_BEACH) //Beach, gets later replaced by ocean 000000
			.go();

		//Insert custom biomes / modded biomes beginning here:

		var eco_vanilla = wp.applyHeightMap(ecoRegionImage)
			.toWorld(world)
			.shift(shiftLongitute, shiftLatitude)
			.applyToLayer(biomesLayer);

		eco_vanilla = eco_vanilla.fromColour(143, 206, 84).toLevel(BIOME_JUNGLE) //Admiralty Islands lowland rain forests
			.fromColour(234, 50, 112).toLevel(BIOME_SUNFLOWER_PLAINS) //Aegean and Western Turkey sclerophyllous and mixed forests
			.fromColour(57, 239, 142).toLevel(BIOME_DESERT) //Afghan Mountains semi-desert
			.fromColour(115, 209, 143).toLevel(BIOME_WINDSWEPT_SAVANNA) //Al Hajar montane woodlands
			.fromColour(19, 152, 214).toLevel(BIOME_SAVANNA) //Alai-Western Tian Shan steppe
			.fromColour(32, 212, 179).toLevel(BIOME_DESERT) //Alashan Plateau semi-desert
			.fromColour(102, 125, 227).toLevel(BIOME_TAIGA) //Alaska Peninsula montane taiga
			.fromColour(53, 231, 121).toLevel(BIOME_FROZEN_PEAKS) //Alaska-St. Elias Range tundra
			.fromColour(230, 97, 126).toLevel(BIOME_SAVANNA) //Albany thickets
			.fromColour(110, 211, 142).toLevel(BIOME_STONY_PEAKS) //Alberta Mountain forests
			.fromColour(203, 17, 181).toLevel(BIOME_TAIGA) //Alberta-British Columbia foothills forests
			.fromColour(24, 205, 199).toLevel(BIOME_BAMBOO_JUNGLE) //Albertine Rift montane forests
			.fromColour(94, 80, 201).toLevel(BIOME_BEACH) //Aldabra Island xeric scrub
			.fromColour(76, 205, 166).toLevel(BIOME_FROZEN_PEAKS) //Aleutian Islands tundra
			.fromColour(76, 204, 44).toLevel(BIOME_FOREST) //Allegheny Highlands forests
			.fromColour(227, 85, 108).toLevel(BIOME_WINDSWEPT_FOREST) //Alps conifer and mixed forests
			.fromColour(180, 141, 232).toLevel(BIOME_WINDSWEPT_HILLS) //Altai alpine meadow and tundra
			.fromColour(168, 74, 231).toLevel(BIOME_BADLANDS) //Altai montane forest and forest steppe
			.fromColour(206, 77, 74).toLevel(BIOME_SNOWY_PLAINS) //Altai steppe and semi-desert
			.fromColour(227, 137, 99).toLevel(BIOME_FOREST) //Alto Paraná Atlantic forests
			.fromColour(67, 224, 200).toLevel(BIOME_MANGROVE_SWAMP) //Amazon-Orinoco-Southern Caribbean mangroves
			.fromColour(223, 97, 213).toLevel(BIOME_SAVANNA) //Amsterdam and Saint-Paul Islands temperate grasslands
			.fromColour(202, 238, 118).toLevel(BIOME_PLAINS) //Amur meadow steppe
			.fromColour(234, 32, 136).toLevel(BIOME_WINDSWEPT_FOREST) //Anatolian conifer and deciduous mixed forests
			.fromColour(23, 191, 213).toLevel(BIOME_JUNGLE) //Andaman Islands rain forests
			.fromColour(118, 205, 102).toLevel(BIOME_SAVANNA) //Angolan Miombo woodlands
			.fromColour(33, 226, 49).toLevel(BIOME_FOREST) //Angolan montane forest-grassland mosaic
			.fromColour(206, 125, 101).toLevel(BIOME_WINDSWEPT_SAVANNA) //Angolan Mopane woodlands
			.fromColour(228, 48, 57).toLevel(BIOME_SAVANNA) //Angolan scarp savanna and woodlands
			.fromColour(76, 185, 225).toLevel(BIOME_SNOWY_SLOPES) //Antipodes Subantarctic Islands tundra
			.fromColour(215, 53, 236).toLevel(BIOME_FOREST) //Appalachian mixed mesophytic forests
			.fromColour(231, 132, 210).toLevel(BIOME_FOREST) //Appalachian-Blue Ridge forests
			.fromColour(224, 27, 152).toLevel(BIOME_WINDSWEPT_FOREST) //Appenine deciduous montane forests
			.fromColour(30, 237, 175).toLevel(BIOME_SPARSE_JUNGLE) //Apure-Villavicencio dry forests
			.fromColour(227, 64, 75).toLevel(BIOME_DESERT) //Arabian Desert and East Sahero-Arabian xeric shrublands
			.fromColour(14, 133, 212).toLevel(BIOME_BEACH) //Arabian Peninsula coastal fog desert
			.fromColour(55, 207, 121).toLevel(BIOME_JUNGLE) //Araucaria moist forests
			.fromColour(13, 223, 157).toLevel(BIOME_PLAINS) //Araya and Paria xeric scrub
			.fromColour(175, 121, 207).toLevel(BIOME_SNOWY_PLAINS) //Arctic coastal tundra
			.fromColour(91, 202, 60).toLevel(BIOME_SNOWY_PLAINS) //Arctic desert
			.fromColour(198, 96, 239).toLevel(BIOME_SNOWY_PLAINS) //Arctic foothills tundra
			.fromColour(218, 187, 29).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Arizona Mountains forests
			.fromColour(83, 81, 202).toLevel(BIOME_SAVANNA) //Arnhem Land tropical savanna
			.fromColour(217, 52, 104).toLevel(BIOME_JAGGED_PEAKS) //Ascension scrub and grasslands
			.fromColour(39, 212, 169).toLevel(BIOME_DESERT) //Atacama desert
			.fromColour(123, 152, 223).toLevel(BIOME_BEACH) //Atlantic Coast restingas
			.fromColour(104, 110, 216).toLevel(BIOME_BEACH) //Atlantic coastal desert
			.fromColour(239, 74, 49).toLevel(BIOME_TAIGA) //Atlantic coastal pine barrens
			.fromColour(18, 223, 80).toLevel(BIOME_SPARSE_JUNGLE) //Atlantic dry forests
			.fromColour(160, 24, 202).toLevel(BIOME_JUNGLE) //Atlantic Equatorial coastal forests
			.fromColour(75, 122, 224).toLevel(BIOME_SUNFLOWER_PLAINS) //Atlantic mixed forests
			.fromColour(226, 13, 198).toLevel(BIOME_GROVE) //Australian Alps montane grasslands
			.fromColour(220, 218, 87).toLevel(BIOME_DESERT) //Azerbaijan shrub desert and steppe
			.fromColour(203, 126, 55).toLevel(BIOME_FOREST) //Azores temperate mixed forests
			.fromColour(204, 236, 86).toLevel(BIOME_PLAINS) //Badghyz and Karabil semi-desert
			.fromColour(223, 98, 79).toLevel(BIOME_SNOWY_SLOPES) //Baffin coastal tundra
			.fromColour(64, 56, 205).toLevel(BIOME_TAIGA) //Bahamian pine mosaic
			.fromColour(202, 66, 21).toLevel(BIOME_MANGROVE_SWAMP) //Bahamian-Antillean mangroves
			.fromColour(124, 157, 206).toLevel(BIOME_JUNGLE) //Bahia coastal forests
			.fromColour(81, 27, 219).toLevel(BIOME_SPARSE_JUNGLE) //Bahia interior forests
			.fromColour(198, 208, 83).toLevel(BIOME_DESERT) //Baja California desert
			.fromColour(64, 219, 126).toLevel(BIOME_SPARSE_JUNGLE) //Bajío dry forests
			.fromColour(60, 208, 159).toLevel(BIOME_FOREST) //Balkan mixed forests
			.fromColour(214, 119, 189).toLevel(BIOME_SPARSE_JUNGLE); //Balsas dry forests

		eco_vanilla = eco_vanilla.fromColour(174, 211, 38).toLevel(BIOME_FLOWER_FOREST) //Baltic mixed forests
			.fromColour(59, 25, 232).toLevel(BIOME_DESERT) //Baluchistan xeric woodlands
			.fromColour(117, 236, 148).toLevel(BIOME_JUNGLE) //Banda Sea Islands moist deciduous forests
			.fromColour(158, 64, 225).toLevel(BIOME_FOREST) //Belizian pine forests
			.fromColour(219, 196, 95).toLevel(BIOME_SPARSE_JUNGLE) //Beni savanna
			.fromColour(138, 201, 56).toLevel(BIOME_SNOWY_PLAINS) //Bering tundra
			.fromColour(164, 213, 38).toLevel(BIOME_SNOWY_TAIGA) //Beringia lowland tundra
			.fromColour(214, 102, 171).toLevel(BIOME_SNOWY_PLAINS) //Beringia upland tundra
			.fromColour(236, 221, 16).toLevel(BIOME_BEACH) //Bermuda subtropical conifer forests
			.fromColour(97, 237, 66).toLevel(BIOME_JUNGLE) //Biak-Numfoor rain forests
			.fromColour(44, 232, 106).toLevel(BIOME_WOODED_BADLANDS) //Blue Mountains forests
			.fromColour(52, 231, 189).toLevel(BIOME_MEADOW) //Bohai Sea saline meadow
			.fromColour(165, 207, 114).toLevel(BIOME_SPARSE_JUNGLE) //Bolivian montane dry forests
			.fromColour(232, 235, 53).toLevel(BIOME_JUNGLE) //Bolivian Yungas
			.fromColour(92, 205, 150).toLevel(BIOME_JUNGLE) //Borneo lowland rain forests
			.fromColour(226, 147, 111).toLevel(BIOME_BAMBOO_JUNGLE) //Borneo montane rain forests
			.fromColour(108, 222, 214).toLevel(BIOME_SWAMP) //Borneo peat swamp forests
			.fromColour(218, 121, 51).toLevel(BIOME_SPARSE_JUNGLE) //Brahmaputra Valley semi-evergreen forests
			.fromColour(66, 201, 100).toLevel(BIOME_SAVANNA) //Brigalow tropical savanna
			.fromColour(137, 177, 230).toLevel(BIOME_OLD_GROWTH_SPRUCE_TAIGA) //British Columbia mainland coastal forests
			.fromColour(124, 214, 168).toLevel(BIOME_SNOWY_SLOPES) //Brooks-British Range tundra
			.fromColour(59, 15, 220).toLevel(BIOME_JUNGLE) //Buru rain forests
			.fromColour(130, 204, 120).toLevel(BIOME_SAVANNA) //Caatinga
			.fromColour(217, 23, 159).toLevel(BIOME_JUNGLE) //Caatinga Enclaves moist forests
			.fromColour(206, 75, 143).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Caledon conifer forests
			.fromColour(60, 167, 200).toLevel(BIOME_PLAINS) //California Central Valley grasslands
			.fromColour(61, 164, 224).toLevel(BIOME_SAVANNA) //California coastal sage and chaparral
			.fromColour(119, 95, 226).toLevel(BIOME_FOREST) //California interior chaparral and woodlands
			.fromColour(214, 80, 147).toLevel(BIOME_WINDSWEPT_SAVANNA) //California montane chaparral and woodlands
			.fromColour(197, 234, 122).toLevel(BIOME_BAMBOO_JUNGLE) //Cameroonian Highlands forests
			.fromColour(69, 208, 89).toLevel(BIOME_WINDSWEPT_SAVANNA) //Campos Rupestres montane savanna
			.fromColour(203, 187, 86).toLevel(BIOME_PLAINS) //Canadian Aspen forests and parklands
			.fromColour(130, 221, 224).toLevel(BIOME_WINDSWEPT_SAVANNA) //Canary Islands dry woodlands and forests
			.fromColour(138, 212, 85).toLevel(BIOME_FOREST) //Cantabrian mixed forests
			.fromColour(228, 67, 142).toLevel(BIOME_PLAINS) //Cantebury-Otago tussock grasslands
			.fromColour(54, 203, 236).toLevel(BIOME_SPARSE_JUNGLE) //Cape Verde Islands dry forests
			.fromColour(120, 240, 190).toLevel(BIOME_SPARSE_JUNGLE) //Cape York Peninsula tropical savanna
			.fromColour(106, 236, 223).toLevel(BIOME_JUNGLE) //Caqueta moist forests
			.fromColour(237, 222, 138).toLevel(BIOME_JUNGLE) //Cardamom Mountains rain forests
			.fromColour(93, 223, 201).toLevel(BIOME_PLAINS) //Caribbean shrublands
			.fromColour(107, 229, 123).toLevel(BIOME_BADLANDS) //Carnarvon xeric shrublands
			.fromColour(220, 106, 218).toLevel(BIOME_JUNGLE) //Carolines tropical moist forests
			.fromColour(210, 63, 190).toLevel(BIOME_FOREST) //Carpathian montane forests
			.fromColour(202, 63, 212).toLevel(BIOME_SAVANNA) //Carpentaria tropical savanna
			.fromColour(224, 125, 49).toLevel(BIOME_OLD_GROWTH_SPRUCE_TAIGA) //Cascade Mountains leeward forests
			.fromColour(77, 206, 150).toLevel(BIOME_FOREST) //Caspian Hyrcanian mixed forests
			.fromColour(194, 58, 212).toLevel(BIOME_DESERT) //Caspian lowland desert
			.fromColour(189, 213, 119).toLevel(BIOME_JUNGLE) //Catatumbo moist forests
			.fromColour(165, 105, 238).toLevel(BIOME_SPARSE_JUNGLE) //Cauca Valley dry forests
			.fromColour(232, 206, 59).toLevel(BIOME_JUNGLE) //Cauca Valley montane forests
			.fromColour(111, 235, 206).toLevel(BIOME_WINDSWEPT_FOREST) //Caucasus mixed forests
			.fromColour(226, 37, 229).toLevel(BIOME_JUNGLE) //Cayos Miskitos-San Andrés and Providencia moist forests
			.fromColour(41, 204, 87).toLevel(BIOME_FLOWER_FOREST) //Celtic broadleaf forests
			.fromColour(87, 19, 222).toLevel(BIOME_BADLANDS) //Central Afghan Mountains xeric woodlands
			.fromColour(37, 37, 218).toLevel(BIOME_MANGROVE_SWAMP) //Central African mangroves
			.fromColour(200, 38, 157).toLevel(BIOME_JUNGLE) //Central American Atlantic moist forests
			.fromColour(224, 135, 208).toLevel(BIOME_SPARSE_JUNGLE) //Central American dry forests
			.fromColour(235, 211, 57).toLevel(BIOME_FOREST) //Central American montane forests
			.fromColour(70, 229, 81).toLevel(BIOME_FOREST) //Central American pine-oak forests
			.fromColour(215, 35, 113).toLevel(BIOME_PLAINS) //Central Anatolian steppe
			.fromColour(73, 86, 233).toLevel(BIOME_PLAINS) //Central Anatolian steppe and woodlands
			.fromColour(231, 181, 55).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Central and Southern Cascades forests
			.fromColour(180, 209, 126).toLevel(BIOME_PLAINS) //Central and Southern mixed grasslands
			.fromColour(200, 85, 115).toLevel(BIOME_WINDSWEPT_GRAVELLY_HILLS); //Central Andean dry puna

		eco_vanilla = eco_vanilla.fromColour(211, 95, 199).toLevel(BIOME_DESERT) //Central Andean puna
			.fromColour(208, 217, 79).toLevel(BIOME_STONY_PEAKS) //Central Andean wet puna
			.fromColour(20, 200, 128).toLevel(BIOME_DESERT) //Central Asian northern desert
			.fromColour(212, 77, 124).toLevel(BIOME_PLAINS) //Central Asian riparian woodlands
			.fromColour(38, 49, 213).toLevel(BIOME_DESERT) //Central Asian southern desert
			.fromColour(227, 138, 233).toLevel(BIOME_TAIGA) //Central British Columbia Mountain forests
			.fromColour(207, 95, 117).toLevel(BIOME_TAIGA) //Central Canadian Shield forests
			.fromColour(40, 223, 116).toLevel(BIOME_FOREST) //Central China loess plateau mixed forests
			.fromColour(75, 226, 29).toLevel(BIOME_JUNGLE) //Central Congolian lowland forests
			.fromColour(222, 110, 143).toLevel(BIOME_FOREST) //Central Deccan Plateau dry deciduous forests
			.fromColour(202, 161, 112).toLevel(BIOME_FOREST) //Central European mixed forests
			.fromColour(27, 66, 223).toLevel(BIOME_PLAINS) //Central forest-grasslands transition
			.fromColour(170, 202, 53).toLevel(BIOME_SPARSE_JUNGLE) //Central Indochina dry forests
			.fromColour(61, 110, 234).toLevel(BIOME_FOREST) //Central Korean deciduous forests
			.fromColour(110, 29, 240).toLevel(BIOME_BADLANDS) //Central Mexican matorral
			.fromColour(102, 60, 240).toLevel(BIOME_OLD_GROWTH_SPRUCE_TAIGA) //Central Pacific coastal forests
			.fromColour(134, 85, 208).toLevel(BIOME_DESERT) //Central Persian desert basins
			.fromColour(157, 214, 77).toLevel(BIOME_JUNGLE) //Central Polynesian tropical moist forests
			.fromColour(236, 102, 122).toLevel(BIOME_JUNGLE) //Central Range montane rain forests
			.fromColour(172, 231, 120).toLevel(BIOME_WINDSWEPT_HILLS) //Central Range sub-alpine grasslands
			.fromColour(20, 237, 233).toLevel(BIOME_BADLANDS) //Central Ranges xeric scrub
			.fromColour(63, 211, 196).toLevel(BIOME_PLAINS) //Central tall grasslands
			.fromColour(107, 221, 198).toLevel(BIOME_DESERT_LAKES) //Central Tibetan Plateau alpine steppe
			.fromColour(189, 236, 135).toLevel(BIOME_FOREST) //Central U.S. hardwood forests
			.fromColour(197, 65, 206).toLevel(BIOME_SAVANNA) //Central Zambezian Miombo woodlands
			.fromColour(97, 227, 110).toLevel(BIOME_SPARSE_JUNGLE) //Cerrado
			.fromColour(89, 133, 211).toLevel(BIOME_FOREST) //Changbai Mountains mixed forests
			.fromColour(120, 237, 74).toLevel(BIOME_FOREST) //Changjiang Plain evergreen forests
			.fromColour(224, 60, 98).toLevel(BIOME_SWAMP) //Chao Phraya freshwater swamp forests
			.fromColour(74, 235, 68).toLevel(BIOME_SPARSE_JUNGLE) //Chao Phraya lowland moist deciduous forests
			.fromColour(72, 228, 111).toLevel(BIOME_MEADOW) //Chatham Island temperate forests
			.fromColour(16, 221, 221).toLevel(BIOME_SNOWY_TAIGA) //Cherskii-Kolyma mountain tundra
			.fromColour(61, 97, 229).toLevel(BIOME_SPARSE_JUNGLE) //Chhota-Nagpur dry deciduous forests
			.fromColour(222, 116, 157).toLevel(BIOME_SPARSE_JUNGLE) //Chiapas Depression dry forests
			.fromColour(223, 177, 91).toLevel(BIOME_JUNGLE) //Chiapas montane forests
			.fromColour(206, 63, 158).toLevel(BIOME_DESERT) //Chihuahuan desert
			.fromColour(116, 222, 29).toLevel(BIOME_PLAINS) //Chilean matorral
			.fromColour(86, 220, 222).toLevel(BIOME_WINDSWEPT_FOREST) //Chimalapas montane forests
			.fromColour(27, 237, 23).toLevel(BIOME_SAVANNA) //Chin Hills-Arakan Yoma montane forests
			.fromColour(218, 151, 103).toLevel(BIOME_SPARSE_JUNGLE) //Chiquitano dry forests
			.fromColour(125, 201, 117).toLevel(BIOME_JUNGLE) //Chocó-Darién moist forests
			.fromColour(231, 105, 60).toLevel(BIOME_BEACH) //Christmas and Cocos Islands tropical forests
			.fromColour(206, 121, 113).toLevel(BIOME_SNOWY_TAIGA) //Chukchi Peninsula tundra
			.fromColour(14, 236, 225).toLevel(BIOME_BEACH) //Clipperton Island shrub and grasslands
			.fromColour(107, 63, 228).toLevel(BIOME_JUNGLE) //Cocos Island moist forests
			.fromColour(212, 24, 215).toLevel(BIOME_BADLANDS) //Colorado Plateau shrublands
			.fromColour(222, 239, 29).toLevel(BIOME_OLD_GROWTH_SPRUCE_TAIGA) //Colorado Rockies forests
			.fromColour(132, 99, 202).toLevel(BIOME_SPARSE_JUNGLE) //Comoros forests
			.fromColour(217, 100, 174).toLevel(BIOME_TAIGA) //Cook Inlet taiga
			.fromColour(88, 33, 240).toLevel(BIOME_JUNGLE) //Cook Islands tropical moist forests
			.fromColour(124, 116, 209).toLevel(BIOME_WOODED_BADLANDS) //Coolgardie woodlands
			.fromColour(92, 215, 240).toLevel(BIOME_TAIGA) //Copper Plateau taiga
			.fromColour(116, 201, 185).toLevel(BIOME_WINDSWEPT_SAVANNA) //Cordillera Central páramo
			.fromColour(230, 177, 86).toLevel(BIOME_WINDSWEPT_SAVANNA) //Cordillera de Merida páramo
			.fromColour(126, 143, 211).toLevel(BIOME_SPARSE_JUNGLE) //Cordillera La Costa montane forests
			.fromColour(60, 106, 206).toLevel(BIOME_WINDSWEPT_FOREST) //Cordillera Oriental montane forests
			.fromColour(221, 99, 88).toLevel(BIOME_WINDSWEPT_FOREST) //Corsican montane broadleaf and mixed forests
			.fromColour(207, 21, 136).toLevel(BIOME_JUNGLE) //Costa Rican seasonal moist forests
			.fromColour(133, 209, 101).toLevel(BIOME_SUNFLOWER_PLAINS) //Crete Mediterranean forests
			.fromColour(147, 227, 18).toLevel(BIOME_FOREST) //Crimean Submediterranean forest complex
			.fromColour(211, 29, 153).toLevel(BIOME_JUNGLE) //Cross-Niger transition forests
			.fromColour(18, 211, 237).toLevel(BIOME_JUNGLE) //Cross-Sanaga-Bioko coastal forests
			.fromColour(208, 81, 18).toLevel(BIOME_PLAINS) //Cuban cactus scrub
			.fromColour(63, 57, 235).toLevel(BIOME_SPARSE_JUNGLE); //Cuban dry forests

		eco_vanilla = eco_vanilla.fromColour(234, 14, 219).toLevel(BIOME_JUNGLE) //Cuban moist forests
			.fromColour(58, 200, 202).toLevel(BIOME_FOREST) //Cuban pine forests
			.fromColour(212, 62, 24).toLevel(BIOME_SWAMP) //Cuban wetlands
			.fromColour(239, 21, 144).toLevel(BIOME_SUNFLOWER_PLAINS) //Cyprus Mediterranean forests
			.fromColour(185, 215, 84).toLevel(BIOME_WINDSWEPT_FOREST) //Da Hinggan-Dzhagdy Mountains conifer forests
			.fromColour(134, 45, 207).toLevel(BIOME_FOREST) //Daba Mountains evergreen forests
			.fromColour(42, 215, 77).toLevel(BIOME_PLAINS) //Daurian forest steppe
			.fromColour(173, 116, 208).toLevel(BIOME_SNOWY_SLOPES) //Davis Highlands tundra
			.fromColour(51, 239, 173).toLevel(BIOME_DESERT) //Deccan thorn scrub forests
			.fromColour(235, 27, 186).toLevel(BIOME_WINDSWEPT_FOREST) //Dinaric Mountains mixed forests
			.fromColour(206, 120, 158).toLevel(BIOME_WOODED_BADLANDS) //Drakensberg alti-montane grasslands and woodlands
			.fromColour(101, 61, 221).toLevel(BIOME_WINDSWEPT_FOREST) //Drakensberg montane grasslands, woodlands and forests
			.fromColour(223, 17, 23).toLevel(BIOME_SAVANNA) //Dry Chaco
			.fromColour(207, 98, 84).toLevel(BIOME_WOODED_BADLANDS) //East Afghan montane conifer forests
			.fromColour(240, 174, 87).toLevel(BIOME_DESERT) //East African halophytics
			.fromColour(18, 206, 55).toLevel(BIOME_MANGROVE_SWAMP) //East African mangroves
			.fromColour(112, 92, 201).toLevel(BIOME_JUNGLE) //East African montane forests
			.fromColour(214, 83, 234).toLevel(BIOME_STONY_PEAKS) //East African montane moorlands
			.fromColour(108, 127, 235).toLevel(BIOME_FOREST) //East Central Texas forests
			.fromColour(201, 143, 76).toLevel(BIOME_SPARSE_JUNGLE) //East Deccan dry-evergreen forests
			.fromColour(240, 146, 201).toLevel(BIOME_FOREST) //East European forest steppe
			.fromColour(213, 188, 113).toLevel(BIOME_DESERT) //East Saharan montane xeric woodlands
			.fromColour(207, 129, 229).toLevel(BIOME_TAIGA) //East Siberian taiga
			.fromColour(236, 55, 206).toLevel(BIOME_SAVANNA) //East Sudanian savanna
			.fromColour(135, 215, 115).toLevel(BIOME_FOREST) //Eastern Anatolian deciduous forests
			.fromColour(239, 84, 229).toLevel(BIOME_DESERT) //Eastern Anatolian montane steppe
			.fromColour(200, 180, 107).toLevel(BIOME_JUNGLE) //Eastern Arc forests
			.fromColour(208, 67, 57).toLevel(BIOME_SAVANNA) //Eastern Australia mulga shrublands
			.fromColour(45, 53, 201).toLevel(BIOME_OLD_GROWTH_BIRCH_FOREST) //Eastern Australian temperate forests
			.fromColour(214, 97, 220).toLevel(BIOME_TAIGA) //Eastern Canadian forests
			.fromColour(223, 91, 170).toLevel(BIOME_TAIGA) //Eastern Canadian Shield taiga
			.fromColour(55, 209, 41).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Eastern Cascades forests
			.fromColour(235, 227, 108).toLevel(BIOME_SWAMP) //Eastern Congolian swamp forests
			.fromColour(61, 240, 91).toLevel(BIOME_SPARSE_JUNGLE) //Eastern Cordillera real montane forests
			.fromColour(17, 200, 17).toLevel(BIOME_FOREST) //Eastern forest-boreal transition
			.fromColour(63, 188, 238).toLevel(BIOME_DESERT) //Eastern Gobi desert steppe
			.fromColour(110, 67, 228).toLevel(BIOME_FOREST) //Eastern Great Lakes lowland forests
			.fromColour(214, 31, 116).toLevel(BIOME_JUNGLE) //Eastern Guinean forests
			.fromColour(80, 213, 27).toLevel(BIOME_SPARSE_JUNGLE) //Eastern highlands moist deciduous forests
			.fromColour(73, 219, 65).toLevel(BIOME_STONY_PEAKS) //Eastern Himalayan alpine shrub and meadows
			.fromColour(137, 137, 231).toLevel(BIOME_WINDSWEPT_FOREST) //Eastern Himalayan broadleaf forests
			.fromColour(115, 238, 191).toLevel(BIOME_GROVE) //Eastern Himalayan subalpine conifer forests
			.fromColour(91, 198, 210).toLevel(BIOME_SPARSE_JUNGLE) //Eastern Java-Bali montane rain forests
			.fromColour(229, 105, 67).toLevel(BIOME_JUNGLE) //Eastern Java-Bali rain forests
			.fromColour(113, 205, 47).toLevel(BIOME_SUNFLOWER_PLAINS) //Eastern Mediterranean conifer-sclerophyllous-broadleaf forests
			.fromColour(104, 97, 227).toLevel(BIOME_JUNGLE) //Eastern Micronesia tropical moist forests
			.fromColour(96, 219, 223).toLevel(BIOME_SAVANNA) //Eastern Miombo woodlands
			.fromColour(80, 230, 145).toLevel(BIOME_SPARSE_JUNGLE) //Eastern Panamanian montane forests
			.fromColour(204, 78, 33).toLevel(BIOME_SAVANNA) //Eastern Zimbabwe montane forest-grassland mosaic
			.fromColour(17, 80, 240).toLevel(BIOME_SPARSE_JUNGLE) //Ecuadorian dry forests
			.fromColour(107, 208, 179).toLevel(BIOME_WINDSWEPT_SAVANNA) //Edwards Plateau savanna
			.fromColour(184, 201, 57).toLevel(BIOME_SAVANNA) //Einasleigh upland savanna
			.fromColour(227, 94, 119).toLevel(BIOME_BADLANDS) //Elburz Range forest steppe
			.fromColour(213, 51, 94).toLevel(BIOME_PLAINS) //Emin Valley steppe
			.fromColour(18, 122, 232).toLevel(BIOME_SUNFLOWER_PLAINS) //English Lowlands beech forests
			.fromColour(44, 235, 225).toLevel(BIOME_SPARSE_JUNGLE) //Enriquillo wetlands
			.fromColour(128, 213, 83).toLevel(BIOME_BEACH) //Eritrean coastal desert
			.fromColour(190, 231, 87).toLevel(BIOME_SAVANNA) //Esperance mallee
			.fromColour(214, 69, 230).toLevel(BIOME_SAVANNA) //Espinal
			.fromColour(70, 203, 137).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Ethiopian montane forests
			.fromColour(206, 201, 99).toLevel(BIOME_WOODED_BADLANDS) //Ethiopian montane grasslands and woodlands
			.fromColour(211, 225, 106).toLevel(BIOME_WINDSWEPT_SAVANNA) //Ethiopian montane moorlands
			.fromColour(63, 227, 153).toLevel(BIOME_DESERT) //Ethiopian xeric grasslands and shrublands
			.fromColour(219, 104, 87).toLevel(BIOME_DESERT); //Etosha Pan halophytics

		eco_vanilla = eco_vanilla.fromColour(221, 113, 122).toLevel(BIOME_FOREST) //Euxine-Colchic broadleaf forests
			.fromColour(227, 133, 32).toLevel(BIOME_SWAMP) //Everglades
			.fromColour(202, 156, 56).toLevel(BIOME_WINDSWEPT_SAVANNA) //Eyre and York mallee
			.fromColour(198, 219, 92).toLevel(BIOME_MEADOW) //Faroe Islands boreal grasslands
			.fromColour(208, 157, 112).toLevel(BIOME_JUNGLE) //Fernando de Noronha-Atol das Rocas moist forests
			.fromColour(223, 130, 240).toLevel(BIOME_SPARSE_JUNGLE) //Fiji tropical dry forests
			.fromColour(135, 127, 210).toLevel(BIOME_JUNGLE) //Fiji tropical moist forests
			.fromColour(217, 222, 64).toLevel(BIOME_FOREST) //Fiordland temperate forests
			.fromColour(222, 132, 53).toLevel(BIOME_PLAINS) //Flint Hills tall grasslands
			.fromColour(112, 171, 234).toLevel(BIOME_FOREST) //Florida sand pine scrub
			.fromColour(92, 201, 70).toLevel(BIOME_OLD_GROWTH_SPRUCE_TAIGA) //Fraser Plateau and Basin complex
			.fromColour(101, 118, 202).toLevel(BIOME_SAVANNA) //Galápagos Islands scrubland mosaic
			.fromColour(45, 220, 42).toLevel(BIOME_MEADOW) //Ghorat-Hazarajat alpine meadow
			.fromColour(139, 184, 235).toLevel(BIOME_BADLANDS) //Gibson desert
			.fromColour(155, 210, 96).toLevel(BIOME_WINDSWEPT_SAVANNA) //Gissaro-Alai open woodlands
			.fromColour(76, 147, 239).toLevel(BIOME_MANGROVE_SWAMP) //Goadavari-Krishna mangroves
			.fromColour(207, 45, 69).toLevel(BIOME_DESERT) //Gobi Lakes Valley desert steppe
			.fromColour(160, 37, 212).toLevel(BIOME_BEACH) //Granitic Seychelles forests
			.fromColour(219, 122, 70).toLevel(BIOME_WOODED_BADLANDS) //Great Basin montane forests
			.fromColour(231, 38, 118).toLevel(BIOME_DESERT) //Great Basin shrub steppe
			.fromColour(230, 205, 95).toLevel(BIOME_PLAINS) //Great Lakes Basin desert steppe
			.fromColour(171, 53, 203).toLevel(BIOME_BADLANDS) //Great Sandy-Tanami desert
			.fromColour(214, 22, 60).toLevel(BIOME_BADLANDS) //Great Victoria desert
			.fromColour(87, 217, 48).toLevel(BIOME_JUNGLE) //Greater Negros-Panay rain forests
			.fromColour(216, 102, 53).toLevel(BIOME_PLAINS) //Guajira-Barranquilla xeric scrub
			.fromColour(45, 232, 132).toLevel(BIOME_SWAMP) //Guayaquil flooded grasslands
			.fromColour(210, 48, 69).toLevel(BIOME_MANGROVE_SWAMP) //Guianan freshwater swamp forests
			.fromColour(137, 229, 51).toLevel(BIOME_JUNGLE) //Guianan Highlands moist forests
			.fromColour(99, 237, 115).toLevel(BIOME_JUNGLE) //Guianan moist forests
			.fromColour(223, 91, 76).toLevel(BIOME_JUNGLE) //Guianan piedmont and lowland moist forests
			.fromColour(24, 37, 221).toLevel(BIOME_SPARSE_JUNGLE) //Guianan savanna
			.fromColour(190, 227, 135).toLevel(BIOME_SPARSE_JUNGLE) //Guinean forest-savanna mosaic
			.fromColour(180, 83, 240).toLevel(BIOME_MANGROVE_SWAMP) //Guinean mangroves
			.fromColour(89, 226, 189).toLevel(BIOME_JUNGLE) //Guinean montane forests
			.fromColour(234, 136, 201).toLevel(BIOME_SPARSE_JUNGLE) //Guizhou Plateau broadleaf and mixed forests
			.fromColour(115, 215, 167).toLevel(BIOME_BADLANDS) //Gulf of California xeric scrub
			.fromColour(98, 200, 225).toLevel(BIOME_DESERT) //Gulf of Oman desert and semi-desert
			.fromColour(80, 177, 237).toLevel(BIOME_FOREST) //Gulf of St. Lawrence lowland forests
			.fromColour(104, 108, 203).toLevel(BIOME_MANGROVE_SWAMP) //Gurupa varzeá
			.fromColour(222, 57, 151).toLevel(BIOME_JUNGLE) //Hainan Island monsoon rain forests
			.fromColour(238, 107, 100).toLevel(BIOME_JUNGLE) //Halmahera rain forests
			.fromColour(238, 186, 31).toLevel(BIOME_SPARSE_JUNGLE) //Hawaii tropical dry forests
			.fromColour(182, 85, 202).toLevel(BIOME_STONY_PEAKS) //Hawaii tropical high shrublands
			.fromColour(216, 123, 225).toLevel(BIOME_SAVANNA) //Hawaii tropical low shrublands
			.fromColour(214, 92, 186).toLevel(BIOME_JUNGLE) //Hawaii tropical moist forests
			.fromColour(65, 59, 226).toLevel(BIOME_BADLANDS) //Helanshan montane conifer forests
			.fromColour(57, 211, 173).toLevel(BIOME_OLD_GROWTH_SPRUCE_TAIGA) //Hengduan Mountains subalpine conifer forests
			.fromColour(211, 75, 229).toLevel(BIOME_SNOWY_PLAINS) //High Arctic tundra
			.fromColour(98, 210, 188).toLevel(BIOME_DESERT) //High Monte
			.fromColour(206, 43, 92).toLevel(BIOME_SAVANNA) //Highveld grasslands
			.fromColour(201, 216, 106).toLevel(BIOME_SPARSE_JUNGLE) //Himalayan subtropical broadleaf forests
			.fromColour(238, 144, 238).toLevel(BIOME_FOREST) //Himalayan subtropical pine forests
			.fromColour(154, 113, 215).toLevel(BIOME_STONY_PEAKS) //Hindu Kush alpine meadow
			.fromColour(208, 101, 103).toLevel(BIOME_SPARSE_JUNGLE) //Hispaniolan dry forests
			.fromColour(99, 117, 230).toLevel(BIOME_JUNGLE) //Hispaniolan moist forests
			.fromColour(175, 107, 215).toLevel(BIOME_WINDSWEPT_FOREST) //Hispaniolan pine forests
			.fromColour(35, 203, 116).toLevel(BIOME_DESERT) //Hobyo grasslands and shrublands
			.fromColour(159, 76, 200).toLevel(BIOME_OLD_GROWTH_BIRCH_FOREST) //Hokkaido deciduous forests
			.fromColour(208, 97, 236).toLevel(BIOME_TAIGA) //Hokkaido montane conifer forests
			.fromColour(74, 215, 52).toLevel(BIOME_TAIGA) //Honshu alpine conifer forests
			.fromColour(125, 208, 221).toLevel(BIOME_FOREST) //Huang He Plain mixed forests
			.fromColour(92, 224, 152).toLevel(BIOME_SPARSE_JUNGLE) //Humid Chaco
			.fromColour(108, 36, 202).toLevel(BIOME_PLAINS) //Humid Pampas
			.fromColour(204, 175, 78).toLevel(BIOME_JUNGLE); //Huon Peninsula montane rain forests

		eco_vanilla = eco_vanilla.fromColour(108, 217, 208).toLevel(BIOME_WINDSWEPT_FOREST) //Iberian conifer forests
			.fromColour(165, 216, 94).toLevel(BIOME_FOREST) //Iberian sclerophyllous and semi-deciduous forests
			.fromColour(104, 187, 208).toLevel(BIOME_BIRCH_FOREST) //Iceland boreal birch forests and alpine tundra
			.fromColour(237, 124, 127).toLevel(BIOME_BEACH) //Ile Europa and Bassas da India xeric scrub
			.fromColour(106, 203, 80).toLevel(BIOME_SUNFLOWER_PLAINS) //Illyrian deciduous forests
			.fromColour(188, 68, 212).toLevel(BIOME_MANGROVE_SWAMP) //Indochina mangroves
			.fromColour(133, 208, 86).toLevel(BIOME_MANGROVE_SWAMP) //Indus River Delta-Arabian Sea mangroves
			.fromColour(76, 138, 214).toLevel(BIOME_DESERT) //Indus Valley desert
			.fromColour(213, 109, 57).toLevel(BIOME_SAVANNA) //Inner Niger Delta flooded savanna
			.fromColour(34, 14, 216).toLevel(BIOME_TAIGA) //Interior Alaska-Yukon lowland taiga
			.fromColour(202, 28, 112).toLevel(BIOME_SNOWY_TAIGA) //Interior Yukon-Alaska alpine tundra
			.fromColour(19, 231, 178).toLevel(BIOME_SWAMP) //Iquitos varzeá
			.fromColour(85, 200, 96).toLevel(BIOME_SPARSE_JUNGLE) //Irrawaddy dry forests
			.fromColour(221, 101, 147).toLevel(BIOME_SWAMP) //Irrawaddy freshwater swamp forests
			.fromColour(240, 104, 109).toLevel(BIOME_JUNGLE) //Irrawaddy moist deciduous forests
			.fromColour(238, 216, 21).toLevel(BIOME_SPARSE_JUNGLE) //Islas Revillagigedo dry forests
			.fromColour(124, 211, 127).toLevel(BIOME_JUNGLE) //Isthmian-Atlantic moist forests
			.fromColour(89, 230, 139).toLevel(BIOME_JUNGLE) //Isthmian-Pacific moist forests
			.fromColour(30, 217, 114).toLevel(BIOME_SUNFLOWER_PLAINS) //Italian sclerophyllous and semi-deciduous forests
			.fromColour(130, 143, 236).toLevel(BIOME_SAVANNA) //Itigi-Sumbu thicket
			.fromColour(154, 225, 106).toLevel(BIOME_SPARSE_JUNGLE) //Jalisco dry forests
			.fromColour(215, 149, 43).toLevel(BIOME_SPARSE_JUNGLE) //Jamaican dry forests
			.fromColour(84, 161, 203).toLevel(BIOME_JUNGLE) //Jamaican moist forests
			.fromColour(179, 120, 204).toLevel(BIOME_JUNGLE) //Japurá-Solimoes-Negro moist forests
			.fromColour(203, 22, 67).toLevel(BIOME_SAVANNA) //Jarrah-Karri forest and shrublands
			.fromColour(179, 131, 234).toLevel(BIOME_SPARSE_JUNGLE) //Jian Nan subtropical evergreen forests
			.fromColour(205, 73, 21).toLevel(BIOME_SAVANNA) //Jos Plateau forest-grassland mosaic
			.fromColour(185, 222, 106).toLevel(BIOME_BEACH) //Juan Fernández Islands temperate forests
			.fromColour(22, 227, 26).toLevel(BIOME_DESERT_LAKES) //Junggar Basin semi-desert
			.fromColour(219, 127, 199).toLevel(BIOME_BAMBOO_JUNGLE) //Juruá-Purus moist forests
			.fromColour(121, 236, 44).toLevel(BIOME_SNOWY_TAIGA) //Kalaallit Nunaat high arctic tundra
			.fromColour(30, 122, 208).toLevel(BIOME_SNOWY_TAIGA) //Kalaallit Nunaat low arctic tundra
			.fromColour(239, 123, 198).toLevel(BIOME_SAVANNA) //Kalahari Acacia-Baikiaea woodlands
			.fromColour(137, 56, 223).toLevel(BIOME_SAVANNA) //Kalahari xeric savanna
			.fromColour(70, 225, 46).toLevel(BIOME_SNOWY_SLOPES) //Kamchatka Mountain tundra and forest tundra
			.fromColour(15, 88, 206).toLevel(BIOME_MEADOW) //Kamchatka-Kurile meadows and sparse forests
			.fromColour(191, 88, 220).toLevel(BIOME_TAIGA) //Kamchatka-Kurile taiga
			.fromColour(207, 41, 55).toLevel(BIOME_DESERT) //Kaokoveld desert
			.fromColour(25, 55, 205).toLevel(BIOME_STONY_PEAKS) //Karakoram-West Tibetan Plateau alpine steppe
			.fromColour(94, 196, 207).toLevel(BIOME_JUNGLE) //Kayah-Karen montane rain forests
			.fromColour(119, 15, 216).toLevel(BIOME_FOREST) //Kazakh forest steppe
			.fromColour(113, 225, 27).toLevel(BIOME_DESERT) //Kazakh semi-desert
			.fromColour(71, 179, 212).toLevel(BIOME_PLAINS) //Kazakh steppe
			.fromColour(224, 148, 18).toLevel(BIOME_PLAINS) //Kazakh upland
			.fromColour(54, 210, 197).toLevel(BIOME_JUNGLE) //Kermadec Islands subtropical moist forests
			.fromColour(169, 219, 107).toLevel(BIOME_DESERT) //Khangai Mountains alpine meadow
			.fromColour(221, 194, 119).toLevel(BIOME_WINDSWEPT_FOREST) //Khangai Mountains conifer forests
			.fromColour(26, 200, 180).toLevel(BIOME_FOREST) //Khathiar-Gir dry deciduous forests
			.fromColour(223, 109, 198).toLevel(BIOME_SAVANNA) //Kimberly tropical savanna
			.fromColour(68, 229, 32).toLevel(BIOME_WINDSWEPT_HILLS) //Kinabalu montane alpine meadows
			.fromColour(34, 234, 234).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Klamath-Siskiyou forests
			.fromColour(126, 188, 235).toLevel(BIOME_WINDSWEPT_FOREST) //Knysna-Amatole montane forests
			.fromColour(236, 106, 230).toLevel(BIOME_SNOWY_TAIGA) //Kola Peninsula tundra
			.fromColour(61, 160, 221).toLevel(BIOME_DESERT_LAKES) //Kopet Dag semi-desert
			.fromColour(62, 174, 234).toLevel(BIOME_DESERT) //Kopet Dag woodlands and forest steppe
			.fromColour(210, 109, 210).toLevel(BIOME_DESERT) //Kuh Rud and Eastern Iran montane woodlands
			.fromColour(90, 229, 208).toLevel(BIOME_SPARSE_JUNGLE) //KwaZulu-Cape coastal forest mosaic
			.fromColour(202, 152, 95).toLevel(BIOME_SPARSE_JUNGLE) //La Costa xeric shrublands
			.fromColour(235, 42, 225).toLevel(BIOME_RIVER) //Lake
			.fromColour(82, 169, 220).toLevel(BIOME_SWAMP) //Lake Chad flooded savanna
			.fromColour(44, 214, 106).toLevel(BIOME_SPARSE_JUNGLE) //Lara-Falcón dry forests
			.fromColour(233, 178, 49).toLevel(BIOME_JUNGLE) //Leeward Islands moist forests
			.fromColour(200, 178, 13).toLevel(BIOME_SPARSE_JUNGLE) //Lesser Antillean dry forests
			.fromColour(227, 191, 107).toLevel(BIOME_SPARSE_JUNGLE); //Lesser Sundas deciduous forests

		eco_vanilla = eco_vanilla.fromColour(52, 129, 223).toLevel(BIOME_SPARSE_JUNGLE) //Llanos
			.fromColour(161, 77, 200).toLevel(BIOME_SPARSE_JUNGLE) //Lord Howe Island subtropical forests
			.fromColour(137, 49, 225).toLevel(BIOME_JUNGLE) //Louisiade Archipelago rain forests
			.fromColour(222, 40, 216).toLevel(BIOME_SNOWY_TAIGA) //Low Arctic tundra
			.fromColour(84, 200, 74).toLevel(BIOME_BADLANDS) //Low Monte
			.fromColour(16, 200, 142).toLevel(BIOME_SPARSE_JUNGLE) //Lower Gangetic Plains moist deciduous forests
			.fromColour(113, 46, 237).toLevel(BIOME_PLAINS) //Lowland fynbos and renosterveld
			.fromColour(124, 146, 225).toLevel(BIOME_JUNGLE) //Luang Prabang montane rain forests
			.fromColour(123, 202, 127).toLevel(BIOME_JUNGLE) //Luzon montane rain forests
			.fromColour(209, 178, 116).toLevel(BIOME_JUNGLE) //Luzon rain forests
			.fromColour(119, 154, 225).toLevel(BIOME_FOREST) //Luzon tropical pine forests
			.fromColour(150, 73, 213).toLevel(BIOME_SPARSE_JUNGLE) //Madagascar dry deciduous forests
			.fromColour(145, 92, 236).toLevel(BIOME_JUNGLE) //Madagascar ericoid thickets
			.fromColour(33, 203, 87).toLevel(BIOME_JUNGLE) //Madagascar lowland forests
			.fromColour(156, 206, 57).toLevel(BIOME_MANGROVE_SWAMP) //Madagascar mangroves
			.fromColour(180, 207, 92).toLevel(BIOME_SAVANNA) //Madagascar spiny thickets
			.fromColour(213, 240, 94).toLevel(BIOME_SPARSE_JUNGLE) //Madagascar subhumid forests
			.fromColour(222, 35, 194).toLevel(BIOME_SAVANNA) //Madagascar succulent woodlands
			.fromColour(141, 235, 237).toLevel(BIOME_WINDSWEPT_FOREST) //Madeira evergreen forests
			.fromColour(45, 218, 204).toLevel(BIOME_JUNGLE) //Madeira-Tapajós moist forests
			.fromColour(75, 122, 217).toLevel(BIOME_SPARSE_JUNGLE) //Magdalena Valley dry forests
			.fromColour(80, 154, 223).toLevel(BIOME_JUNGLE) //Magdalena Valley montane forests
			.fromColour(208, 88, 48).toLevel(BIOME_JUNGLE) //Magdalena-Urabá moist forests
			.fromColour(80, 126, 218).toLevel(BIOME_TAIGA) //Magellanic subpolar forests
			.fromColour(155, 236, 139).toLevel(BIOME_JUNGLE) //Malabar Coast moist forests
			.fromColour(54, 236, 72).toLevel(BIOME_JUNGLE) //Maldives-Lakshadweep-Chagos Archipelago tropical moist forests
			.fromColour(43, 226, 141).toLevel(BIOME_JAGGED_PEAKS) //Malpelo Island xeric scrub
			.fromColour(240, 232, 73).toLevel(BIOME_FOREST) //Manchurian mixed forests
			.fromColour(37, 225, 159).toLevel(BIOME_WINDSWEPT_SAVANNA) //Mandara Plateau mosaic
			.fromColour(121, 91, 216).toLevel(BIOME_SPARSE_JUNGLE) //Maputaland coastal forest mosaic
			.fromColour(166, 220, 80).toLevel(BIOME_SAVANNA) //Maputaland-Pondoland bushland and thickets
			.fromColour(65, 124, 226).toLevel(BIOME_SPARSE_JUNGLE) //Maracaibo dry forests
			.fromColour(42, 161, 216).toLevel(BIOME_JUNGLE) //Marajó varzeá
			.fromColour(166, 121, 211).toLevel(BIOME_SPARSE_JUNGLE) //Maranhão Babaçu forests
			.fromColour(106, 86, 233).toLevel(BIOME_SPARSE_JUNGLE) //Marañón dry forests
			.fromColour(207, 70, 180).toLevel(BIOME_SPARSE_JUNGLE) //Marianas tropical dry forests
			.fromColour(87, 222, 137).toLevel(BIOME_COLD_BEACH) //Marielandia Antarctic tundra
			.fromColour(62, 203, 15).toLevel(BIOME_JUNGLE) //Marquesas tropical moist forests
			.fromColour(201, 99, 186).toLevel(BIOME_DESERT) //Masai xeric grasslands and shrublands
			.fromColour(53, 227, 53).toLevel(BIOME_JUNGLE) //Mascarene forests
			.fromColour(149, 116, 220).toLevel(BIOME_SPARSE_JUNGLE) //Mato Grosso seasonal forests
			.fromColour(211, 65, 204).toLevel(BIOME_SNOWY_SLOPES) //Maudlandia Antarctic desert
			.fromColour(200, 231, 24).toLevel(BIOME_SAVANNA) //Mediterranean acacia-argania dry woodlands and succulent thickets
			.fromColour(79, 234, 203).toLevel(BIOME_WOODED_BADLANDS) //Mediterranean conifer and mixed forests
			.fromColour(184, 215, 99).toLevel(BIOME_SAVANNA) //Mediterranean dry woodlands and steppe
			.fromColour(28, 209, 237).toLevel(BIOME_BADLANDS) //Mediterranean High Atlas juniper steppe
			.fromColour(87, 214, 174).toLevel(BIOME_SAVANNA) //Mediterranean woodlands and forests
			.fromColour(75, 200, 61).toLevel(BIOME_BAMBOO_JUNGLE) //Meghalaya subtropical forests
			.fromColour(118, 96, 232).toLevel(BIOME_JUNGLE) //Mentawai Islands rain forests
			.fromColour(158, 24, 211).toLevel(BIOME_DESERT) //Meseta Central matorral
			.fromColour(207, 208, 122).toLevel(BIOME_MANGROVE_SWAMP) //Mesoamerican Gulf-Caribbean mangroves
			.fromColour(105, 211, 48).toLevel(BIOME_DESERT) //Mesopotamian shrub desert
			.fromColour(138, 189, 240).toLevel(BIOME_TAIGA) //Mid-Continental Canadian forests
			.fromColour(208, 106, 43).toLevel(BIOME_SNOWY_PLAINS) //Middle Arctic tundra
			.fromColour(130, 221, 97).toLevel(BIOME_FOREST) //Middle Atlantic coastal forests
			.fromColour(47, 194, 224).toLevel(BIOME_DESERT) //Middle East steppe
			.fromColour(97, 201, 118).toLevel(BIOME_TAIGA) //Midwestern Canadian Shield forests
			.fromColour(207, 117, 65).toLevel(BIOME_JUNGLE) //Mindanao montane rain forests
			.fromColour(50, 123, 225).toLevel(BIOME_JUNGLE) //Mindanao-Eastern Visayas rain forests
			.fromColour(178, 118, 215).toLevel(BIOME_JUNGLE) //Mindoro rain forests
			.fromColour(129, 237, 121).toLevel(BIOME_FOREST) //Miskito pine forests
			.fromColour(124, 200, 93).toLevel(BIOME_FOREST) //Mississippi lowland forests
			.fromColour(28, 237, 230).toLevel(BIOME_WINDSWEPT_SAVANNA) //Mitchell grass downs
			.fromColour(231, 154, 112).toLevel(BIOME_JUNGLE); //Mizoram-Manipur-Kachin rain forests

		eco_vanilla = eco_vanilla.fromColour(110, 131, 234).toLevel(BIOME_BADLANDS) //Mojave desert
			.fromColour(229, 148, 26).toLevel(BIOME_PLAINS) //Mongolian-Manchurian grassland
			.fromColour(30, 135, 210).toLevel(BIOME_MEADOW) //Montana Valley and Foothill grasslands
			.fromColour(217, 119, 14).toLevel(BIOME_WOODED_BADLANDS) //Montane fynbos and renosterveld
			.fromColour(174, 37, 208).toLevel(BIOME_SWAMP) //Monte Alegre varzeá
			.fromColour(194, 76, 221).toLevel(BIOME_PLAINS) //Motagua Valley thornscrub
			.fromColour(88, 33, 217).toLevel(BIOME_STONY_PEAKS) //Mount Cameroon and Bioko montane forests
			.fromColour(229, 104, 21).toLevel(BIOME_WINDSWEPT_SAVANNA) //Mount Lofty woodlands
			.fromColour(59, 182, 216).toLevel(BIOME_WOODED_BADLANDS) //Murray-Darling woodlands and mallee
			.fromColour(206, 98, 105).toLevel(BIOME_TAIGA) //Muskwa-Slave Lake forests
			.fromColour(118, 201, 149).toLevel(BIOME_MANGROVE_SWAMP) //Myanmar Coast mangroves
			.fromColour(201, 35, 154).toLevel(BIOME_JUNGLE) //Myanmar coastal rain forests
			.fromColour(52, 139, 209).toLevel(BIOME_DESERT) //Nama Karoo
			.fromColour(239, 189, 82).toLevel(BIOME_BADLANDS) //Namib desert
			.fromColour(155, 104, 216).toLevel(BIOME_WINDSWEPT_SAVANNA) //Namibian savanna woodlands
			.fromColour(22, 68, 233).toLevel(BIOME_SPARSE_JUNGLE) //Nansei Islands subtropical evergreen forests
			.fromColour(228, 72, 158).toLevel(BIOME_JUNGLE) //Napo moist forests
			.fromColour(129, 91, 225).toLevel(BIOME_SAVANNA) //Naracoorte woodlands
			.fromColour(195, 225, 136).toLevel(BIOME_FOREST) //Narmada Valley dry deciduous forests
			.fromColour(240, 38, 75).toLevel(BIOME_PLAINS) //Nebraska Sand Hills mixed grasslands
			.fromColour(215, 232, 127).toLevel(BIOME_JUNGLE) //Negro-Branco moist forests
			.fromColour(221, 200, 123).toLevel(BIOME_FOREST) //Nelson Coast temperate forests
			.fromColour(149, 110, 208).toLevel(BIOME_SWAMP) //Nenjiang River grassland
			.fromColour(107, 118, 214).toLevel(BIOME_JUNGLE) //New Britain-New Ireland lowland rain forests
			.fromColour(200, 83, 204).toLevel(BIOME_JUNGLE) //New Britain-New Ireland montane rain forests
			.fromColour(40, 224, 196).toLevel(BIOME_WINDSWEPT_FOREST) //New Caledonia dry forests
			.fromColour(226, 209, 58).toLevel(BIOME_JUNGLE) //New Caledonia rain forests
			.fromColour(229, 21, 24).toLevel(BIOME_FOREST) //New England-Acadian forests
			.fromColour(41, 212, 175).toLevel(BIOME_MANGROVE_SWAMP) //New Guinea mangroves
			.fromColour(117, 201, 234).toLevel(BIOME_WINDSWEPT_FOREST) //Newfoundland Highland forests
			.fromColour(110, 203, 49).toLevel(BIOME_JUNGLE) //Nicobar Islands rain forests
			.fromColour(213, 66, 208).toLevel(BIOME_SWAMP) //Niger Delta swamp forests
			.fromColour(230, 48, 200).toLevel(BIOME_JUNGLE) //Nigerian lowland forests
			.fromColour(61, 167, 238).toLevel(BIOME_CHERRY_GROVE) //Nihonkai evergreen forests
			.fromColour(206, 145, 65).toLevel(BIOME_CHERRY_GROVE) //Nihonkai montane deciduous forests
			.fromColour(58, 218, 37).toLevel(BIOME_SAVANNA) //Nile Delta flooded savanna
			.fromColour(191, 232, 27).toLevel(BIOME_SPARSE_JUNGLE) //Norfolk Island subtropical forests
			.fromColour(106, 213, 120).toLevel(BIOME_OLD_GROWTH_SPRUCE_TAIGA) //North Atlantic moist mixed forests
			.fromColour(31, 203, 63).toLevel(BIOME_TAIGA) //North Central Rockies forests
			.fromColour(197, 222, 57).toLevel(BIOME_FOREST) //North Island temperate forests
			.fromColour(172, 210, 59).toLevel(BIOME_DESERT) //North Saharan steppe and woodlands
			.fromColour(201, 73, 199).toLevel(BIOME_DESERT_LAKES) //North Tibetan Plateau-Kunlun Mountains alpine desert
			.fromColour(221, 56, 122).toLevel(BIOME_JUNGLE) //North Western Ghats moist deciduous forests
			.fromColour(217, 223, 31).toLevel(BIOME_JUNGLE) //North Western Ghats montane rain forests
			.fromColour(29, 64, 222).toLevel(BIOME_FOREST) //Northeast China Plain deciduous forests
			.fromColour(131, 37, 232).toLevel(BIOME_FOREST) //Northeast India-Myanmar pine forests
			.fromColour(135, 237, 177).toLevel(BIOME_SNOWY_TAIGA) //Northeast Siberian coastal tundra
			.fromColour(100, 168, 204).toLevel(BIOME_TAIGA) //Northeast Siberian taiga
			.fromColour(110, 237, 190).toLevel(BIOME_BEACH) //Northeastern Brazil restingas
			.fromColour(76, 166, 204).toLevel(BIOME_FOREST) //Northeastern coastal forests
			.fromColour(210, 106, 46).toLevel(BIOME_JUNGLE) //Northeastern Congolian lowland forests
			.fromColour(223, 115, 139).toLevel(BIOME_GROVE) //Northeastern Himalayan subalpine conifer forests
			.fromColour(165, 231, 137).toLevel(BIOME_FOREST) //Northeastern Spain and Southern France Mediterranean forests
			.fromColour(207, 41, 113).toLevel(BIOME_SAVANNA) //Northern Acacia-Commiphora bushlands and thickets
			.fromColour(80, 120, 230).toLevel(BIOME_FOREST) //Northern Anatolian conifer and deciduous forests
			.fromColour(216, 84, 77).toLevel(BIOME_WINDSWEPT_SAVANNA) //Northern Andean páramo
			.fromColour(75, 61, 205).toLevel(BIOME_JUNGLE) //Northern Annamites rain forests
			.fromColour(118, 224, 180).toLevel(BIOME_OLD_GROWTH_SPRUCE_TAIGA) //Northern California coastal forests
			.fromColour(209, 105, 131).toLevel(BIOME_TAIGA) //Northern Canadian Shield taiga
			.fromColour(119, 177, 219).toLevel(BIOME_SPARSE_JUNGLE) //Northern Congolian forest-savanna mosaic
			.fromColour(91, 222, 101).toLevel(BIOME_TAIGA) //Northern Cordillera forests
			.fromColour(85, 236, 168).toLevel(BIOME_SPARSE_JUNGLE) //Northern dry deciduous forests
			.fromColour(86, 187, 210).toLevel(BIOME_SPARSE_JUNGLE) //Northern Indochina subtropical forests
			.fromColour(214, 203, 77).toLevel(BIOME_FOREST); //Northern Khorat Plateau moist deciduous forests

		eco_vanilla = eco_vanilla.fromColour(47, 33, 239).toLevel(BIOME_MANGROVE_SWAMP) //Northern Mesoamerican Pacific mangroves
			.fromColour(235, 102, 45).toLevel(BIOME_SUNFLOWER_PLAINS) //Northern mixed grasslands
			.fromColour(47, 224, 221).toLevel(BIOME_SWAMP) //Northern New Guinea lowland rain and freshwater swamp forests
			.fromColour(194, 122, 216).toLevel(BIOME_JUNGLE) //Northern New Guinea montane rain forests
			.fromColour(222, 93, 81).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Northern Pacific coastal forests
			.fromColour(37, 208, 159).toLevel(BIOME_PLAINS) //Northern short grasslands
			.fromColour(63, 218, 123).toLevel(BIOME_MEADOW) //Northern tall grasslands
			.fromColour(221, 107, 62).toLevel(BIOME_JUNGLE) //Northern Thailand-Laos moist deciduous forests
			.fromColour(128, 233, 151).toLevel(BIOME_TAIGA) //Northern transitional alpine forests
			.fromColour(239, 204, 128).toLevel(BIOME_BAMBOO_JUNGLE) //Northern Triangle subtropical forests
			.fromColour(61, 219, 198).toLevel(BIOME_FOREST) //Northern Triangle temperate forests
			.fromColour(169, 114, 206).toLevel(BIOME_JUNGLE) //Northern Vietnam lowland rain forests
			.fromColour(161, 42, 216).toLevel(BIOME_SPARSE_JUNGLE) //Northern Zanzibar-Inhambane coastal forest mosaic
			.fromColour(164, 217, 49).toLevel(BIOME_FOREST) //Northland temperate kauri forests
			.fromColour(171, 240, 115).toLevel(BIOME_WINDSWEPT_FOREST) //Northwest Iberian montane forests
			.fromColour(221, 214, 77).toLevel(BIOME_SNOWY_TAIGA) //Northwest Russian-Novaya Zemlya tundra
			.fromColour(218, 48, 62).toLevel(BIOME_TAIGA) //Northwest Territories taiga
			.fromColour(27, 177, 211).toLevel(BIOME_SPARSE_JUNGLE) //Northwestern Andean montane forests
			.fromColour(69, 195, 202).toLevel(BIOME_JUNGLE) //Northwestern Congolian lowland forests
			.fromColour(179, 45, 200).toLevel(BIOME_BEACH) //Northwestern Hawaii scrub
			.fromColour(194, 118, 234).toLevel(BIOME_STONY_PEAKS) //Northwestern Himalayan alpine shrub and meadows
			.fromColour(121, 220, 75).toLevel(BIOME_SAVANNA) //Northwestern thorn scrub forests
			.fromColour(52, 209, 115).toLevel(BIOME_SNOWY_PLAINS) //Novosibirsk Islands arctic desert
			.fromColour(61, 102, 239).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Nujiang Langcang Gorge alpine conifer and mixed forests
			.fromColour(206, 101, 190).toLevel(BIOME_BADLANDS) //Nullarbor Plains xeric shrublands
			.fromColour(229, 157, 85).toLevel(BIOME_WINDSWEPT_FOREST) //Oaxacan montane forests
			.fromColour(236, 79, 123).toLevel(BIOME_JUNGLE) //Ogasawara subtropical moist forests
			.fromColour(113, 44, 232).toLevel(BIOME_SNOWY_TAIGA) //Ogilvie-MacKenzie alpine tundra
			.fromColour(235, 135, 176).toLevel(BIOME_TAIGA) //Okanagan dry forests
			.fromColour(222, 55, 133).toLevel(BIOME_TAIGA) //Okhotsk-Manchurian taiga
			.fromColour(148, 206, 117).toLevel(BIOME_PLAINS) //Ordos Plateau steppe
			.fromColour(148, 74, 239).toLevel(BIOME_MANGROVE_SWAMP) //Orinoco Delta swamp forests
			.fromColour(146, 211, 60).toLevel(BIOME_SWAMP) //Orinoco wetlands
			.fromColour(76, 235, 161).toLevel(BIOME_SPARSE_JUNGLE) //Orissa semi-evergreen forests
			.fromColour(154, 216, 103).toLevel(BIOME_FOREST) //Ozark Mountain forests
			.fromColour(220, 139, 85).toLevel(BIOME_SNOWY_SLOPES) //Pacific Coastal Mountain icefields and tundra
			.fromColour(15, 133, 211).toLevel(BIOME_JUNGLE) //Palau tropical moist forests
			.fromColour(24, 217, 185).toLevel(BIOME_JUNGLE) //Palawan rain forests
			.fromColour(54, 184, 207).toLevel(BIOME_MEADOW) //Palouse grasslands
			.fromColour(214, 208, 23).toLevel(BIOME_STONY_PEAKS) //Pamir alpine desert and tundra
			.fromColour(182, 219, 97).toLevel(BIOME_SPARSE_JUNGLE) //Panamanian dry forests
			.fromColour(166, 132, 229).toLevel(BIOME_FOREST) //Pannonian mixed forests
			.fromColour(235, 109, 138).toLevel(BIOME_SWAMP) //Pantanal
			.fromColour(93, 93, 233).toLevel(BIOME_PLAINS) //Pantanos de Centla
			.fromColour(100, 225, 141).toLevel(BIOME_JUNGLE) //Pantepui
			.fromColour(203, 203, 55).toLevel(BIOME_SPARSE_JUNGLE) //Paraguana xeric scrub
			.fromColour(108, 230, 137).toLevel(BIOME_SWAMP) //Paraná flooded savanna
			.fromColour(130, 155, 231).toLevel(BIOME_PLAINS) //Paropamisus xeric woodlands
			.fromColour(215, 126, 163).toLevel(BIOME_PLAINS) //Patagonian steppe
			.fromColour(61, 37, 200).toLevel(BIOME_SPARSE_JUNGLE) //Patía Valley dry forests
			.fromColour(31, 124, 218).toLevel(BIOME_BAMBOO_JUNGLE) //Peninsular Malaysian montane rain forests
			.fromColour(207, 123, 104).toLevel(BIOME_SWAMP) //Peninsular Malaysian peat swamp forests
			.fromColour(215, 93, 193).toLevel(BIOME_JUNGLE) //Peninsular Malaysian rain forests
			.fromColour(98, 213, 224).toLevel(BIOME_PLAINS) //Pernambuco coastal forests
			.fromColour(129, 187, 238).toLevel(BIOME_SPARSE_JUNGLE) //Pernambuco interior forests
			.fromColour(201, 223, 101).toLevel(BIOME_DESERT) //Persian Gulf desert and semi-desert
			.fromColour(198, 130, 221).toLevel(BIOME_WINDSWEPT_GRAVELLY_HILLS) //Peruvian Yungas
			.fromColour(194, 88, 229).toLevel(BIOME_JUNGLE) //Petén-Veracruz moist forests
			.fromColour(81, 136, 238).toLevel(BIOME_DESERT) //Pilbara shrublands
			.fromColour(208, 189, 15).toLevel(BIOME_WINDSWEPT_FOREST) //Pindus Mountains mixed forests
			.fromColour(109, 203, 112).toLevel(BIOME_FOREST) //Piney Woods forests
			.fromColour(170, 124, 213).toLevel(BIOME_FOREST) //Po Basin mixed forests
			.fromColour(16, 210, 71).toLevel(BIOME_PLAINS) //Pontic steppe
			.fromColour(213, 162, 60).toLevel(BIOME_SPARSE_JUNGLE); //Puerto Rican dry forests

		eco_vanilla = eco_vanilla.fromColour(130, 112, 235).toLevel(BIOME_JUNGLE) //Puerto Rican moist forests
			.fromColour(86, 76, 205).toLevel(BIOME_FOREST) //Puget lowland forests
			.fromColour(35, 205, 61).toLevel(BIOME_SWAMP) //Purus varzeá
			.fromColour(82, 113, 200).toLevel(BIOME_JUNGLE) //Purus-Madeira moist forests
			.fromColour(218, 156, 70).toLevel(BIOME_FOREST) //Pyrenees conifer and mixed forests
			.fromColour(228, 124, 38).toLevel(BIOME_DESERT) //Qaidam Basin semi-desert
			.fromColour(225, 15, 201).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Qilian Mountains conifer forests
			.fromColour(76, 216, 165).toLevel(BIOME_WINDSWEPT_HILLS) //Qilian Mountains subalpine meadows
			.fromColour(202, 54, 190).toLevel(BIOME_FOREST) //Qin Ling Mountains deciduous forests
			.fromColour(204, 67, 156).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Qionglai-Minshan conifer forests
			.fromColour(234, 28, 193).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Queen Charlotte Islands
			.fromColour(215, 211, 91).toLevel(BIOME_JUNGLE) //Queensland tropical rain forests
			.fromColour(226, 82, 135).toLevel(BIOME_FLOWER_FOREST) //Rakiura Island temperate forests
			.fromColour(232, 217, 104).toLevel(BIOME_DESERT) //Rann of Kutch seasonal salt marsh
			.fromColour(209, 134, 53).toLevel(BIOME_SPARSE_JUNGLE) //Rapa Nui subtropical broadleaf forests
			.fromColour(166, 77, 234).toLevel(BIOME_SPARSE_JUNGLE) //Red River freshwater swamp forests
			.fromColour(230, 237, 104).toLevel(BIOME_DESERT) //Red Sea coastal desert
			.fromColour(127, 125, 238).toLevel(BIOME_DESERT) //Red Sea Nubo-Sindian tropical desert and semi-desert
			.fromColour(89, 239, 234).toLevel(BIOME_DESERT) //Registan-North Pakistan sandy desert
			.fromColour(227, 201, 114).toLevel(BIOME_FOREST) //Richmond temperate forests
			.fromColour(206, 146, 114).toLevel(BIOME_BAMBOO_JUNGLE) //Rio Negro campinarana
			.fromColour(216, 79, 77).toLevel(BIOME_SNOWY_PLAINS) //Rock and Ice
			.fromColour(155, 118, 207).toLevel(BIOME_OLD_GROWTH_SPRUCE_TAIGA) //Rodope montane mixed forests
			.fromColour(104, 213, 112).toLevel(BIOME_STONY_PEAKS) //Rwenzori-Virunga montane moorlands
			.fromColour(60, 62, 221).toLevel(BIOME_DESERT) //Sahara desert
			.fromColour(103, 204, 237).toLevel(BIOME_SAVANNA) //Saharan flooded grasslands
			.fromColour(196, 236, 137).toLevel(BIOME_SAVANNA) //Saharan halophytics
			.fromColour(64, 135, 216).toLevel(BIOME_SAVANNA) //Sahelian Acacia savanna
			.fromColour(12, 32, 210).toLevel(BIOME_TAIGA) //Sakhalin Island taiga
			.fromColour(203, 108, 82).toLevel(BIOME_JUNGLE) //Samoan tropical moist forests
			.fromColour(163, 235, 39).toLevel(BIOME_STONY_PEAKS) //San Félix-San Ambrosio Islands temperate forests
			.fromColour(26, 240, 37).toLevel(BIOME_DESERT) //San Lucan xeric scrub
			.fromColour(222, 132, 47).toLevel(BIOME_WINDSWEPT_FOREST) //Santa Marta montane forests
			.fromColour(15, 47, 233).toLevel(BIOME_WINDSWEPT_SAVANNA) //Santa Marta páramo
			.fromColour(222, 104, 173).toLevel(BIOME_JUNGLE) //Sao Tome, Principe and Annobon moist lowland forests
			.fromColour(227, 185, 18).toLevel(BIOME_FOREST) //Sarmatic mixed forests
			.fromColour(216, 186, 39).toLevel(BIOME_DARK_FOREST) //Sayan Alpine meadows and tundra
			.fromColour(119, 86, 216).toLevel(BIOME_PLAINS) //Sayan Intermontane steppe
			.fromColour(99, 154, 200).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Sayan montane conifer forests
			.fromColour(107, 114, 236).toLevel(BIOME_TAIGA) //Scandinavian and Russian taiga
			.fromColour(168, 46, 216).toLevel(BIOME_TAIGA) //Scandinavian coastal conifer forests
			.fromColour(149, 121, 215).toLevel(BIOME_BIRCH_FOREST) //Scandinavian Montane Birch forest and grasslands
			.fromColour(17, 207, 134).toLevel(BIOME_SNOWY_SLOPES) //Scotia Sea Islands tundra
			.fromColour(132, 210, 224).toLevel(BIOME_DESERT) //Sechura desert
			.fromColour(239, 26, 51).toLevel(BIOME_PLAINS) //Selenge-Orkhon forest steppe
			.fromColour(235, 127, 18).toLevel(BIOME_JUNGLE) //Seram rain forests
			.fromColour(123, 239, 52).toLevel(BIOME_WINDSWEPT_SAVANNA) //Serengeti volcanic grasslands
			.fromColour(237, 129, 114).toLevel(BIOME_MEADOW) //Serra do Mar coastal forests
			.fromColour(161, 219, 127).toLevel(BIOME_FOREST) //Sichuan Basin evergreen broadleaf forests
			.fromColour(125, 228, 129).toLevel(BIOME_WOODED_BADLANDS) //Sierra de la Laguna dry forests
			.fromColour(235, 174, 121).toLevel(BIOME_WOODED_BADLANDS) //Sierra de la Laguna pine-oak forests
			.fromColour(118, 64, 205).toLevel(BIOME_JUNGLE) //Sierra de los Tuxtlas
			.fromColour(76, 93, 225).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Sierra Juarez and San Pedro Martir pine-oak forests
			.fromColour(217, 115, 52).toLevel(BIOME_JUNGLE) //Sierra Madre de Chiapas moist forests
			.fromColour(232, 239, 138).toLevel(BIOME_TAIGA) //Sierra Madre de Oaxaca pine-oak forests
			.fromColour(145, 209, 42).toLevel(BIOME_WOODED_BADLANDS) //Sierra Madre del Sur pine-oak forests
			.fromColour(226, 91, 60).toLevel(BIOME_WOODED_BADLANDS) //Sierra Madre Occidental pine-oak forests
			.fromColour(215, 50, 233).toLevel(BIOME_WINDSWEPT_FOREST) //Sierra Madre Oriental pine-oak forests
			.fromColour(20, 226, 13).toLevel(BIOME_TAIGA) //Sierra Nevada forests
			.fromColour(74, 225, 185).toLevel(BIOME_BADLANDS) //Simpson desert
			.fromColour(92, 220, 45).toLevel(BIOME_SPARSE_JUNGLE) //Sinaloan dry forests
			.fromColour(74, 130, 235).toLevel(BIOME_SPARSE_JUNGLE) //Sinú Valley dry forests
			.fromColour(104, 211, 103).toLevel(BIOME_BADLANDS) //Snake-Columbia shrub steppe
			.fromColour(231, 129, 111).toLevel(BIOME_JUNGLE); //Society Islands tropical moist forests

		eco_vanilla = eco_vanilla.fromColour(222, 120, 190).toLevel(BIOME_DESERT) //Socotra Island xeric shrublands
			.fromColour(126, 212, 136).toLevel(BIOME_JUNGLE) //Solimões-Japurá moist forests
			.fromColour(215, 85, 25).toLevel(BIOME_JUNGLE) //Solomon Islands rain forests
			.fromColour(186, 209, 93).toLevel(BIOME_SAVANNA) //Somali Acacia-Commiphora bushlands and thickets
			.fromColour(209, 54, 82).toLevel(BIOME_SPARSE_JUNGLE) //Somali montane xeric woodlands
			.fromColour(212, 151, 54).toLevel(BIOME_DESERT) //Sonoran desert
			.fromColour(236, 44, 143).toLevel(BIOME_SPARSE_JUNGLE) //Sonoran-Sinaloan transition subtropical dry forest
			.fromColour(92, 75, 203).toLevel(BIOME_MANGROVE_SWAMP) //South American Pacific mangroves
			.fromColour(227, 173, 85).toLevel(BIOME_WINDSWEPT_HILLS) //South Appenine mixed montane forests
			.fromColour(122, 201, 135).toLevel(BIOME_MEADOW) //South Avalon-Burin oceanic barrens
			.fromColour(114, 203, 25).toLevel(BIOME_WINDSWEPT_FOREST) //South Central Rockies forests
			.fromColour(204, 13, 70).toLevel(BIOME_BEACH) //South China Sea Islands
			.fromColour(28, 208, 15).toLevel(BIOME_SPARSE_JUNGLE) //South China-Vietnam subtropical evergreen forests
			.fromColour(115, 168, 221).toLevel(BIOME_SPARSE_JUNGLE) //South Deccan Plateau dry deciduous forests
			.fromColour(60, 174, 215).toLevel(BIOME_SWAMP) //South Florida rocklands
			.fromColour(61, 227, 205).toLevel(BIOME_DESERT) //South Iran Nubo-Sindian desert and semi-desert
			.fromColour(238, 138, 105).toLevel(BIOME_STONY_PEAKS) //South Island montane grasslands
			.fromColour(50, 215, 146).toLevel(BIOME_FOREST) //South Island temperate forests
			.fromColour(226, 91, 190).toLevel(BIOME_SAVANNA) //South Malawi montane forest-grassland mosaic
			.fromColour(120, 235, 19).toLevel(BIOME_DESERT) //South Saharan steppe and woodlands
			.fromColour(234, 221, 83).toLevel(BIOME_FOREST) //South Sakhalin-Kurile mixed forests
			.fromColour(93, 60, 225).toLevel(BIOME_DARK_FOREST) //South Siberian forest steppe
			.fromColour(130, 226, 100).toLevel(BIOME_JUNGLE) //South Taiwan monsoon rain forests
			.fromColour(220, 182, 124).toLevel(BIOME_JUNGLE) //South Western Ghats moist deciduous forests
			.fromColour(209, 49, 68).toLevel(BIOME_JUNGLE) //South Western Ghats montane rain forests
			.fromColour(115, 221, 165).toLevel(BIOME_FOREST) //Southeast Australia temperate forests
			.fromColour(207, 103, 162).toLevel(BIOME_SAVANNA) //Southeast Australia temperate savanna
			.fromColour(176, 234, 118).toLevel(BIOME_MEADOW) //Southeast Tibet shrublands and meadows
			.fromColour(225, 36, 99).toLevel(BIOME_FOREST) //Southeastern conifer forests
			.fromColour(141, 44, 211).toLevel(BIOME_SAVANNA) //Southeastern Iberian shrubs and woodlands
			.fromColour(112, 95, 236).toLevel(BIOME_SPARSE_JUNGLE) //Southeastern Indochina dry evergreen forests
			.fromColour(141, 230, 72).toLevel(BIOME_FLOWER_FOREST) //Southeastern mixed forests
			.fromColour(187, 96, 233).toLevel(BIOME_JUNGLE) //Southeastern Papuan rain forests
			.fromColour(115, 123, 210).toLevel(BIOME_SAVANNA) //Southern Acacia-Commiphora bushlands and thickets
			.fromColour(74, 210, 94).toLevel(BIOME_SAVANNA) //Southern Africa bushveld
			.fromColour(230, 69, 126).toLevel(BIOME_SAVANNA) //Southern Africa mangroves
			.fromColour(220, 220, 93).toLevel(BIOME_WINDSWEPT_FOREST) //Southern Anatolian montane conifer and deciduous forests
			.fromColour(15, 232, 83).toLevel(BIOME_STONY_PEAKS) //Southern Andean steppe
			.fromColour(33, 213, 75).toLevel(BIOME_SPARSE_JUNGLE) //Southern Andean Yungas
			.fromColour(175, 121, 218).toLevel(BIOME_JUNGLE) //Southern Annamites montane rain forests
			.fromColour(58, 92, 207).toLevel(BIOME_MANGROVE_SWAMP) //Southern Atlantic mangroves
			.fromColour(236, 143, 188).toLevel(BIOME_SAVANNA) //Southern Cone Mesopotamian savanna
			.fromColour(225, 127, 197).toLevel(BIOME_SPARSE_JUNGLE) //Southern Congolian forest-savanna mosaic
			.fromColour(140, 168, 234).toLevel(BIOME_FOREST) //Southern Great Lakes forests
			.fromColour(70, 159, 237).toLevel(BIOME_TAIGA) //Southern Hudson Bay taiga
			.fromColour(102, 216, 87).toLevel(BIOME_SNOWY_SLOPES) //Southern Indian Ocean Islands tundra
			.fromColour(25, 117, 238).toLevel(BIOME_FOREST) //Southern Korea evergreen forests
			.fromColour(97, 149, 220).toLevel(BIOME_MANGROVE_SWAMP) //Southern Mesoamerican Pacific mangroves
			.fromColour(240, 26, 140).toLevel(BIOME_SAVANNA) //Southern Miombo woodlands
			.fromColour(112, 150, 239).toLevel(BIOME_JUNGLE) //Southern New Guinea lowland rain forests
			.fromColour(211, 216, 108).toLevel(BIOME_SPARSE_JUNGLE) //Southern Pacific dry forests
			.fromColour(81, 45, 213).toLevel(BIOME_FOREST) //Southern Rift montane forest-grassland mosaic
			.fromColour(187, 200, 73).toLevel(BIOME_SPARSE_JUNGLE) //Southern Vietnam lowland dry forests
			.fromColour(201, 237, 139).toLevel(BIOME_SPARSE_JUNGLE) //Southern Zanzibar-Inhambane coastal forest mosaic
			.fromColour(50, 195, 203).toLevel(BIOME_JUNGLE) //Southwest Amazon moist forests
			.fromColour(85, 78, 218).toLevel(BIOME_SAVANNA) //Southwest Australia savanna
			.fromColour(123, 221, 75).toLevel(BIOME_SAVANNA) //Southwest Australia woodlands
			.fromColour(220, 157, 109).toLevel(BIOME_SWAMP) //Southwest Borneo freshwater swamp forests
			.fromColour(215, 190, 127).toLevel(BIOME_SUNFLOWER_PLAINS) //Southwest Iberian Mediterranean sclerophyllous and mixed forests
			.fromColour(147, 240, 104).toLevel(BIOME_DESERT) //Southwestern Arabian foothills savanna
			.fromColour(113, 236, 144).toLevel(BIOME_DESERT) //Southwestern Arabian montane woodlands
			.fromColour(108, 201, 210).toLevel(BIOME_JUNGLE) //Sri Lanka dry-zone dry evergreen forests
			.fromColour(202, 202, 45).toLevel(BIOME_JUNGLE) //Sri Lanka lowland rain forests
			.fromColour(62, 227, 106).toLevel(BIOME_JUNGLE); //Sri Lanka montane rain forests

		eco_vanilla = eco_vanilla.fromColour(145, 124, 229).toLevel(BIOME_JAGGED_PEAKS) //St. Helena scrub and woodlands
			.fromColour(131, 24, 224).toLevel(BIOME_STONY_PEAKS) //St. Peter and St. Paul rocks
			.fromColour(223, 94, 58).toLevel(BIOME_WINDSWEPT_SAVANNA) //Succulent Karoo
			.fromColour(200, 27, 105).toLevel(BIOME_SWAMP) //Suiphun-Khanka meadows and forest meadows
			.fromColour(230, 111, 186).toLevel(BIOME_MEADOW) //Sulaiman Range alpine meadows
			.fromColour(39, 158, 205).toLevel(BIOME_JUNGLE) //Sulawesi lowland rain forests
			.fromColour(81, 209, 58).toLevel(BIOME_JUNGLE) //Sulawesi montane rain forests
			.fromColour(222, 131, 199).toLevel(BIOME_JUNGLE) //Sulu Archipelago rain forests
			.fromColour(165, 63, 202).toLevel(BIOME_SWAMP) //Sumatran freshwater swamp forests
			.fromColour(220, 50, 236).toLevel(BIOME_JUNGLE) //Sumatran lowland rain forests
			.fromColour(180, 18, 216).toLevel(BIOME_BAMBOO_JUNGLE) //Sumatran montane rain forests
			.fromColour(229, 32, 95).toLevel(BIOME_SWAMP) //Sumatran peat swamp forests
			.fromColour(34, 216, 155).toLevel(BIOME_WINDSWEPT_FOREST) //Sumatran tropical pine forests
			.fromColour(62, 204, 30).toLevel(BIOME_SPARSE_JUNGLE) //Sumba deciduous forests
			.fromColour(175, 118, 239).toLevel(BIOME_MANGROVE_SWAMP) //Sunda Shelf mangroves
			.fromColour(134, 67, 227).toLevel(BIOME_JUNGLE) //Sundaland heath forests
			.fromColour(207, 46, 191).toLevel(BIOME_MANGROVE_SWAMP) //Sundarbans freshwater swamp forests
			.fromColour(228, 114, 86).toLevel(BIOME_MANGROVE_SWAMP) //Sundarbans mangroves
			.fromColour(223, 172, 33).toLevel(BIOME_SAVANNA) //Swan Coastal Plain Scrub and Woodlands
			.fromColour(146, 66, 217).toLevel(BIOME_CHERRY_GROVE) //Taiheiyo evergreen forests
			.fromColour(82, 84, 204).toLevel(BIOME_OLD_GROWTH_SPRUCE_TAIGA) //Taiheiyo montane deciduous forests
			.fromColour(95, 110, 210).toLevel(BIOME_SNOWY_TAIGA) //Taimyr-Central Siberian tundra
			.fromColour(27, 100, 218).toLevel(BIOME_SPARSE_JUNGLE) //Taiwan subtropical evergreen forests
			.fromColour(26, 99, 215).toLevel(BIOME_DESERT) //Taklimakan desert
			.fromColour(236, 128, 128).toLevel(BIOME_WINDSWEPT_FOREST) //Talamancan montane forests
			.fromColour(221, 101, 227).toLevel(BIOME_PLAINS) //Tamaulipan matorral
			.fromColour(206, 217, 121).toLevel(BIOME_PLAINS) //Tamaulipan mezquital
			.fromColour(237, 109, 84).toLevel(BIOME_JUNGLE) //Tapajós-Xingu moist forests
			.fromColour(202, 183, 74).toLevel(BIOME_SAVANNA) //Tarim Basin deciduous forests and steppe
			.fromColour(219, 39, 162).toLevel(BIOME_WINDSWEPT_FOREST) //Tasmanian Central Highland forests
			.fromColour(233, 132, 146).toLevel(BIOME_FLOWER_FOREST) //Tasmanian temperate forests
			.fromColour(51, 21, 202).toLevel(BIOME_DARK_FOREST) //Tasmanian temperate rain forests
			.fromColour(33, 217, 131).toLevel(BIOME_DESERT) //Tehuacán Valley matorral
			.fromColour(214, 49, 220).toLevel(BIOME_JUNGLE) //Tenasserim-South Thailand semi-evergreen rain forests
			.fromColour(227, 136, 168).toLevel(BIOME_SAVANNA) //Terai-Duar savanna and grasslands
			.fromColour(203, 62, 228).toLevel(BIOME_PLAINS) //Texas blackland prairies
			.fromColour(230, 142, 28).toLevel(BIOME_DESERT) //Thar desert
			.fromColour(75, 153, 217).toLevel(BIOME_PLAINS) //Tian Shan foothill arid steppe
			.fromColour(211, 117, 167).toLevel(BIOME_SNOWY_SLOPES) //Tian Shan montane conifer forests
			.fromColour(107, 75, 223).toLevel(BIOME_SNOWY_SLOPES) //Tian Shan montane steppe and meadows
			.fromColour(218, 136, 68).toLevel(BIOME_DESERT) //Tibesti-Jebel Uweinat montane xeric woodlands
			.fromColour(212, 27, 129).toLevel(BIOME_PLAINS) //Tibetan Plateau alpine shrublands and meadows
			.fromColour(238, 210, 100).toLevel(BIOME_SWAMP) //Tigris-Euphrates alluvial salt marsh
			.fromColour(213, 95, 91).toLevel(BIOME_SPARSE_JUNGLE) //Timor and Wetar deciduous forests
			.fromColour(13, 36, 208).toLevel(BIOME_DESERT) //Tirari-Sturt stony desert
			.fromColour(96, 189, 220).toLevel(BIOME_JUNGLE) //Tocantins-Pindare moist forests
			.fromColour(200, 223, 54).toLevel(BIOME_JUNGLE) //Tongan tropical moist forests
			.fromColour(236, 139, 197).toLevel(BIOME_SPARSE_JUNGLE) //Tonle Sap freshwater swamp forests
			.fromColour(98, 214, 200).toLevel(BIOME_SWAMP) //Tonle Sap-Mekong peat swamp forests
			.fromColour(121, 216, 161).toLevel(BIOME_SNOWY_SLOPES) //Torngat Mountain tundra
			.fromColour(58, 207, 60).toLevel(BIOME_SAVANNA) //Trans Fly savanna and grasslands
			.fromColour(148, 208, 79).toLevel(BIOME_SWAMP) //Trans-Baikal Bald Mountain tundra
			.fromColour(46, 223, 85).toLevel(BIOME_TAIGA) //Trans-Baikal conifer forests
			.fromColour(196, 227, 38).toLevel(BIOME_WOODED_BADLANDS) //Trans-Mexican Volcanic Belt pine-oak forests
			.fromColour(32, 18, 221).toLevel(BIOME_STONY_PEAKS) //Trindade-Martin Vaz Islands tropical forests
			.fromColour(175, 88, 218).toLevel(BIOME_JUNGLE) //Trinidad and Tobago moist forests
			.fromColour(216, 62, 35).toLevel(BIOME_GROVE) //Tristan Da Cunha-Gough Islands shrub and grasslands
			.fromColour(215, 145, 14).toLevel(BIOME_JUNGLE) //Trobriand Islands rain forests
			.fromColour(162, 238, 118).toLevel(BIOME_JUNGLE) //Tuamotu tropical moist forests
			.fromColour(218, 227, 91).toLevel(BIOME_JUNGLE) //Tubuai tropical moist forests
			.fromColour(128, 210, 177).toLevel(BIOME_SPARSE_JUNGLE) //Tumbes-Piura dry forests
			.fromColour(56, 218, 230).toLevel(BIOME_SUNFLOWER_PLAINS) //Tyrrhenian-Adriatic Sclerophyllous and mixed forests
			.fromColour(128, 214, 144).toLevel(BIOME_JUNGLE) //Uatuma-Trombetas moist forests
			.fromColour(220, 61, 25).toLevel(BIOME_JUNGLE); //Ucayali moist forests

		eco_vanilla = eco_vanilla.fromColour(62, 154, 224).toLevel(BIOME_SPARSE_JUNGLE) //Upper Gangetic Plains moist deciduous forests
			.fromColour(64, 215, 150).toLevel(BIOME_FOREST) //Upper Midwest forest-savanna transition
			.fromColour(207, 78, 110).toLevel(BIOME_TAIGA) //Ural montane forests and tundra
			.fromColour(208, 161, 104).toLevel(BIOME_SAVANNA) //Uruguayan savanna
			.fromColour(206, 83, 78).toLevel(BIOME_FOREST) //Ussuri broadleaf and mixed forests
			.fromColour(159, 230, 67).toLevel(BIOME_TAIGA) //Valdivian temperate forests
			.fromColour(114, 187, 207).toLevel(BIOME_JUNGLE) //Vanuatu rain forests
			.fromColour(23, 142, 201).toLevel(BIOME_WINDSWEPT_FOREST) //Venezuelan Andes montane forests
			.fromColour(207, 63, 121).toLevel(BIOME_SPARSE_JUNGLE) //Veracruz dry forests
			.fromColour(208, 24, 76).toLevel(BIOME_JUNGLE) //Veracruz moist forests
			.fromColour(208, 126, 200).toLevel(BIOME_WINDSWEPT_FOREST) //Veracruz montane forests
			.fromColour(55, 228, 165).toLevel(BIOME_SPARSE_JUNGLE) //Victoria Basin forest-savanna mosaic
			.fromColour(221, 28, 22).toLevel(BIOME_SAVANNA) //Victoria Plains tropical savanna
			.fromColour(153, 219, 131).toLevel(BIOME_JUNGLE) //Vogelkop montane rain forests
			.fromColour(214, 44, 106).toLevel(BIOME_JUNGLE) //Vogelkop-Aru lowland rain forests
			.fromColour(145, 40, 202).toLevel(BIOME_OLD_GROWTH_BIRCH_FOREST) //Wasatch and Uinta montane forests
			.fromColour(107, 186, 210).toLevel(BIOME_DESERT) //West Saharan montane xeric woodlands
			.fromColour(202, 219, 48).toLevel(BIOME_TAIGA) //West Siberian taiga
			.fromColour(201, 122, 130).toLevel(BIOME_SAVANNA) //West Sudanian savanna
			.fromColour(200, 133, 224).toLevel(BIOME_BADLANDS) //Western Australian Mulga shrublands
			.fromColour(238, 197, 47).toLevel(BIOME_SPARSE_JUNGLE) //Western Congolian forest-savanna mosaic
			.fromColour(200, 92, 80).toLevel(BIOME_SWAMP) //Western Congolian swamp forests
			.fromColour(129, 186, 215).toLevel(BIOME_JUNGLE) //Western Ecuador moist forests
			.fromColour(141, 202, 80).toLevel(BIOME_FOREST) //Western European broadleaf forests
			.fromColour(240, 175, 132).toLevel(BIOME_FOREST) //Western Great Lakes forests
			.fromColour(210, 123, 184).toLevel(BIOME_JUNGLE) //Western Guinean lowland forests
			.fromColour(136, 228, 38).toLevel(BIOME_PLAINS) //Western Gulf coastal grasslands
			.fromColour(131, 38, 225).toLevel(BIOME_STONY_PEAKS) //Western Himalayan alpine shrub and Meadows
			.fromColour(224, 118, 118).toLevel(BIOME_FOREST) //Western Himalayan broadleaf forests
			.fromColour(90, 201, 35).toLevel(BIOME_OLD_GROWTH_PINE_TAIGA) //Western Himalayan subalpine conifer forests
			.fromColour(61, 209, 232).toLevel(BIOME_SPARSE_JUNGLE) //Western Java montane rain forests
			.fromColour(33, 207, 219).toLevel(BIOME_JUNGLE) //Western Java rain forests
			.fromColour(224, 42, 133).toLevel(BIOME_JUNGLE) //Western Polynesian tropical moist forests
			.fromColour(215, 84, 91).toLevel(BIOME_PLAINS) //Western short grasslands
			.fromColour(117, 226, 109).toLevel(BIOME_FOREST) //Western Siberian hemiboreal forests
			.fromColour(154, 61, 224).toLevel(BIOME_SAVANNA) //Western Zambezian grasslands
			.fromColour(74, 134, 223).toLevel(BIOME_FOREST) //Westland temperate forests
			.fromColour(179, 219, 68).toLevel(BIOME_FOREST) //Willamette Valley forests
			.fromColour(224, 19, 53).toLevel(BIOME_JUNGLE) //Windward Islands moist forests
			.fromColour(155, 208, 20).toLevel(BIOME_SNOWY_PLAINS) //Wrangel Island arctic desert
			.fromColour(210, 156, 80).toLevel(BIOME_PLAINS) //Wyoming Basin shrub steppe
			.fromColour(234, 99, 234).toLevel(BIOME_JUNGLE) //Xingu-Tocantins-Araguaia moist forests
			.fromColour(205, 97, 227).toLevel(BIOME_SNOWY_TAIGA) //Yamal-Gydan tundra
			.fromColour(111, 232, 105).toLevel(BIOME_SPARSE_JUNGLE) //Yap tropical dry forests
			.fromColour(216, 15, 35).toLevel(BIOME_JUNGLE) //Yapen rain forests
			.fromColour(168, 203, 103).toLevel(BIOME_DESERT) //Yarlung Tsangpo arid steppe
			.fromColour(212, 209, 49).toLevel(BIOME_MEADOW) //Yellow Sea saline meadow
			.fromColour(219, 106, 191).toLevel(BIOME_SPARSE_JUNGLE) //Yucatán dry forests
			.fromColour(54, 217, 111).toLevel(BIOME_JUNGLE) //Yucatán moist forests
			.fromColour(236, 189, 60).toLevel(BIOME_TAIGA) //Yukon Interior dry forests
			.fromColour(106, 227, 219).toLevel(BIOME_SPARSE_JUNGLE) //Yunnan Plateau subtropical evergreen forests
			.fromColour(16, 190, 202).toLevel(BIOME_WINDSWEPT_SAVANNA) //Zagros Mountains forest steppe
			.fromColour(203, 48, 68).toLevel(BIOME_SAVANNA) //Zambezian and Mopane woodlands
			.fromColour(231, 146, 140).toLevel(BIOME_SAVANNA) //Zambezian Baikiaea woodlands
			.fromColour(94, 177, 213).toLevel(BIOME_SWAMP) //Zambezian coastal flooded savanna
			.fromColour(30, 35, 200).toLevel(BIOME_SPARSE_JUNGLE) //Zambezian Cryptosepalum dry forests
			.fromColour(219, 94, 70).toLevel(BIOME_SWAMP) //Zambezian flooded grasslands
			.fromColour(17, 234, 187).toLevel(BIOME_SWAMP) //Zambezian halophytics
			.go();

		if (mod_BOP === "True") {
			var eco_bop = wp.applyHeightMap(ecoRegionImage)
				.toWorld(world)
				.shift(shiftLongitute, shiftLatitude)
				.applyToLayer(biomesLayer);

			eco_bop = eco_bop.fromColour(143, 206, 84).toLevel(BIOME_BOP_RAINFOREST) //Admiralty Islands lowland rain forests
				.fromColour(234, 50, 112).toLevel(BIOME_BOP_MEDITERRANEAN_FOREST) //Aegean and Western Turkey sclerophyllous and mixed forests
				.fromColour(227, 85, 108).toLevel(BIOME_BOP_SNOWY_CONIFEROUS_FOREST) //Alps conifer and mixed forests
				.fromColour(234, 32, 136).toLevel(BIOME_BOP_MEDITERRANEAN_FOREST) //Anatolian conifer and deciduous mixed forests
				.fromColour(23, 191, 213).toLevel(BIOME_BOP_RAINFOREST) //Andaman Islands rain forests
				.fromColour(55, 207, 121).toLevel(BIOME_BOP_RAINFOREST) //Araucaria moist forests
				.fromColour(91, 202, 60).toLevel(BIOME_BOP_COLD_DESERT) //Arctic desert
				.fromColour(218, 187, 29).toLevel(BIOME_BYG_CONIFEROUS_FOREST) //Arizona Mountains forests
				.fromColour(217, 52, 104).toLevel(BIOME_BOP_VOLCANO) //Ascension scrub and grasslands
				.fromColour(97, 237, 66).toLevel(BIOME_BOP_RAINFOREST) //Biak-Numfoor rain forests
				.fromColour(92, 205, 150).toLevel(BIOME_BOP_RAINFOREST) //Borneo lowland rain forests
				.fromColour(226, 147, 111).toLevel(BIOME_BOP_RAINFOREST) //Borneo montane rain forests
				.fromColour(59, 15, 220).toLevel(BIOME_BOP_RAINFOREST) //Buru rain forests
				.fromColour(217, 23, 159).toLevel(BIOME_BOP_RAINFOREST) //Caatinga Enclaves moist forests
				.fromColour(60, 167, 200).toLevel(BIOME_BOP_GRASSLAND) //California Central Valley grasslands
				.fromColour(228, 67, 142).toLevel(BIOME_BOP_GRASSLAND) //Cantebury-Otago tussock grasslands
				.fromColour(106, 236, 223).toLevel(BIOME_BOP_RAINFOREST) //Caqueta moist forests
				.fromColour(237, 222, 138).toLevel(BIOME_BOP_RAINFOREST) //Cardamom Mountains rain forests
				.fromColour(220, 106, 218).toLevel(BIOME_BOP_RAINFOREST) //Carolines tropical moist forests
				.fromColour(189, 213, 119).toLevel(BIOME_BOP_RAINFOREST) //Catatumbo moist forests
				.fromColour(226, 37, 229).toLevel(BIOME_BOP_RAINFOREST) //Cayos Miskitos-San Andrés and Providencia moist forests
				.fromColour(200, 38, 157).toLevel(BIOME_BOP_RAINFOREST) //Central American Atlantic moist forests
				.fromColour(157, 214, 77).toLevel(BIOME_BOP_RAINFOREST) //Central Polynesian tropical moist forests
				.fromColour(236, 102, 122).toLevel(BIOME_BOP_RAINFOREST) //Central Range montane rain forests
				.fromColour(224, 60, 98).toLevel(BIOME_BOP_FLOODPLAIN) //Chao Phraya freshwater swamp forests
				.fromColour(125, 201, 117).toLevel(BIOME_BOP_RAINFOREST) //Chocó-Darién moist forests
				.fromColour(107, 63, 228).toLevel(BIOME_BOP_RAINFOREST) //Cocos Island moist forests
				.fromColour(88, 33, 240).toLevel(BIOME_BOP_RAINFOREST) //Cook Islands tropical moist forests
				.fromColour(221, 99, 88).toLevel(BIOME_BOP_MEDITERRANEAN_FOREST) //Corsican montane broadleaf and mixed forests
				.fromColour(207, 21, 136).toLevel(BIOME_BOP_RAINFOREST) //Costa Rican seasonal moist forests
				.fromColour(133, 209, 101).toLevel(BIOME_BOP_MEDITERRANEAN_FOREST) //Crete Mediterranean forests
				.fromColour(234, 14, 219).toLevel(BIOME_BOP_RAINFOREST) //Cuban moist forests
				.fromColour(239, 21, 144).toLevel(BIOME_BOP_MEDITERRANEAN_FOREST) //Cyprus Mediterranean forests
				.fromColour(42, 215, 77).toLevel(BIOME_BOP_PASTURE) //Daurian forest steppe
				.fromColour(91, 198, 210).toLevel(BIOME_BOP_RAINFOREST) //Eastern Java-Bali montane rain forests
				.fromColour(229, 105, 67).toLevel(BIOME_BOP_RAINFOREST) //Eastern Java-Bali rain forests
				.fromColour(113, 205, 47).toLevel(BIOME_BOP_MEDITERRANEAN_FOREST) //Eastern Mediterranean conifer-sclerophyllous-broadleaf forests
				.fromColour(104, 97, 227).toLevel(BIOME_BOP_RAINFOREST) //Eastern Micronesia tropical moist forests
				.fromColour(227, 133, 32).toLevel(BIOME_BOP_BAYOU) //Everglades
				.fromColour(208, 157, 112).toLevel(BIOME_BOP_RAINFOREST) //Fernando de Noronha-Atol das Rocas moist forests
				.fromColour(135, 127, 210).toLevel(BIOME_BOP_RAINFOREST) //Fiji tropical moist forests
				.fromColour(222, 132, 53).toLevel(BIOME_BOP_PRAIRIE) //Flint Hills tall grasslands
				.fromColour(87, 217, 48).toLevel(BIOME_BOP_RAINFOREST) //Greater Negros-Panay rain forests
				.fromColour(137, 229, 51).toLevel(BIOME_BOP_RAINFOREST) //Guianan Highlands moist forests
				.fromColour(99, 237, 115).toLevel(BIOME_BOP_RAINFOREST) //Guianan moist forests
				.fromColour(223, 91, 76).toLevel(BIOME_BOP_RAINFOREST) //Guianan piedmont and lowland moist forests
				.fromColour(222, 57, 151).toLevel(BIOME_BOP_RAINFOREST) //Hainan Island monsoon rain forests
				.fromColour(238, 107, 100).toLevel(BIOME_BOP_RAINFOREST) //Halmahera rain forests
				.fromColour(214, 92, 186).toLevel(BIOME_BOP_RAINFOREST) //Hawaii tropical moist forests
				.fromColour(99, 117, 230).toLevel(BIOME_BOP_RAINFOREST) //Hispaniolan moist forests
				.fromColour(108, 36, 202).toLevel(BIOME_BOP_GRASSLAND) //Humid Pampas
				.fromColour(204, 175, 78).toLevel(BIOME_BOP_RAINFOREST) //Huon Peninsula montane rain forests
				.fromColour(108, 217, 208).toLevel(BIOME_BOP_MEDITERRANEAN_FOREST) //Iberian conifer forests
				.fromColour(106, 203, 80).toLevel(BIOME_BOP_MEDITERRANEAN_FOREST) //Illyrian deciduous forests
				.fromColour(124, 211, 127).toLevel(BIOME_BOP_RAINFOREST) //Isthmian-Atlantic moist forests
				.fromColour(89, 230, 139).toLevel(BIOME_BOP_RAINFOREST) //Isthmian-Pacific moist forests
				.fromColour(30, 217, 114).toLevel(BIOME_BOP_MEDITERRANEAN_FOREST) //Italian sclerophyllous and semi-deciduous forests
				.fromColour(84, 161, 203).toLevel(BIOME_BOP_RAINFOREST) //Jamaican moist forests
				.fromColour(179, 120, 204).toLevel(BIOME_BOP_RAINFOREST) //Japurá-Solimoes-Negro moist forests
				.fromColour(219, 127, 199).toLevel(BIOME_BOP_RAINFOREST) //Juruá-Purus moist forests
				.fromColour(94, 196, 207).toLevel(BIOME_BOP_RAINFOREST) //Kayah-Karen montane rain forests
				.fromColour(119, 15, 216).toLevel(BIOME_BOP_FIELD) //Kazakh forest steppe
				.fromColour(71, 179, 212).toLevel(BIOME_BOP_SHRUBLAND) //Kazakh steppe
				.fromColour(54, 210, 197).toLevel(BIOME_BOP_RAINFOREST); //Kermadec Islands subtropical moist forests

			eco_bop = eco_bop.fromColour(34, 234, 234).toLevel(BIOME_BOP_REDWOOD_FOREST) //Klamath-Siskiyou forests
				.fromColour(233, 178, 49).toLevel(BIOME_BOP_RAINFOREST) //Leeward Islands moist forests
				.fromColour(137, 49, 225).toLevel(BIOME_BOP_RAINFOREST) //Louisiade Archipelago rain forests
				.fromColour(124, 146, 225).toLevel(BIOME_BOP_RAINFOREST) //Luang Prabang montane rain forests
				.fromColour(123, 202, 127).toLevel(BIOME_BOP_RAINFOREST) //Luzon montane rain forests
				.fromColour(209, 178, 116).toLevel(BIOME_BOP_RAINFOREST) //Luzon rain forests
				.fromColour(45, 218, 204).toLevel(BIOME_BOP_RAINFOREST) //Madeira-Tapajós moist forests
				.fromColour(208, 88, 48).toLevel(BIOME_BOP_RAINFOREST) //Magdalena-Urabá moist forests
				.fromColour(155, 236, 139).toLevel(BIOME_BOP_RAINFOREST) //Malabar Coast moist forests
				.fromColour(54, 236, 72).toLevel(BIOME_BOP_RAINFOREST) //Maldives-Lakshadweep-Chagos Archipelago tropical moist forests
				.fromColour(62, 203, 15).toLevel(BIOME_BOP_RAINFOREST) //Marquesas tropical moist forests
				.fromColour(118, 96, 232).toLevel(BIOME_BOP_RAINFOREST) //Mentawai Islands rain forests
				.fromColour(207, 117, 65).toLevel(BIOME_BOP_RAINFOREST) //Mindanao montane rain forests
				.fromColour(50, 123, 225).toLevel(BIOME_BOP_RAINFOREST) //Mindanao-Eastern Visayas rain forests
				.fromColour(178, 118, 215).toLevel(BIOME_BOP_RAINFOREST) //Mindoro rain forests
				.fromColour(231, 154, 112).toLevel(BIOME_BOP_RAINFOREST) //Mizoram-Manipur-Kachin rain forests
				.fromColour(201, 35, 154).toLevel(BIOME_BOP_RAINFOREST) //Myanmar coastal rain forests
				.fromColour(228, 72, 158).toLevel(BIOME_BOP_RAINFOREST) //Napo moist forests
				.fromColour(240, 38, 75).toLevel(BIOME_BOP_PRAIRIE) //Nebraska Sand Hills mixed grasslands
				.fromColour(215, 232, 127).toLevel(BIOME_BOP_RAINFOREST) //Negro-Branco moist forests
				.fromColour(107, 118, 214).toLevel(BIOME_BOP_RAINFOREST) //New Britain-New Ireland lowland rain forests
				.fromColour(200, 83, 204).toLevel(BIOME_BOP_RAINFOREST) //New Britain-New Ireland montane rain forests
				.fromColour(226, 209, 58).toLevel(BIOME_BOP_RAINFOREST) //New Caledonia rain forests
				.fromColour(110, 203, 49).toLevel(BIOME_BOP_RAINFOREST) //Nicobar Islands rain forests
				.fromColour(61, 167, 238).toLevel(BIOME_BOP_CHERRY_BLOSSOM_GROVE) //Nihonkai evergreen forests
				.fromColour(206, 145, 65).toLevel(BIOME_BOP_CHERRY_BLOSSOM_GROVE) //Nihonkai montane deciduous forests
				.fromColour(58, 218, 37).toLevel(BIOME_BOP_LUSH_DESERT) //Nile Delta flooded savanna
				.fromColour(31, 203, 63).toLevel(BIOME_BOP_JADE_CLIFFS) //North Central Rockies forests
				.fromColour(217, 223, 31).toLevel(BIOME_BOP_RAINFOREST) //North Western Ghats montane rain forests
				.fromColour(75, 61, 205).toLevel(BIOME_BOP_RAINFOREST) //Northern Annamites rain forests
				.fromColour(118, 224, 180).toLevel(BIOME_BOP_REDWOOD_FOREST) //Northern California coastal forests
				.fromColour(235, 102, 45).toLevel(BIOME_BOP_GRASSLAND) //Northern mixed grasslands
				.fromColour(194, 122, 216).toLevel(BIOME_BOP_RAINFOREST) //Northern New Guinea montane rain forests
				.fromColour(169, 114, 206).toLevel(BIOME_BOP_RAINFOREST) //Northern Vietnam lowland rain forests
				.fromColour(236, 79, 123).toLevel(BIOME_BOP_RAINFOREST) //Ogasawara subtropical moist forests
				.fromColour(15, 133, 211).toLevel(BIOME_BOP_RAINFOREST) //Palau tropical moist forests
				.fromColour(24, 217, 185).toLevel(BIOME_BOP_RAINFOREST) //Palawan rain forests
				.fromColour(235, 109, 138).toLevel(BIOME_BOP_FLOODPLAIN) //Pantanal
				.fromColour(215, 126, 163).toLevel(BIOME_BOP_PRAIRIE) //Patagonian steppe
				.fromColour(31, 124, 218).toLevel(BIOME_BOP_RAINFOREST) //Peninsular Malaysian montane rain forests
				.fromColour(215, 93, 193).toLevel(BIOME_BOP_RAINFOREST) //Peninsular Malaysian rain forests
				.fromColour(194, 88, 229).toLevel(BIOME_BOP_RAINFOREST) //Petén-Veracruz moist forests
				.fromColour(130, 112, 235).toLevel(BIOME_BOP_RAINFOREST) //Puerto Rican moist forests
				.fromColour(82, 113, 200).toLevel(BIOME_BOP_RAINFOREST) //Purus-Madeira moist forests
				.fromColour(218, 156, 70).toLevel(BIOME_BOP_MEDITERRANEAN_FOREST) //Pyrenees conifer and mixed forests
				.fromColour(215, 211, 91).toLevel(BIOME_BOP_RAINFOREST) //Queensland tropical rain forests
				.fromColour(203, 108, 82).toLevel(BIOME_BOP_RAINFOREST) //Samoan tropical moist forests
				.fromColour(168, 46, 216).toLevel(BIOME_BOP_CONIFEROUS_FOREST) //Scandinavian coastal conifer forests
				.fromColour(235, 127, 18).toLevel(BIOME_BOP_RAINFOREST) //Seram rain forests
				.fromColour(123, 239, 52).toLevel(BIOME_BOP_VOLCANO) //Serengeti volcanic grasslands
				.fromColour(217, 115, 52).toLevel(BIOME_BOP_RAINFOREST) //Sierra Madre de Chiapas moist forests
				.fromColour(231, 129, 111).toLevel(BIOME_BOP_RAINFOREST) //Society Islands tropical moist forests
				.fromColour(126, 212, 136).toLevel(BIOME_BOP_RAINFOREST) //Solimões-Japurá moist forests
				.fromColour(215, 85, 25).toLevel(BIOME_BOP_RAINFOREST) //Solomon Islands rain forests
				.fromColour(238, 138, 105).toLevel(BIOME_BOP_GRASSLAND) //South Island montane grasslands
				.fromColour(130, 226, 100).toLevel(BIOME_BOP_RAINFOREST) //South Taiwan monsoon rain forests
				.fromColour(209, 49, 68).toLevel(BIOME_BOP_RAINFOREST) //South Western Ghats montane rain forests
				.fromColour(187, 96, 233).toLevel(BIOME_BOP_RAINFOREST) //Southeastern Papuan rain forests
				.fromColour(220, 220, 93).toLevel(BIOME_BOP_MEDITERRANEAN_FOREST) //Southern Anatolian montane conifer and deciduous forests
				.fromColour(175, 121, 218).toLevel(BIOME_BOP_RAINFOREST) //Southern Annamites montane rain forests
				.fromColour(112, 150, 239).toLevel(BIOME_BOP_RAINFOREST) //Southern New Guinea lowland rain forests
				.fromColour(50, 195, 203).toLevel(BIOME_BOP_RAINFOREST) //Southwest Amazon moist forests
				.fromColour(215, 190, 127).toLevel(BIOME_BOP_MEDITERRANEAN_FOREST) //Southwest Iberian Mediterranean sclerophyllous and mixed forests
				.fromColour(202, 202, 45).toLevel(BIOME_BOP_RAINFOREST); //Sri Lanka lowland rain forests

			eco_bop = eco_bop.fromColour(62, 227, 106).toLevel(BIOME_BOP_RAINFOREST) //Sri Lanka montane rain forests
				.fromColour(145, 124, 229).toLevel(BIOME_BOP_VOLCANO) //St. Helena scrub and woodlands
				.fromColour(39, 158, 205).toLevel(BIOME_BOP_RAINFOREST) //Sulawesi lowland rain forests
				.fromColour(81, 209, 58).toLevel(BIOME_BOP_RAINFOREST) //Sulawesi montane rain forests
				.fromColour(222, 131, 199).toLevel(BIOME_BOP_RAINFOREST) //Sulu Archipelago rain forests
				.fromColour(220, 50, 236).toLevel(BIOME_BOP_RAINFOREST) //Sumatran lowland rain forests
				.fromColour(180, 18, 216).toLevel(BIOME_BOP_RAINFOREST) //Sumatran montane rain forests
				.fromColour(146, 66, 217).toLevel(BIOME_BOP_CHERRY_BLOSSOM_GROVE) //Taiheiyo evergreen forests
				.fromColour(237, 109, 84).toLevel(BIOME_BOP_RAINFOREST) //Tapajós-Xingu moist forests
				.fromColour(51, 21, 202).toLevel(BIOME_BOP_RAINFOREST) //Tasmanian temperate rain forests
				.fromColour(33, 217, 131).toLevel(BIOME_BOP_SCRUBLAND) //Tehuacán Valley matorral
				.fromColour(214, 49, 220).toLevel(BIOME_BOP_RAINFOREST) //Tenasserim-South Thailand semi-evergreen rain forests
				.fromColour(203, 62, 228).toLevel(BIOME_BOP_PRAIRIE) //Texas blackland prairies
				.fromColour(238, 210, 100).toLevel(BIOME_BOP_LUSH_DESERT) //Tigris-Euphrates alluvial salt marsh
				.fromColour(96, 189, 220).toLevel(BIOME_BOP_RAINFOREST) //Tocantins-Pindare moist forests
				.fromColour(200, 223, 54).toLevel(BIOME_BOP_RAINFOREST) //Tongan tropical moist forests
				.fromColour(175, 88, 218).toLevel(BIOME_BOP_RAINFOREST) //Trinidad and Tobago moist forests
				.fromColour(215, 145, 14).toLevel(BIOME_BOP_RAINFOREST) //Trobriand Islands rain forests
				.fromColour(162, 238, 118).toLevel(BIOME_BOP_RAINFOREST) //Tuamotu tropical moist forests
				.fromColour(218, 227, 91).toLevel(BIOME_BOP_RAINFOREST) //Tubuai tropical moist forests
				.fromColour(56, 218, 230).toLevel(BIOME_BOP_MEDITERRANEAN_FOREST) //Tyrrhenian-Adriatic Sclerophyllous and mixed forests
				.fromColour(128, 214, 144).toLevel(BIOME_BOP_RAINFOREST) //Uatuma-Trombetas moist forests
				.fromColour(220, 61, 25).toLevel(BIOME_BOP_RAINFOREST) //Ucayali moist forests
				.fromColour(114, 187, 207).toLevel(BIOME_BOP_RAINFOREST) //Vanuatu rain forests
				.fromColour(208, 24, 76).toLevel(BIOME_BOP_RAINFOREST) //Veracruz moist forests
				.fromColour(153, 219, 131).toLevel(BIOME_BOP_RAINFOREST) //Vogelkop montane rain forests
				.fromColour(214, 44, 106).toLevel(BIOME_BOP_RAINFOREST) //Vogelkop-Aru lowland rain forests
				.fromColour(129, 186, 215).toLevel(BIOME_BOP_RAINFOREST) //Western Ecuador moist forests
				.fromColour(141, 202, 80).toLevel(BIOME_BOP_OLD_GROWTH_WOODLAND) //Western European broadleaf forests
				.fromColour(136, 228, 38).toLevel(BIOME_BOP_BAYOU) //Western Gulf coastal grasslands
				.fromColour(61, 209, 232).toLevel(BIOME_BOP_RAINFOREST) //Western Java montane rain forests
				.fromColour(33, 207, 219).toLevel(BIOME_BOP_RAINFOREST) //Western Java rain forests
				.fromColour(224, 42, 133).toLevel(BIOME_BOP_RAINFOREST) //Western Polynesian tropical moist forests
				.fromColour(215, 84, 91).toLevel(BIOME_BOP_PRAIRIE) //Western short grasslands
				.fromColour(224, 19, 53).toLevel(BIOME_BOP_RAINFOREST) //Windward Islands moist forests
				.fromColour(234, 99, 234).toLevel(BIOME_BOP_RAINFOREST) //Xingu-Tocantins-Araguaia moist forests
				.fromColour(216, 15, 35).toLevel(BIOME_BOP_RAINFOREST) //Yapen rain forests
				.fromColour(54, 217, 111).toLevel(BIOME_BOP_RAINFOREST) //Yucatán moist forests
				.go();
		}

		if (mod_BYG === "True") {
			var eco_byg = wp.applyHeightMap(ecoRegionImage)
				.toWorld(world)
				.shift(shiftLongitute, shiftLatitude)
				.applyToLayer(biomesLayer);

			eco_byg = eco_byg.fromColour(143, 206, 84).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Admiralty Islands lowland rain forests
				.fromColour(227, 85, 108).toLevel(BIOME_BYG_ALPS) //Alps conifer and mixed forests
				.fromColour(23, 191, 213).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Andaman Islands rain forests
				.fromColour(55, 207, 121).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Araucaria moist forests
				.fromColour(218, 187, 29).toLevel(BIOME_BYG_CONIFEROUS_FOREST) //Arizona Mountains forests
				.fromColour(39, 212, 169).toLevel(BIOME_BYG_ATACAMA_DESERT) //Atacama desert
				.fromColour(97, 237, 66).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Biak-Numfoor rain forests
				.fromColour(92, 205, 150).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Borneo lowland rain forests
				.fromColour(226, 147, 111).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Borneo montane rain forests
				.fromColour(59, 15, 220).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Buru rain forests
				.fromColour(217, 23, 159).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Caatinga Enclaves moist forests
				.fromColour(60, 167, 200).toLevel(BIOME_BYG_GRASSLAND_PLATEAU) //California Central Valley grasslands
				.fromColour(106, 236, 223).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Caqueta moist forests
				.fromColour(237, 222, 138).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Cardamom Mountains rain forests
				.fromColour(220, 106, 218).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Carolines tropical moist forests
				.fromColour(189, 213, 119).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Catatumbo moist forests
				.fromColour(226, 37, 229).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Cayos Miskitos-San Andrés and Providencia moist forests
				.fromColour(200, 38, 157).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Central American Atlantic moist forests
				.fromColour(211, 95, 199).toLevel(BIOME_BYG_ATACAMA_DESERT) //Central Andean puna
				.fromColour(207, 95, 117).toLevel(BIOME_BYG_CANADIAN_SHIELD) //Central Canadian Shield forests
				.fromColour(157, 214, 77).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Central Polynesian tropical moist forests
				.fromColour(236, 102, 122).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Central Range montane rain forests
				.fromColour(125, 201, 117).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Chocó-Darién moist forests
				.fromColour(107, 63, 228).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Cocos Island moist forests
				.fromColour(88, 33, 240).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Cook Islands tropical moist forests
				.fromColour(207, 21, 136).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Costa Rican seasonal moist forests
				.fromColour(234, 14, 219).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Cuban moist forests
				.fromColour(42, 215, 77).toLevel(BIOME_BYG_PRAIRIE) //Daurian forest steppe
				.fromColour(223, 91, 170).toLevel(BIOME_BYG_CANADIAN_SHIELD) //Eastern Canadian Shield taiga
				.fromColour(91, 198, 210).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Eastern Java-Bali montane rain forests
				.fromColour(229, 105, 67).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Eastern Java-Bali rain forests
				.fromColour(104, 97, 227).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Eastern Micronesia tropical moist forests
				.fromColour(208, 157, 112).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Fernando de Noronha-Atol das Rocas moist forests
				.fromColour(135, 127, 210).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Fiji tropical moist forests
				.fromColour(222, 132, 53).toLevel(BIOME_BYG_PRAIRIE) //Flint Hills tall grasslands
				.fromColour(87, 217, 48).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Greater Negros-Panay rain forests
				.fromColour(137, 229, 51).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Guianan Highlands moist forests
				.fromColour(99, 237, 115).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Guianan moist forests
				.fromColour(223, 91, 76).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Guianan piedmont and lowland moist forests
				.fromColour(222, 57, 151).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Hainan Island monsoon rain forests
				.fromColour(238, 107, 100).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Halmahera rain forests
				.fromColour(214, 92, 186).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Hawaii tropical moist forests
				.fromColour(99, 117, 230).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Hispaniolan moist forests
				.fromColour(124, 211, 127).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Isthmian-Atlantic moist forests
				.fromColour(89, 230, 139).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Isthmian-Pacific moist forests
				.fromColour(84, 161, 203).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Jamaican moist forests
				.fromColour(179, 120, 204).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Japurá-Solimoes-Negro moist forests
				.fromColour(219, 127, 199).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Juruá-Purus moist forests
				.fromColour(94, 196, 207).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Kayah-Karen montane rain forests
				.fromColour(54, 210, 197).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Kermadec Islands subtropical moist forests
				.fromColour(34, 234, 234).toLevel(BIOME_BYG_REDWOOD_THICKET) //Klamath-Siskiyou forests
				.fromColour(233, 178, 49).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Leeward Islands moist forests
				.fromColour(137, 49, 225).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Louisiade Archipelago rain forests
				.fromColour(124, 146, 225).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Luang Prabang montane rain forests
				.fromColour(123, 202, 127).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Luzon montane rain forests
				.fromColour(209, 178, 116).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Luzon rain forests
				.fromColour(150, 73, 213).toLevel(BIOME_BYG_BAOBAB_SAVANNA) //Madagascar dry deciduous forests
				.fromColour(45, 218, 204).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Madeira-Tapajós moist forests
				.fromColour(208, 88, 48).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Magdalena-Urabá moist forests
				.fromColour(155, 236, 139).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Malabar Coast moist forests
				.fromColour(54, 236, 72).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Maldives-Lakshadweep-Chagos Archipelago tropical moist forests
				.fromColour(62, 203, 15).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Marquesas tropical moist forests
				.fromColour(53, 227, 53).toLevel(BIOME_BYG_EBONY_WOODS) //Mascarene forests
				.fromColour(118, 96, 232).toLevel(BIOME_BYG_TROPICAL_RAINFOREST); //Mentawai Islands rain forests

			eco_byg = eco_byg.fromColour(97, 201, 118).toLevel(BIOME_BYG_CANADIAN_SHIELD) //Midwestern Canadian Shield forests
				.fromColour(207, 117, 65).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Mindanao montane rain forests
				.fromColour(50, 123, 225).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Mindanao-Eastern Visayas rain forests
				.fromColour(178, 118, 215).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Mindoro rain forests
				.fromColour(231, 154, 112).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Mizoram-Manipur-Kachin rain forests
				.fromColour(110, 131, 234).toLevel(BIOME_BYG_MOJAVE_DESERT) //Mojave desert
				.fromColour(201, 35, 154).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Myanmar coastal rain forests
				.fromColour(228, 72, 158).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Napo moist forests
				.fromColour(240, 38, 75).toLevel(BIOME_BYG_PRAIRIE) //Nebraska Sand Hills mixed grasslands
				.fromColour(215, 232, 127).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Negro-Branco moist forests
				.fromColour(107, 118, 214).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //New Britain-New Ireland lowland rain forests
				.fromColour(200, 83, 204).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //New Britain-New Ireland montane rain forests
				.fromColour(226, 209, 58).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //New Caledonia rain forests
				.fromColour(110, 203, 49).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Nicobar Islands rain forests
				.fromColour(61, 167, 238).toLevel(BIOME_BYG_CHERRY_BLOSSOM_FOREST) //Nihonkai evergreen forests
				.fromColour(206, 145, 65).toLevel(BIOME_BYG_CHERRY_BLOSSOM_FOREST) //Nihonkai montane deciduous forests
				.fromColour(31, 203, 63).toLevel(BIOME_BYG_DACITE_RIDGES) //North Central Rockies forests
				.fromColour(217, 223, 31).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //North Western Ghats montane rain forests
				.fromColour(118, 224, 180).toLevel(BIOME_BYG_REDWOOD_THICKET) //Northern California coastal forests
				.fromColour(209, 105, 131).toLevel(BIOME_BYG_CANADIAN_SHIELD) //Northern Canadian Shield taiga
				.fromColour(194, 122, 216).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Northern New Guinea montane rain forests
				.fromColour(169, 114, 206).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Northern Vietnam lowland rain forests
				.fromColour(236, 79, 123).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Ogasawara subtropical moist forests
				.fromColour(15, 133, 211).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Palau tropical moist forests
				.fromColour(24, 217, 185).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Palawan rain forests
				.fromColour(215, 126, 163).toLevel(BIOME_BYG_PRAIRIE) //Patagonian steppe
				.fromColour(31, 124, 218).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Peninsular Malaysian montane rain forests
				.fromColour(215, 93, 193).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Peninsular Malaysian rain forests
				.fromColour(194, 88, 229).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Petén-Veracruz moist forests
				.fromColour(130, 112, 235).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Puerto Rican moist forests
				.fromColour(82, 113, 200).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Purus-Madeira moist forests
				.fromColour(215, 211, 91).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Queensland tropical rain forests
				.fromColour(203, 108, 82).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Samoan tropical moist forests
				.fromColour(217, 115, 52).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Sierra Madre de Chiapas moist forests
				.fromColour(231, 129, 111).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Society Islands tropical moist forests
				.fromColour(126, 212, 136).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Solimões-Japurá moist forests
				.fromColour(215, 85, 25).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Solomon Islands rain forests
				.fromColour(238, 138, 105).toLevel(BIOME_BYG_GRASSLAND_PLATEAU) //South Island montane grasslands
				.fromColour(130, 226, 100).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //South Taiwan monsoon rain forests
				.fromColour(209, 49, 68).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //South Western Ghats montane rain forests
				.fromColour(187, 96, 233).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Southeastern Papuan rain forests
				.fromColour(175, 121, 218).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Southern Annamites montane rain forests
				.fromColour(112, 150, 239).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Southern New Guinea lowland rain forests
				.fromColour(50, 195, 203).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Southwest Amazon moist forests
				.fromColour(202, 202, 45).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Sri Lanka lowland rain forests
				.fromColour(62, 227, 106).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Sri Lanka montane rain forests
				.fromColour(39, 158, 205).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Sulawesi lowland rain forests
				.fromColour(81, 209, 58).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Sulawesi montane rain forests
				.fromColour(222, 131, 199).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Sulu Archipelago rain forests
				.fromColour(220, 50, 236).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Sumatran lowland rain forests
				.fromColour(180, 18, 216).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Sumatran montane rain forests
				.fromColour(146, 66, 217).toLevel(BIOME_BYG_CHERRY_BLOSSOM_FOREST) //Taiheiyo evergreen forests
				.fromColour(237, 109, 84).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Tapajós-Xingu moist forests
				.fromColour(33, 217, 131).toLevel(BIOME_BYG_SIERRA_BADLANDS) //Tehuacán Valley matorral
				.fromColour(214, 49, 220).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Tenasserim-South Thailand semi-evergreen rain forests
				.fromColour(203, 62, 228).toLevel(BIOME_BYG_PRAIRIE) //Texas blackland prairies
				.fromColour(96, 189, 220).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Tocantins-Pindare moist forests
				.fromColour(200, 223, 54).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Tongan tropical moist forests
				.fromColour(175, 88, 218).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Trinidad and Tobago moist forests
				.fromColour(215, 145, 14).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Trobriand Islands rain forests
				.fromColour(162, 238, 118).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Tuamotu tropical moist forests
				.fromColour(218, 227, 91).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Tubuai tropical moist forests
				.fromColour(128, 214, 144).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Uatuma-Trombetas moist forests
				.fromColour(220, 61, 25).toLevel(BIOME_BYG_TROPICAL_RAINFOREST); //Ucayali moist forests

			eco_byg = eco_byg.fromColour(64, 215, 150).toLevel(BIOME_BYG_GREAT_LAKES) //Upper Midwest forest-savanna transition
				.fromColour(114, 187, 207).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Vanuatu rain forests
				.fromColour(208, 24, 76).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Veracruz moist forests
				.fromColour(153, 219, 131).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Vogelkop montane rain forests
				.fromColour(214, 44, 106).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Vogelkop-Aru lowland rain forests
				.fromColour(145, 40, 202).toLevel(BIOME_BYG_ASPEN_FOREST) //Wasatch and Uinta montane forests
				.fromColour(129, 186, 215).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Western Ecuador moist forests
				.fromColour(141, 202, 80).toLevel(BIOME_BYG_BLACK_FOREST) //Western European broadleaf forests
				.fromColour(240, 175, 132).toLevel(BIOME_BYG_GREAT_LAKES) //Western Great Lakes forests
				.fromColour(61, 209, 232).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Western Java montane rain forests
				.fromColour(33, 207, 219).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Western Java rain forests
				.fromColour(224, 42, 133).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Western Polynesian tropical moist forests
				.fromColour(215, 84, 91).toLevel(BIOME_BYG_PRAIRIE) //Western short grasslands
				.fromColour(224, 19, 53).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Windward Islands moist forests
				.fromColour(234, 99, 234).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Xingu-Tocantins-Araguaia moist forests
				.fromColour(216, 15, 35).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Yapen rain forests
				.fromColour(54, 217, 111).toLevel(BIOME_BYG_TROPICAL_RAINFOREST) //Yucatán moist forests
				.go();
		}

		if (mod_Terralith === "True") {
			var eco_terralith = wp.applyHeightMap(ecoRegionImage)
				.toWorld(world)
				.shift(shiftLongitute, shiftLatitude)
				.applyToLayer(biomesLayer);

			eco_terralith = eco_terralith.fromColour(143, 206, 84).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Admiralty Islands lowland rain forests
				.fromColour(234, 50, 112).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Aegean and Western Turkey sclerophyllous and mixed forests
				.fromColour(57, 239, 142).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Afghan Mountains semi-desert
				.fromColour(115, 209, 143).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Al Hajar montane woodlands
				.fromColour(19, 152, 214).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Alai-Western Tian Shan steppe
				.fromColour(32, 212, 179).toLevel(BIOME_TERRALITH_SANDSTONE_VALLEY) //Alashan Plateau semi-desert
				.fromColour(102, 125, 227).toLevel(BIOME_TERRALITH_SNOWY_SHIELD) //Alaska Peninsula montane taiga
				.fromColour(53, 231, 121).toLevel(BIOME_TERRALITH_FROZEN_CLIFFS) //Alaska-St. Elias Range tundra
				.fromColour(230, 97, 126).toLevel(BIOME_TERRALITH_SHRUBLAND) //Albany thickets
				.fromColour(110, 211, 142).toLevel(BIOME_TERRALITH_ROCKY_MOUNTAINS) //Alberta Mountain forests
				.fromColour(203, 17, 181).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Alberta-British Columbia foothills forests
				.fromColour(76, 205, 166).toLevel(BIOME_TERRALITH_FROZEN_CLIFFS) //Aleutian Islands tundra
				.fromColour(76, 204, 44).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Allegheny Highlands forests
				.fromColour(227, 85, 108).toLevel(BIOME_TERRALITH_ALPINE_GROVE) //Alps conifer and mixed forests
				.fromColour(180, 141, 232).toLevel(BIOME_TERRALITH_WINDSWEPT_SPIRES) //Altai alpine meadow and tundra
				.fromColour(168, 74, 231).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Altai montane forest and forest steppe
				.fromColour(206, 77, 74).toLevel(BIOME_TERRALITH_COLD_SHRUBLAND) //Altai steppe and semi-desert
				.fromColour(227, 137, 99).toLevel(BIOME_TERRALITH_LAVENDER_FOREST) //Alto Paraná Atlantic forests
				.fromColour(223, 97, 213).toLevel(BIOME_TERRALITH_ASHEN_SAVANNA) //Amsterdam and Saint-Paul Islands temperate grasslands
				.fromColour(202, 238, 118).toLevel(BIOME_TERRALITH_STEPPE) //Amur meadow steppe
				.fromColour(234, 32, 136).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Anatolian conifer and deciduous mixed forests
				.fromColour(23, 191, 213).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Andaman Islands rain forests
				.fromColour(118, 205, 102).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Angolan Miombo woodlands
				.fromColour(33, 226, 49).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Angolan montane forest-grassland mosaic
				.fromColour(206, 125, 101).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Angolan Mopane woodlands
				.fromColour(228, 48, 57).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Angolan scarp savanna and woodlands
				.fromColour(76, 185, 225).toLevel(BIOME_TERRALITH_GLACIAL_CHASM) //Antipodes Subantarctic Islands tundra
				.fromColour(215, 53, 236).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Appalachian mixed mesophytic forests
				.fromColour(231, 132, 210).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Appalachian-Blue Ridge forests
				.fromColour(224, 27, 152).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Appenine deciduous montane forests
				.fromColour(30, 237, 175).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Apure-Villavicencio dry forests
				.fromColour(227, 64, 75).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Arabian Desert and East Sahero-Arabian xeric shrublands
				.fromColour(55, 207, 121).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Araucaria moist forests
				.fromColour(13, 223, 157).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Araya and Paria xeric scrub
				.fromColour(175, 121, 207).toLevel(BIOME_TERRALITH_SNOWY_BADLANDS) //Arctic coastal tundra
				.fromColour(91, 202, 60).toLevel(BIOME_TERRALITH_SNOWY_BADLANDS) //Arctic desert
				.fromColour(198, 96, 239).toLevel(BIOME_TERRALITH_SNOWY_BADLANDS) //Arctic foothills tundra
				.fromColour(218, 187, 29).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Arizona Mountains forests
				.fromColour(83, 81, 202).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Arnhem Land tropical savanna
				.fromColour(217, 52, 104).toLevel(BIOME_TERRALITH_ASHEN_SAVANNA) //Ascension scrub and grasslands
				.fromColour(39, 212, 169).toLevel(BIOME_TERRALITH_RED_OASIS) //Atacama desert
				.fromColour(239, 74, 49).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Atlantic coastal pine barrens
				.fromColour(18, 223, 80).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Atlantic dry forests
				.fromColour(160, 24, 202).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Atlantic Equatorial coastal forests
				.fromColour(75, 122, 224).toLevel(BIOME_TERRALITH_BLOOMING_PLATEAU) //Atlantic mixed forests
				.fromColour(226, 13, 198).toLevel(BIOME_TERRALITH_ALPINE_GROVE) //Australian Alps montane grasslands
				.fromColour(220, 218, 87).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Azerbaijan shrub desert and steppe
				.fromColour(203, 126, 55).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Azores temperate mixed forests
				.fromColour(204, 236, 86).toLevel(BIOME_TERRALITH_SHRUBLAND) //Badghyz and Karabil semi-desert
				.fromColour(223, 98, 79).toLevel(BIOME_TERRALITH_GLACIAL_CHASM) //Baffin coastal tundra
				.fromColour(64, 56, 205).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Bahamian pine mosaic
				.fromColour(124, 157, 206).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Bahia coastal forests
				.fromColour(81, 27, 219).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Bahia interior forests
				.fromColour(198, 208, 83).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Baja California desert
				.fromColour(64, 219, 126).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Bajío dry forests
				.fromColour(60, 208, 159).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Balkan mixed forests
				.fromColour(214, 119, 189).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Balsas dry forests
				.fromColour(174, 211, 38).toLevel(BIOME_TERRALITH_BLOOMING_VALLEY) //Baltic mixed forests
				.fromColour(59, 25, 232).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Baluchistan xeric woodlands
				.fromColour(117, 236, 148).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Banda Sea Islands moist deciduous forests
				.fromColour(158, 64, 225).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Belizian pine forests
				.fromColour(219, 196, 95).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Beni savanna
				.fromColour(138, 201, 56).toLevel(BIOME_TERRALITH_COLD_SHRUBLAND) //Bering tundra
				.fromColour(164, 213, 38).toLevel(BIOME_TERRALITH_COLD_SHRUBLAND); //Beringia lowland tundra

			eco_terralith = eco_terralith.fromColour(214, 102, 171).toLevel(BIOME_TERRALITH_SNOWY_BADLANDS) //Beringia upland tundra
				.fromColour(236, 221, 16).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Bermuda subtropical conifer forests
				.fromColour(97, 237, 66).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Biak-Numfoor rain forests
				.fromColour(44, 232, 106).toLevel(BIOME_TERRALITH_FORESTED_HIGHLANDS) //Blue Mountains forests
				.fromColour(52, 231, 189).toLevel(BIOME_TERRALITH_BLOOMING_VALLEY) //Bohai Sea saline meadow
				.fromColour(165, 207, 114).toLevel(BIOME_TERRALITH_SHRUBLAND) //Bolivian montane dry forests
				.fromColour(92, 205, 150).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Borneo lowland rain forests
				.fromColour(226, 147, 111).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Borneo montane rain forests
				.fromColour(108, 222, 214).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Borneo peat swamp forests
				.fromColour(218, 121, 51).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Brahmaputra Valley semi-evergreen forests
				.fromColour(66, 201, 100).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Brigalow tropical savanna
				.fromColour(137, 177, 230).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //British Columbia mainland coastal forests
				.fromColour(124, 214, 168).toLevel(BIOME_TERRALITH_GLACIAL_CHASM) //Brooks-British Range tundra
				.fromColour(59, 15, 220).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Buru rain forests
				.fromColour(130, 204, 120).toLevel(BIOME_TERRALITH_SHRUBLAND) //Caatinga
				.fromColour(217, 23, 159).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Caatinga Enclaves moist forests
				.fromColour(206, 75, 143).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Caledon conifer forests
				.fromColour(60, 167, 200).toLevel(BIOME_TERRALITH_BLOOMING_PLATEAU) //California Central Valley grasslands
				.fromColour(61, 164, 224).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //California coastal sage and chaparral
				.fromColour(119, 95, 226).toLevel(BIOME_TERRALITH_SHRUBLAND) //California interior chaparral and woodlands
				.fromColour(214, 80, 147).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //California montane chaparral and woodlands
				.fromColour(197, 234, 122).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Cameroonian Highlands forests
				.fromColour(69, 208, 89).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Campos Rupestres montane savanna
				.fromColour(203, 187, 86).toLevel(BIOME_TERRALITH_HIGHLANDS) //Canadian Aspen forests and parklands
				.fromColour(130, 221, 224).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Canary Islands dry woodlands and forests
				.fromColour(138, 212, 85).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Cantabrian mixed forests
				.fromColour(228, 67, 142).toLevel(BIOME_TERRALITH_BLOOMING_PLATEAU) //Cantebury-Otago tussock grasslands
				.fromColour(54, 203, 236).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Cape Verde Islands dry forests
				.fromColour(120, 240, 190).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Cape York Peninsula tropical savanna
				.fromColour(106, 236, 223).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Caqueta moist forests
				.fromColour(237, 222, 138).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Cardamom Mountains rain forests
				.fromColour(93, 223, 201).toLevel(BIOME_TERRALITH_SHRUBLAND) //Caribbean shrublands
				.fromColour(107, 229, 123).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Carnarvon xeric shrublands
				.fromColour(220, 106, 218).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Carolines tropical moist forests
				.fromColour(210, 63, 190).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Carpathian montane forests
				.fromColour(202, 63, 212).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Carpentaria tropical savanna
				.fromColour(224, 125, 49).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Cascade Mountains leeward forests
				.fromColour(77, 206, 150).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Caspian Hyrcanian mixed forests
				.fromColour(194, 58, 212).toLevel(BIOME_TERRALITH_SHRUBLAND) //Caspian lowland desert
				.fromColour(189, 213, 119).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Catatumbo moist forests
				.fromColour(165, 105, 238).toLevel(BIOME_TERRALITH_LAVENDER_FOREST) //Cauca Valley dry forests
				.fromColour(232, 206, 59).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Cauca Valley montane forests
				.fromColour(111, 235, 206).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Caucasus mixed forests
				.fromColour(226, 37, 229).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Cayos Miskitos-San Andrés and Providencia moist forests
				.fromColour(41, 204, 87).toLevel(BIOME_TERRALITH_BLOOMING_VALLEY) //Celtic broadleaf forests
				.fromColour(87, 19, 222).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Central Afghan Mountains xeric woodlands
				.fromColour(200, 38, 157).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Central American Atlantic moist forests
				.fromColour(224, 135, 208).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Central American dry forests
				.fromColour(235, 211, 57).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Central American montane forests
				.fromColour(70, 229, 81).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Central American pine-oak forests
				.fromColour(215, 35, 113).toLevel(BIOME_TERRALITH_STEPPE) //Central Anatolian steppe
				.fromColour(73, 86, 233).toLevel(BIOME_TERRALITH_STEPPE) //Central Anatolian steppe and woodlands
				.fromColour(231, 181, 55).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Central and Southern Cascades forests
				.fromColour(180, 209, 126).toLevel(BIOME_TERRALITH_STEPPE) //Central and Southern mixed grasslands
				.fromColour(200, 85, 115).toLevel(BIOME_TERRALITH_WINDSWEPT_SPIRES) //Central Andean dry puna
				.fromColour(211, 95, 199).toLevel(BIOME_TERRALITH_RED_OASIS) //Central Andean puna
				.fromColour(208, 217, 79).toLevel(BIOME_TERRALITH_STONY_SPIRES) //Central Andean wet puna
				.fromColour(20, 200, 128).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Central Asian northern desert
				.fromColour(212, 77, 124).toLevel(BIOME_TERRALITH_STEPPE) //Central Asian riparian woodlands
				.fromColour(38, 49, 213).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Central Asian southern desert
				.fromColour(227, 138, 233).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Central British Columbia Mountain forests
				.fromColour(207, 95, 117).toLevel(BIOME_TERRALITH_SHIELD) //Central Canadian Shield forests
				.fromColour(40, 223, 116).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Central China loess plateau mixed forests
				.fromColour(75, 226, 29).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE); //Central Congolian lowland forests

			eco_terralith = eco_terralith.fromColour(222, 110, 143).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Central Deccan Plateau dry deciduous forests
				.fromColour(202, 161, 112).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Central European mixed forests
				.fromColour(27, 66, 223).toLevel(BIOME_TERRALITH_STEPPE) //Central forest-grasslands transition
				.fromColour(170, 202, 53).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Central Indochina dry forests
				.fromColour(61, 110, 234).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Central Korean deciduous forests
				.fromColour(110, 29, 240).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Central Mexican matorral
				.fromColour(102, 60, 240).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Central Pacific coastal forests
				.fromColour(134, 85, 208).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Central Persian desert basins
				.fromColour(157, 214, 77).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Central Polynesian tropical moist forests
				.fromColour(236, 102, 122).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Central Range montane rain forests
				.fromColour(172, 231, 120).toLevel(BIOME_TERRALITH_WINDSWEPT_SPIRES) //Central Range sub-alpine grasslands
				.fromColour(20, 237, 233).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Central Ranges xeric scrub
				.fromColour(63, 211, 196).toLevel(BIOME_TERRALITH_STEPPE) //Central tall grasslands
				.fromColour(107, 221, 198).toLevel(BIOME_TERRALITH_DESERT_OASIS) //Central Tibetan Plateau alpine steppe
				.fromColour(189, 236, 135).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Central U.S. hardwood forests
				.fromColour(197, 65, 206).toLevel(BIOME_TERRALITH_SHRUBLAND) //Central Zambezian Miombo woodlands
				.fromColour(97, 227, 110).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Cerrado
				.fromColour(89, 133, 211).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Changbai Mountains mixed forests
				.fromColour(120, 237, 74).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Changjiang Plain evergreen forests
				.fromColour(224, 60, 98).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Chao Phraya freshwater swamp forests
				.fromColour(74, 235, 68).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Chao Phraya lowland moist deciduous forests
				.fromColour(72, 228, 111).toLevel(BIOME_TERRALITH_BLOOMING_VALLEY) //Chatham Island temperate forests
				.fromColour(16, 221, 221).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Cherskii-Kolyma mountain tundra
				.fromColour(61, 97, 229).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Chhota-Nagpur dry deciduous forests
				.fromColour(222, 116, 157).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Chiapas Depression dry forests
				.fromColour(223, 177, 91).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Chiapas montane forests
				.fromColour(206, 63, 158).toLevel(BIOME_TERRALITH_SKYLANDS) //Chihuahuan desert
				.fromColour(116, 222, 29).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Chilean matorral
				.fromColour(86, 220, 222).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Chimalapas montane forests
				.fromColour(27, 237, 23).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Chin Hills-Arakan Yoma montane forests
				.fromColour(218, 151, 103).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Chiquitano dry forests
				.fromColour(125, 201, 117).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Chocó-Darién moist forests
				.fromColour(206, 121, 113).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Chukchi Peninsula tundra
				.fromColour(14, 236, 225).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Clipperton Island shrub and grasslands
				.fromColour(107, 63, 228).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Cocos Island moist forests
				.fromColour(212, 24, 215).toLevel(BIOME_TERRALITH_BRYCE_CANYON) //Colorado Plateau shrublands
				.fromColour(222, 239, 29).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Colorado Rockies forests
				.fromColour(132, 99, 202).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Comoros forests
				.fromColour(217, 100, 174).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Cook Inlet taiga
				.fromColour(88, 33, 240).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Cook Islands tropical moist forests
				.fromColour(92, 215, 240).toLevel(BIOME_TERRALITH_SHIELD) //Copper Plateau taiga
				.fromColour(116, 201, 185).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Cordillera Central páramo
				.fromColour(230, 177, 86).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Cordillera de Merida páramo
				.fromColour(126, 143, 211).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Cordillera La Costa montane forests
				.fromColour(60, 106, 206).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Cordillera Oriental montane forests
				.fromColour(221, 99, 88).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Corsican montane broadleaf and mixed forests
				.fromColour(207, 21, 136).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Costa Rican seasonal moist forests
				.fromColour(133, 209, 101).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Crete Mediterranean forests
				.fromColour(147, 227, 18).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Crimean Submediterranean forest complex
				.fromColour(211, 29, 153).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Cross-Niger transition forests
				.fromColour(18, 211, 237).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Cross-Sanaga-Bioko coastal forests
				.fromColour(208, 81, 18).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Cuban cactus scrub
				.fromColour(63, 57, 235).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Cuban dry forests
				.fromColour(234, 14, 219).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Cuban moist forests
				.fromColour(58, 200, 202).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Cuban pine forests
				.fromColour(212, 62, 24).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Cuban wetlands
				.fromColour(239, 21, 144).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Cyprus Mediterranean forests
				.fromColour(185, 215, 84).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Da Hinggan-Dzhagdy Mountains conifer forests
				.fromColour(134, 45, 207).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Daba Mountains evergreen forests
				.fromColour(42, 215, 77).toLevel(BIOME_TERRALITH_BRUSHLAND) //Daurian forest steppe
				.fromColour(173, 116, 208).toLevel(BIOME_TERRALITH_GLACIAL_CHASM) //Davis Highlands tundra
				.fromColour(51, 239, 173).toLevel(BIOME_TERRALITH_SHRUBLAND) //Deccan thorn scrub forests
				.fromColour(235, 27, 186).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Dinaric Mountains mixed forests
				.fromColour(101, 61, 221).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS); //Drakensberg montane grasslands, woodlands and forests

			eco_terralith = eco_terralith.fromColour(223, 17, 23).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Dry Chaco
				.fromColour(207, 98, 84).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //East Afghan montane conifer forests
				.fromColour(240, 174, 87).toLevel(BIOME_TERRALITH_LUSH_DESERT) //East African halophytics
				.fromColour(112, 92, 201).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //East African montane forests
				.fromColour(214, 83, 234).toLevel(BIOME_TERRALITH_STONY_SPIRES) //East African montane moorlands
				.fromColour(108, 127, 235).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //East Central Texas forests
				.fromColour(201, 143, 76).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //East Deccan dry-evergreen forests
				.fromColour(240, 146, 201).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //East European forest steppe
				.fromColour(213, 188, 113).toLevel(BIOME_TERRALITH_LUSH_DESERT) //East Saharan montane xeric woodlands
				.fromColour(207, 129, 229).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //East Siberian taiga
				.fromColour(236, 55, 206).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //East Sudanian savanna
				.fromColour(135, 215, 115).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Eastern Anatolian deciduous forests
				.fromColour(239, 84, 229).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Eastern Anatolian montane steppe
				.fromColour(200, 180, 107).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Eastern Arc forests
				.fromColour(208, 67, 57).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Eastern Australia mulga shrublands
				.fromColour(45, 53, 201).toLevel(BIOME_TERRALITH_BIRCH_TAIGA) //Eastern Australian temperate forests
				.fromColour(214, 97, 220).toLevel(BIOME_TERRALITH_SHIELD) //Eastern Canadian forests
				.fromColour(223, 91, 170).toLevel(BIOME_TERRALITH_SHIELD) //Eastern Canadian Shield taiga
				.fromColour(55, 209, 41).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Eastern Cascades forests
				.fromColour(235, 227, 108).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Eastern Congolian swamp forests
				.fromColour(61, 240, 91).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Eastern Cordillera real montane forests
				.fromColour(17, 200, 17).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Eastern forest-boreal transition
				.fromColour(63, 188, 238).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Eastern Gobi desert steppe
				.fromColour(110, 67, 228).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Eastern Great Lakes lowland forests
				.fromColour(214, 31, 116).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Eastern Guinean forests
				.fromColour(80, 213, 27).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Eastern highlands moist deciduous forests
				.fromColour(73, 219, 65).toLevel(BIOME_TERRALITH_STONY_SPIRES) //Eastern Himalayan alpine shrub and meadows
				.fromColour(137, 137, 231).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Eastern Himalayan broadleaf forests
				.fromColour(115, 238, 191).toLevel(BIOME_TERRALITH_ALPINE_GROVE) //Eastern Himalayan subalpine conifer forests
				.fromColour(91, 198, 210).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Eastern Java-Bali montane rain forests
				.fromColour(229, 105, 67).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Eastern Java-Bali rain forests
				.fromColour(113, 205, 47).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Eastern Mediterranean conifer-sclerophyllous-broadleaf forests
				.fromColour(104, 97, 227).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Eastern Micronesia tropical moist forests
				.fromColour(96, 219, 223).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Eastern Miombo woodlands
				.fromColour(80, 230, 145).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Eastern Panamanian montane forests
				.fromColour(204, 78, 33).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Eastern Zimbabwe montane forest-grassland mosaic
				.fromColour(17, 80, 240).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Ecuadorian dry forests
				.fromColour(107, 208, 179).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Edwards Plateau savanna
				.fromColour(184, 201, 57).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Einasleigh upland savanna
				.fromColour(227, 94, 119).toLevel(BIOME_TERRALITH_ARID_HIGHLANDS) //Elburz Range forest steppe
				.fromColour(213, 51, 94).toLevel(BIOME_TERRALITH_STEPPE) //Emin Valley steppe
				.fromColour(18, 122, 232).toLevel(BIOME_TERRALITH_BLOOMING_PLATEAU) //English Lowlands beech forests
				.fromColour(44, 235, 225).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Enriquillo wetlands
				.fromColour(128, 213, 83).toLevel(BIOME_TERRALITH_GRAVEL_BEACH) //Eritrean coastal desert
				.fromColour(190, 231, 87).toLevel(BIOME_TERRALITH_SHRUBLAND) //Esperance mallee
				.fromColour(214, 69, 230).toLevel(BIOME_TERRALITH_FRACTURED_SAVANNA) //Espinal
				.fromColour(70, 203, 137).toLevel(BIOME_TERRALITH_FORESTED_HIGHLANDS) //Ethiopian montane forests
				.fromColour(211, 225, 106).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Ethiopian montane moorlands
				.fromColour(63, 227, 153).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Ethiopian xeric grasslands and shrublands
				.fromColour(219, 104, 87).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Etosha Pan halophytics
				.fromColour(221, 113, 122).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Euxine-Colchic broadleaf forests
				.fromColour(227, 133, 32).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Everglades
				.fromColour(202, 156, 56).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Eyre and York mallee
				.fromColour(198, 219, 92).toLevel(BIOME_TERRALITH_STEPPE) //Faroe Islands boreal grasslands
				.fromColour(208, 157, 112).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Fernando de Noronha-Atol das Rocas moist forests
				.fromColour(223, 130, 240).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Fiji tropical dry forests
				.fromColour(135, 127, 210).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Fiji tropical moist forests
				.fromColour(217, 222, 64).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Fiordland temperate forests
				.fromColour(222, 132, 53).toLevel(BIOME_TERRALITH_BRUSHLAND) //Flint Hills tall grasslands
				.fromColour(112, 171, 234).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Florida sand pine scrub
				.fromColour(92, 201, 70).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Fraser Plateau and Basin complex
				.fromColour(101, 118, 202).toLevel(BIOME_TERRALITH_SHRUBLAND) //Galápagos Islands scrubland mosaic
				.fromColour(45, 220, 42).toLevel(BIOME_TERRALITH_BLOOMING_PLATEAU) //Ghorat-Hazarajat alpine meadow
				.fromColour(139, 184, 235).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND); //Gibson desert

			eco_terralith = eco_terralith.fromColour(155, 210, 96).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Gissaro-Alai open woodlands
				.fromColour(207, 45, 69).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Gobi Lakes Valley desert steppe
				.fromColour(219, 122, 70).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Great Basin montane forests
				.fromColour(231, 38, 118).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Great Basin shrub steppe
				.fromColour(230, 205, 95).toLevel(BIOME_TERRALITH_STEPPE) //Great Lakes Basin desert steppe
				.fromColour(171, 53, 203).toLevel(BIOME_TERRALITH_RED_OASIS) //Great Sandy-Tanami desert
				.fromColour(214, 22, 60).toLevel(BIOME_TERRALITH_RED_OASIS) //Great Victoria desert
				.fromColour(87, 217, 48).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Greater Negros-Panay rain forests
				.fromColour(216, 102, 53).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Guajira-Barranquilla xeric scrub
				.fromColour(45, 232, 132).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Guayaquil flooded grasslands
				.fromColour(210, 48, 69).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Guianan freshwater swamp forests
				.fromColour(137, 229, 51).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Guianan Highlands moist forests
				.fromColour(99, 237, 115).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Guianan moist forests
				.fromColour(223, 91, 76).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Guianan piedmont and lowland moist forests
				.fromColour(24, 37, 221).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Guianan savanna
				.fromColour(190, 227, 135).toLevel(BIOME_TERRALITH_FRACTURED_SAVANNA) //Guinean forest-savanna mosaic
				.fromColour(89, 226, 189).toLevel(BIOME_TERRALITH_FORESTED_HIGHLANDS) //Guinean montane forests
				.fromColour(234, 136, 201).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Guizhou Plateau broadleaf and mixed forests
				.fromColour(115, 215, 167).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Gulf of California xeric scrub
				.fromColour(98, 200, 225).toLevel(BIOME_TERRALITH_DESERT_CANYON) //Gulf of Oman desert and semi-desert
				.fromColour(80, 177, 237).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Gulf of St. Lawrence lowland forests
				.fromColour(104, 108, 203).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Gurupa varzeá
				.fromColour(222, 57, 151).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Hainan Island monsoon rain forests
				.fromColour(238, 107, 100).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Halmahera rain forests
				.fromColour(238, 186, 31).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Hawaii tropical dry forests
				.fromColour(182, 85, 202).toLevel(BIOME_TERRALITH_STONY_SPIRES) //Hawaii tropical high shrublands
				.fromColour(216, 123, 225).toLevel(BIOME_TERRALITH_FRACTURED_SAVANNA) //Hawaii tropical low shrublands
				.fromColour(214, 92, 186).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Hawaii tropical moist forests
				.fromColour(65, 59, 226).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Helanshan montane conifer forests
				.fromColour(57, 211, 173).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Hengduan Mountains subalpine conifer forests
				.fromColour(211, 75, 229).toLevel(BIOME_TERRALITH_SNOWY_BADLANDS) //High Arctic tundra
				.fromColour(98, 210, 188).toLevel(BIOME_TERRALITH_LUSH_DESERT) //High Monte
				.fromColour(206, 43, 92).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Highveld grasslands
				.fromColour(201, 216, 106).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Himalayan subtropical broadleaf forests
				.fromColour(238, 144, 238).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Himalayan subtropical pine forests
				.fromColour(154, 113, 215).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Hindu Kush alpine meadow
				.fromColour(208, 101, 103).toLevel(BIOME_TERRALITH_SHRUBLAND) //Hispaniolan dry forests
				.fromColour(99, 117, 230).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Hispaniolan moist forests
				.fromColour(175, 107, 215).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Hispaniolan pine forests
				.fromColour(35, 203, 116).toLevel(BIOME_TERRALITH_SHRUBLAND) //Hobyo grasslands and shrublands
				.fromColour(159, 76, 200).toLevel(BIOME_TERRALITH_BIRCH_TAIGA) //Hokkaido deciduous forests
				.fromColour(208, 97, 236).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Hokkaido montane conifer forests
				.fromColour(74, 215, 52).toLevel(BIOME_TERRALITH_FORESTED_HIGHLANDS) //Honshu alpine conifer forests
				.fromColour(125, 208, 221).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Huang He Plain mixed forests
				.fromColour(92, 224, 152).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Humid Chaco
				.fromColour(108, 36, 202).toLevel(BIOME_TERRALITH_BLOOMING_PLATEAU) //Humid Pampas
				.fromColour(204, 175, 78).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Huon Peninsula montane rain forests
				.fromColour(108, 217, 208).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Iberian conifer forests
				.fromColour(165, 216, 94).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Iberian sclerophyllous and semi-deciduous forests
				.fromColour(104, 187, 208).toLevel(BIOME_TERRALITH_ROCKY_MOUNTAINS) //Iceland boreal birch forests and alpine tundra
				.fromColour(106, 203, 80).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Illyrian deciduous forests
				.fromColour(76, 138, 214).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Indus Valley desert
				.fromColour(213, 109, 57).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Inner Niger Delta flooded savanna
				.fromColour(34, 14, 216).toLevel(BIOME_TERRALITH_BIRCH_TAIGA) //Interior Alaska-Yukon lowland taiga
				.fromColour(202, 28, 112).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Interior Yukon-Alaska alpine tundra
				.fromColour(85, 200, 96).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Irrawaddy dry forests
				.fromColour(221, 101, 147).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Irrawaddy freshwater swamp forests
				.fromColour(240, 104, 109).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Irrawaddy moist deciduous forests
				.fromColour(238, 216, 21).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Islas Revillagigedo dry forests
				.fromColour(124, 211, 127).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Isthmian-Atlantic moist forests
				.fromColour(89, 230, 139).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Isthmian-Pacific moist forests
				.fromColour(30, 217, 114).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Italian sclerophyllous and semi-deciduous forests
				.fromColour(130, 143, 236).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Itigi-Sumbu thicket
				.fromColour(154, 225, 106).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE); //Jalisco dry forests

			eco_terralith = eco_terralith.fromColour(215, 149, 43).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Jamaican dry forests
				.fromColour(84, 161, 203).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Jamaican moist forests
				.fromColour(179, 120, 204).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Japurá-Solimoes-Negro moist forests
				.fromColour(203, 22, 67).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Jarrah-Karri forest and shrublands
				.fromColour(179, 131, 234).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Jian Nan subtropical evergreen forests
				.fromColour(205, 73, 21).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Jos Plateau forest-grassland mosaic
				.fromColour(22, 227, 26).toLevel(BIOME_TERRALITH_DESERT_OASIS) //Junggar Basin semi-desert
				.fromColour(219, 127, 199).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Juruá-Purus moist forests
				.fromColour(121, 236, 44).toLevel(BIOME_TERRALITH_EMERALD_PEAKS) //Kalaallit Nunaat high arctic tundra
				.fromColour(30, 122, 208).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Kalaallit Nunaat low arctic tundra
				.fromColour(239, 123, 198).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Kalahari Acacia-Baikiaea woodlands
				.fromColour(70, 225, 46).toLevel(BIOME_TERRALITH_GLACIAL_CHASM) //Kamchatka Mountain tundra and forest tundra
				.fromColour(15, 88, 206).toLevel(BIOME_TERRALITH_FORESTED_HIGHLANDS) //Kamchatka-Kurile meadows and sparse forests
				.fromColour(191, 88, 220).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Kamchatka-Kurile taiga
				.fromColour(207, 41, 55).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Kaokoveld desert
				.fromColour(25, 55, 205).toLevel(BIOME_TERRALITH_STONY_SPIRES) //Karakoram-West Tibetan Plateau alpine steppe
				.fromColour(94, 196, 207).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Kayah-Karen montane rain forests
				.fromColour(119, 15, 216).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Kazakh forest steppe
				.fromColour(113, 225, 27).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Kazakh semi-desert
				.fromColour(71, 179, 212).toLevel(BIOME_TERRALITH_SHRUBLAND) //Kazakh steppe
				.fromColour(224, 148, 18).toLevel(BIOME_TERRALITH_STEPPE) //Kazakh upland
				.fromColour(54, 210, 197).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Kermadec Islands subtropical moist forests
				.fromColour(169, 219, 107).toLevel(BIOME_TERRALITH_ALPINE_GROVE) //Khangai Mountains alpine meadow
				.fromColour(221, 194, 119).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Khangai Mountains conifer forests
				.fromColour(26, 200, 180).toLevel(BIOME_TERRALITH_SKYLANDS_AUTUMN) //Khathiar-Gir dry deciduous forests
				.fromColour(223, 109, 198).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Kimberly tropical savanna
				.fromColour(68, 229, 32).toLevel(BIOME_TERRALITH_WINDSWEPT_SPIRES) //Kinabalu montane alpine meadows
				.fromColour(34, 234, 234).toLevel(BIOME_TERRALITH_MOONLIGHT_VALLEY) //Klamath-Siskiyou forests
				.fromColour(126, 188, 235).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Knysna-Amatole montane forests
				.fromColour(236, 106, 230).toLevel(BIOME_TERRALITH_SNOWY_BADLANDS) //Kola Peninsula tundra
				.fromColour(61, 160, 221).toLevel(BIOME_TERRALITH_DESERT_OASIS) //Kopet Dag semi-desert
				.fromColour(62, 174, 234).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Kopet Dag woodlands and forest steppe
				.fromColour(210, 109, 210).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Kuh Rud and Eastern Iran montane woodlands
				.fromColour(90, 229, 208).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //KwaZulu-Cape coastal forest mosaic
				.fromColour(202, 152, 95).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //La Costa xeric shrublands
				.fromColour(235, 42, 225).toLevel(BIOME_TERRALITH_WARM_RIVER) //Lake
				.fromColour(82, 169, 220).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Lake Chad flooded savanna
				.fromColour(44, 214, 106).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Lara-Falcón dry forests
				.fromColour(233, 178, 49).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Leeward Islands moist forests
				.fromColour(200, 178, 13).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Lesser Antillean dry forests
				.fromColour(227, 191, 107).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Lesser Sundas deciduous forests
				.fromColour(52, 129, 223).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Llanos
				.fromColour(161, 77, 200).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Lord Howe Island subtropical forests
				.fromColour(137, 49, 225).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Louisiade Archipelago rain forests
				.fromColour(222, 40, 216).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Low Arctic tundra
				.fromColour(84, 200, 74).toLevel(BIOME_TERRALITH_SHRUBLAND) //Low Monte
				.fromColour(16, 200, 142).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Lower Gangetic Plains moist deciduous forests
				.fromColour(113, 46, 237).toLevel(BIOME_TERRALITH_STEPPE) //Lowland fynbos and renosterveld
				.fromColour(124, 146, 225).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Luang Prabang montane rain forests
				.fromColour(123, 202, 127).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Luzon montane rain forests
				.fromColour(209, 178, 116).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Luzon rain forests
				.fromColour(119, 154, 225).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Luzon tropical pine forests
				.fromColour(150, 73, 213).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Madagascar dry deciduous forests
				.fromColour(145, 92, 236).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Madagascar ericoid thickets
				.fromColour(33, 203, 87).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Madagascar lowland forests
				.fromColour(180, 207, 92).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Madagascar spiny thickets
				.fromColour(213, 240, 94).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Madagascar subhumid forests
				.fromColour(222, 35, 194).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Madagascar succulent woodlands
				.fromColour(141, 235, 237).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Madeira evergreen forests
				.fromColour(45, 218, 204).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Madeira-Tapajós moist forests
				.fromColour(75, 122, 217).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Magdalena Valley dry forests
				.fromColour(80, 154, 223).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Magdalena Valley montane forests
				.fromColour(208, 88, 48).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Magdalena-Urabá moist forests
				.fromColour(80, 126, 218).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA); //Magellanic subpolar forests

			eco_terralith = eco_terralith.fromColour(155, 236, 139).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Malabar Coast moist forests
				.fromColour(54, 236, 72).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Maldives-Lakshadweep-Chagos Archipelago tropical moist forests
				.fromColour(43, 226, 141).toLevel(BIOME_TERRALITH_STONY_SPIRES) //Malpelo Island xeric scrub
				.fromColour(240, 232, 73).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Manchurian mixed forests
				.fromColour(37, 225, 159).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Mandara Plateau mosaic
				.fromColour(121, 91, 216).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Maputaland coastal forest mosaic
				.fromColour(166, 220, 80).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Maputaland-Pondoland bushland and thickets
				.fromColour(65, 124, 226).toLevel(BIOME_TERRALITH_MOONLIGHT_VALLEY) //Maracaibo dry forests
				.fromColour(42, 161, 216).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Marajó varzeá
				.fromColour(166, 121, 211).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Maranhão Babaçu forests
				.fromColour(106, 86, 233).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Marañón dry forests
				.fromColour(207, 70, 180).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Marianas tropical dry forests
				.fromColour(87, 222, 137).toLevel(BIOME_TERRALITH_GLACIAL_CHASM) //Marielandia Antarctic tundra
				.fromColour(62, 203, 15).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Marquesas tropical moist forests
				.fromColour(201, 99, 186).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Masai xeric grasslands and shrublands
				.fromColour(53, 227, 53).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Mascarene forests
				.fromColour(149, 116, 220).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Mato Grosso seasonal forests
				.fromColour(211, 65, 204).toLevel(BIOME_TERRALITH_GLACIAL_CHASM) //Maudlandia Antarctic desert
				.fromColour(200, 231, 24).toLevel(BIOME_TERRALITH_SHRUBLAND) //Mediterranean acacia-argania dry woodlands and succulent thickets
				.fromColour(79, 234, 203).toLevel(BIOME_TERRALITH_BLOOMING_VALLEY) //Mediterranean conifer and mixed forests
				.fromColour(184, 215, 99).toLevel(BIOME_TERRALITH_SHRUBLAND) //Mediterranean dry woodlands and steppe
				.fromColour(28, 209, 237).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Mediterranean High Atlas juniper steppe
				.fromColour(87, 214, 174).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Mediterranean woodlands and forests
				.fromColour(118, 96, 232).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Mentawai Islands rain forests
				.fromColour(158, 24, 211).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Meseta Central matorral
				.fromColour(105, 211, 48).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Mesopotamian shrub desert
				.fromColour(138, 189, 240).toLevel(BIOME_TERRALITH_SHIELD) //Mid-Continental Canadian forests
				.fromColour(208, 106, 43).toLevel(BIOME_TERRALITH_SNOWY_BADLANDS) //Middle Arctic tundra
				.fromColour(130, 221, 97).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Middle Atlantic coastal forests
				.fromColour(47, 194, 224).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Middle East steppe
				.fromColour(97, 201, 118).toLevel(BIOME_TERRALITH_SHIELD) //Midwestern Canadian Shield forests
				.fromColour(207, 117, 65).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Mindanao montane rain forests
				.fromColour(50, 123, 225).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Mindanao-Eastern Visayas rain forests
				.fromColour(178, 118, 215).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Mindoro rain forests
				.fromColour(129, 237, 121).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Miskito pine forests
				.fromColour(124, 200, 93).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Mississippi lowland forests
				.fromColour(28, 237, 230).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Mitchell grass downs
				.fromColour(231, 154, 112).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Mizoram-Manipur-Kachin rain forests
				.fromColour(110, 131, 234).toLevel(BIOME_TERRALITH_DESERT_CANYON) //Mojave desert
				.fromColour(229, 148, 26).toLevel(BIOME_TERRALITH_STEPPE) //Mongolian-Manchurian grassland
				.fromColour(30, 135, 210).toLevel(BIOME_TERRALITH_STEPPE) //Montana Valley and Foothill grasslands
				.fromColour(174, 37, 208).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Monte Alegre varzeá
				.fromColour(194, 76, 221).toLevel(BIOME_TERRALITH_SHRUBLAND) //Motagua Valley thornscrub
				.fromColour(88, 33, 217).toLevel(BIOME_TERRALITH_STONY_SPIRES) //Mount Cameroon and Bioko montane forests
				.fromColour(229, 104, 21).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Mount Lofty woodlands
				.fromColour(206, 98, 105).toLevel(BIOME_TERRALITH_SHIELD) //Muskwa-Slave Lake forests
				.fromColour(201, 35, 154).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Myanmar coastal rain forests
				.fromColour(52, 139, 209).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Nama Karoo
				.fromColour(239, 189, 82).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Namib desert
				.fromColour(155, 104, 216).toLevel(BIOME_TERRALITH_FRACTURED_SAVANNA) //Namibian savanna woodlands
				.fromColour(22, 68, 233).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Nansei Islands subtropical evergreen forests
				.fromColour(228, 72, 158).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Napo moist forests
				.fromColour(129, 91, 225).toLevel(BIOME_TERRALITH_SHRUBLAND) //Naracoorte woodlands
				.fromColour(195, 225, 136).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Narmada Valley dry deciduous forests
				.fromColour(240, 38, 75).toLevel(BIOME_TERRALITH_BRUSHLAND) //Nebraska Sand Hills mixed grasslands
				.fromColour(215, 232, 127).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Negro-Branco moist forests
				.fromColour(221, 200, 123).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Nelson Coast temperate forests
				.fromColour(149, 110, 208).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Nenjiang River grassland
				.fromColour(107, 118, 214).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //New Britain-New Ireland lowland rain forests
				.fromColour(200, 83, 204).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //New Britain-New Ireland montane rain forests
				.fromColour(40, 224, 196).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //New Caledonia dry forests
				.fromColour(226, 209, 58).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //New Caledonia rain forests
				.fromColour(229, 21, 24).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //New England-Acadian forests
				.fromColour(117, 201, 234).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS); //Newfoundland Highland forests

			eco_terralith = eco_terralith.fromColour(110, 203, 49).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Nicobar Islands rain forests
				.fromColour(230, 48, 200).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Nigerian lowland forests
				.fromColour(61, 167, 238).toLevel(BIOME_TERRALITH_SAKURA_GROVE) //Nihonkai evergreen forests
				.fromColour(206, 145, 65).toLevel(BIOME_TERRALITH_SAKURA_VALLEY) //Nihonkai montane deciduous forests
				.fromColour(58, 218, 37).toLevel(BIOME_TERRALITH_DESERT_OASIS) //Nile Delta flooded savanna
				.fromColour(191, 232, 27).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Norfolk Island subtropical forests
				.fromColour(106, 213, 120).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //North Atlantic moist mixed forests
				.fromColour(31, 203, 63).toLevel(BIOME_TERRALITH_ROCKY_MOUNTAINS) //North Central Rockies forests
				.fromColour(197, 222, 57).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //North Island temperate forests
				.fromColour(172, 210, 59).toLevel(BIOME_TERRALITH_DESERT_SPIRES) //North Saharan steppe and woodlands
				.fromColour(201, 73, 199).toLevel(BIOME_TERRALITH_DESERT_OASIS) //North Tibetan Plateau-Kunlun Mountains alpine desert
				.fromColour(221, 56, 122).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //North Western Ghats moist deciduous forests
				.fromColour(217, 223, 31).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //North Western Ghats montane rain forests
				.fromColour(29, 64, 222).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Northeast China Plain deciduous forests
				.fromColour(131, 37, 232).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Northeast India-Myanmar pine forests
				.fromColour(135, 237, 177).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Northeast Siberian coastal tundra
				.fromColour(100, 168, 204).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Northeast Siberian taiga
				.fromColour(76, 166, 204).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Northeastern coastal forests
				.fromColour(210, 106, 46).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Northeastern Congolian lowland forests
				.fromColour(223, 115, 139).toLevel(BIOME_TERRALITH_ALPINE_GROVE) //Northeastern Himalayan subalpine conifer forests
				.fromColour(165, 231, 137).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Northeastern Spain and Southern France Mediterranean forests
				.fromColour(207, 41, 113).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Northern Acacia-Commiphora bushlands and thickets
				.fromColour(80, 120, 230).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Northern Anatolian conifer and deciduous forests
				.fromColour(216, 84, 77).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Northern Andean páramo
				.fromColour(75, 61, 205).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Northern Annamites rain forests
				.fromColour(118, 224, 180).toLevel(BIOME_TERRALITH_MOONLIGHT_VALLEY) //Northern California coastal forests
				.fromColour(209, 105, 131).toLevel(BIOME_TERRALITH_SHIELD) //Northern Canadian Shield taiga
				.fromColour(119, 177, 219).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Northern Congolian forest-savanna mosaic
				.fromColour(91, 222, 101).toLevel(BIOME_TERRALITH_SHIELD) //Northern Cordillera forests
				.fromColour(85, 236, 168).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Northern dry deciduous forests
				.fromColour(86, 187, 210).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Northern Indochina subtropical forests
				.fromColour(214, 203, 77).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Northern Khorat Plateau moist deciduous forests
				.fromColour(235, 102, 45).toLevel(BIOME_TERRALITH_BLOOMING_PLATEAU) //Northern mixed grasslands
				.fromColour(47, 224, 221).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Northern New Guinea lowland rain and freshwater swamp forests
				.fromColour(194, 122, 216).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Northern New Guinea montane rain forests
				.fromColour(222, 93, 81).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Northern Pacific coastal forests
				.fromColour(37, 208, 159).toLevel(BIOME_TERRALITH_STEPPE) //Northern short grasslands
				.fromColour(63, 218, 123).toLevel(BIOME_TERRALITH_BLOOMING_VALLEY) //Northern tall grasslands
				.fromColour(221, 107, 62).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Northern Thailand-Laos moist deciduous forests
				.fromColour(128, 233, 151).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Northern transitional alpine forests
				.fromColour(61, 219, 198).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Northern Triangle temperate forests
				.fromColour(169, 114, 206).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Northern Vietnam lowland rain forests
				.fromColour(161, 42, 216).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Northern Zanzibar-Inhambane coastal forest mosaic
				.fromColour(164, 217, 49).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Northland temperate kauri forests
				.fromColour(171, 240, 115).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Northwest Iberian montane forests
				.fromColour(221, 214, 77).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Northwest Russian-Novaya Zemlya tundra
				.fromColour(218, 48, 62).toLevel(BIOME_TERRALITH_SIBERIAN_GROVE) //Northwest Territories taiga
				.fromColour(27, 177, 211).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Northwestern Andean montane forests
				.fromColour(69, 195, 202).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Northwestern Congolian lowland forests
				.fromColour(179, 45, 200).toLevel(BIOME_TERRALITH_BRUSHLAND) //Northwestern Hawaii scrub
				.fromColour(194, 118, 234).toLevel(BIOME_TERRALITH_STONY_SPIRES) //Northwestern Himalayan alpine shrub and meadows
				.fromColour(121, 220, 75).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Northwestern thorn scrub forests
				.fromColour(52, 209, 115).toLevel(BIOME_TERRALITH_COLD_SHRUBLAND) //Novosibirsk Islands arctic desert
				.fromColour(61, 102, 239).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Nujiang Langcang Gorge alpine conifer and mixed forests
				.fromColour(206, 101, 190).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Nullarbor Plains xeric shrublands
				.fromColour(229, 157, 85).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Oaxacan montane forests
				.fromColour(236, 79, 123).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Ogasawara subtropical moist forests
				.fromColour(113, 44, 232).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Ogilvie-MacKenzie alpine tundra
				.fromColour(235, 135, 176).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Okanagan dry forests
				.fromColour(222, 55, 133).toLevel(BIOME_TERRALITH_SNOWY_SHIELD) //Okhotsk-Manchurian taiga
				.fromColour(148, 206, 117).toLevel(BIOME_TERRALITH_STEPPE) //Ordos Plateau steppe
				.fromColour(148, 74, 239).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Orinoco Delta swamp forests
				.fromColour(146, 211, 60).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Orinoco wetlands
				.fromColour(76, 235, 161).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS); //Orissa semi-evergreen forests

			eco_terralith = eco_terralith.fromColour(154, 216, 103).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Ozark Mountain forests
				.fromColour(220, 139, 85).toLevel(BIOME_TERRALITH_GLACIAL_CHASM) //Pacific Coastal Mountain icefields and tundra
				.fromColour(15, 133, 211).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Palau tropical moist forests
				.fromColour(24, 217, 185).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Palawan rain forests
				.fromColour(54, 184, 207).toLevel(BIOME_TERRALITH_STEPPE) //Palouse grasslands
				.fromColour(214, 208, 23).toLevel(BIOME_TERRALITH_STONY_SPIRES) //Pamir alpine desert and tundra
				.fromColour(182, 219, 97).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Panamanian dry forests
				.fromColour(166, 132, 229).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Pannonian mixed forests
				.fromColour(235, 109, 138).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Pantanal
				.fromColour(93, 93, 233).toLevel(BIOME_TERRALITH_STEPPE) //Pantanos de Centla
				.fromColour(100, 225, 141).toLevel(BIOME_TERRALITH_HIGHLANDS) //Pantepui
				.fromColour(203, 203, 55).toLevel(BIOME_TERRALITH_SHRUBLAND) //Paraguana xeric scrub
				.fromColour(108, 230, 137).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Paraná flooded savanna
				.fromColour(130, 155, 231).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Paropamisus xeric woodlands
				.fromColour(215, 126, 163).toLevel(BIOME_TERRALITH_BRUSHLAND) //Patagonian steppe
				.fromColour(61, 37, 200).toLevel(BIOME_TERRALITH_SHRUBLAND) //Patía Valley dry forests
				.fromColour(31, 124, 218).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Peninsular Malaysian montane rain forests
				.fromColour(207, 123, 104).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Peninsular Malaysian peat swamp forests
				.fromColour(215, 93, 193).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Peninsular Malaysian rain forests
				.fromColour(98, 213, 224).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Pernambuco coastal forests
				.fromColour(129, 187, 238).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Pernambuco interior forests
				.fromColour(201, 223, 101).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Persian Gulf desert and semi-desert
				.fromColour(194, 88, 229).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Petén-Veracruz moist forests
				.fromColour(81, 136, 238).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Pilbara shrublands
				.fromColour(208, 189, 15).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Pindus Mountains mixed forests
				.fromColour(109, 203, 112).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Piney Woods forests
				.fromColour(170, 124, 213).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Po Basin mixed forests
				.fromColour(16, 210, 71).toLevel(BIOME_TERRALITH_STEPPE) //Pontic steppe
				.fromColour(213, 162, 60).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Puerto Rican dry forests
				.fromColour(130, 112, 235).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Puerto Rican moist forests
				.fromColour(86, 76, 205).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Puget lowland forests
				.fromColour(82, 113, 200).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Purus-Madeira moist forests
				.fromColour(218, 156, 70).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Pyrenees conifer and mixed forests
				.fromColour(228, 124, 38).toLevel(BIOME_TERRALITH_DESERT_SPIRES) //Qaidam Basin semi-desert
				.fromColour(225, 15, 201).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Qilian Mountains conifer forests
				.fromColour(76, 216, 165).toLevel(BIOME_TERRALITH_WINDSWEPT_SPIRES) //Qilian Mountains subalpine meadows
				.fromColour(202, 54, 190).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Qin Ling Mountains deciduous forests
				.fromColour(204, 67, 156).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Qionglai-Minshan conifer forests
				.fromColour(234, 28, 193).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Queen Charlotte Islands
				.fromColour(215, 211, 91).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Queensland tropical rain forests
				.fromColour(226, 82, 135).toLevel(BIOME_TERRALITH_BLOOMING_VALLEY) //Rakiura Island temperate forests
				.fromColour(232, 217, 104).toLevel(BIOME_TERRALITH_DESERT_OASIS) //Rann of Kutch seasonal salt marsh
				.fromColour(209, 134, 53).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Rapa Nui subtropical broadleaf forests
				.fromColour(166, 77, 234).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Red River freshwater swamp forests
				.fromColour(230, 237, 104).toLevel(BIOME_TERRALITH_SHRUBLAND) //Red Sea coastal desert
				.fromColour(127, 125, 238).toLevel(BIOME_TERRALITH_SHRUBLAND) //Red Sea Nubo-Sindian tropical desert and semi-desert
				.fromColour(89, 239, 234).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Registan-North Pakistan sandy desert
				.fromColour(227, 201, 114).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Richmond temperate forests
				.fromColour(216, 79, 77).toLevel(BIOME_TERRALITH_EMERALD_PEAKS) //Rock and Ice
				.fromColour(155, 118, 207).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Rodope montane mixed forests
				.fromColour(104, 213, 112).toLevel(BIOME_TERRALITH_STONY_SPIRES) //Rwenzori-Virunga montane moorlands
				.fromColour(60, 62, 221).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Sahara desert
				.fromColour(103, 204, 237).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Saharan flooded grasslands
				.fromColour(196, 236, 137).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Saharan halophytics
				.fromColour(64, 135, 216).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Sahelian Acacia savanna
				.fromColour(12, 32, 210).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Sakhalin Island taiga
				.fromColour(203, 108, 82).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Samoan tropical moist forests
				.fromColour(163, 235, 39).toLevel(BIOME_TERRALITH_WINDSWEPT_SPIRES) //San Félix-San Ambrosio Islands temperate forests
				.fromColour(26, 240, 37).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //San Lucan xeric scrub
				.fromColour(222, 132, 47).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Santa Marta montane forests
				.fromColour(15, 47, 233).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Santa Marta páramo
				.fromColour(222, 104, 173).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Sao Tome, Principe and Annobon moist lowland forests
				.fromColour(227, 185, 18).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Sarmatic mixed forests
				.fromColour(216, 186, 39).toLevel(BIOME_TERRALITH_ALPINE_GROVE); //Sayan Alpine meadows and tundra

			eco_terralith = eco_terralith.fromColour(119, 86, 216).toLevel(BIOME_TERRALITH_STEPPE) //Sayan Intermontane steppe
				.fromColour(99, 154, 200).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Sayan montane conifer forests
				.fromColour(107, 114, 236).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Scandinavian and Russian taiga
				.fromColour(168, 46, 216).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Scandinavian coastal conifer forests
				.fromColour(149, 121, 215).toLevel(BIOME_TERRALITH_BIRCH_TAIGA) //Scandinavian Montane Birch forest and grasslands
				.fromColour(17, 207, 134).toLevel(BIOME_TERRALITH_GLACIAL_CHASM) //Scotia Sea Islands tundra
				.fromColour(132, 210, 224).toLevel(BIOME_TERRALITH_DESERT_CANYON) //Sechura desert
				.fromColour(239, 26, 51).toLevel(BIOME_TERRALITH_STEPPE) //Selenge-Orkhon forest steppe
				.fromColour(235, 127, 18).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Seram rain forests
				.fromColour(123, 239, 52).toLevel(BIOME_TERRALITH_ASHEN_SAVANNA) //Serengeti volcanic grasslands
				.fromColour(237, 129, 114).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Serra do Mar coastal forests
				.fromColour(161, 219, 127).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Sichuan Basin evergreen broadleaf forests
				.fromColour(125, 228, 129).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS) //Sierra de la Laguna dry forests
				.fromColour(235, 174, 121).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Sierra de la Laguna pine-oak forests
				.fromColour(118, 64, 205).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Sierra de los Tuxtlas
				.fromColour(76, 93, 225).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Sierra Juarez and San Pedro Martir pine-oak forests
				.fromColour(217, 115, 52).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Sierra Madre de Chiapas moist forests
				.fromColour(232, 239, 138).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Sierra Madre de Oaxaca pine-oak forests
				.fromColour(145, 209, 42).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Sierra Madre del Sur pine-oak forests
				.fromColour(226, 91, 60).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Sierra Madre Occidental pine-oak forests
				.fromColour(215, 50, 233).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Sierra Madre Oriental pine-oak forests
				.fromColour(20, 226, 13).toLevel(BIOME_TERRALITH_YOSEMITE_LOWLANDS) //Sierra Nevada forests
				.fromColour(74, 225, 185).toLevel(BIOME_TERRALITH_RED_OASIS) //Simpson desert
				.fromColour(92, 220, 45).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Sinaloan dry forests
				.fromColour(74, 130, 235).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Sinú Valley dry forests
				.fromColour(104, 211, 103).toLevel(BIOME_TERRALITH_SHRUBLAND) //Snake-Columbia shrub steppe
				.fromColour(231, 129, 111).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Society Islands tropical moist forests
				.fromColour(222, 120, 190).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Socotra Island xeric shrublands
				.fromColour(126, 212, 136).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Solimões-Japurá moist forests
				.fromColour(215, 85, 25).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Solomon Islands rain forests
				.fromColour(186, 209, 93).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Somali Acacia-Commiphora bushlands and thickets
				.fromColour(209, 54, 82).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Somali montane xeric woodlands
				.fromColour(212, 151, 54).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Sonoran desert
				.fromColour(236, 44, 143).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Sonoran-Sinaloan transition subtropical dry forest
				.fromColour(227, 173, 85).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //South Appenine mixed montane forests
				.fromColour(122, 201, 135).toLevel(BIOME_TERRALITH_STEPPE) //South Avalon-Burin oceanic barrens
				.fromColour(114, 203, 25).toLevel(BIOME_TERRALITH_YELLOWSTONE) //South Central Rockies forests
				.fromColour(28, 208, 15).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //South China-Vietnam subtropical evergreen forests
				.fromColour(115, 168, 221).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //South Deccan Plateau dry deciduous forests
				.fromColour(60, 174, 215).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //South Florida rocklands
				.fromColour(61, 227, 205).toLevel(BIOME_TERRALITH_DESERT_SPIRES) //South Iran Nubo-Sindian desert and semi-desert
				.fromColour(238, 138, 105).toLevel(BIOME_TERRALITH_HIGHLANDS) //South Island montane grasslands
				.fromColour(50, 215, 146).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //South Island temperate forests
				.fromColour(226, 91, 190).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //South Malawi montane forest-grassland mosaic
				.fromColour(120, 235, 19).toLevel(BIOME_TERRALITH_DESERT_OASIS) //South Saharan steppe and woodlands
				.fromColour(234, 221, 83).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //South Sakhalin-Kurile mixed forests
				.fromColour(93, 60, 225).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //South Siberian forest steppe
				.fromColour(130, 226, 100).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //South Taiwan monsoon rain forests
				.fromColour(220, 182, 124).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //South Western Ghats moist deciduous forests
				.fromColour(209, 49, 68).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //South Western Ghats montane rain forests
				.fromColour(115, 221, 165).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Southeast Australia temperate forests
				.fromColour(207, 103, 162).toLevel(BIOME_TERRALITH_FRACTURED_SAVANNA) //Southeast Australia temperate savanna
				.fromColour(176, 234, 118).toLevel(BIOME_TERRALITH_BLOOMING_VALLEY) //Southeast Tibet shrublands and meadows
				.fromColour(225, 36, 99).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Southeastern conifer forests
				.fromColour(141, 44, 211).toLevel(BIOME_TERRALITH_SHRUBLAND) //Southeastern Iberian shrubs and woodlands
				.fromColour(112, 95, 236).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Southeastern Indochina dry evergreen forests
				.fromColour(141, 230, 72).toLevel(BIOME_TERRALITH_BLOOMING_VALLEY) //Southeastern mixed forests
				.fromColour(187, 96, 233).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Southeastern Papuan rain forests
				.fromColour(115, 123, 210).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Southern Acacia-Commiphora bushlands and thickets
				.fromColour(74, 210, 94).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Southern Africa bushveld
				.fromColour(220, 220, 93).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Southern Anatolian montane conifer and deciduous forests
				.fromColour(15, 232, 83).toLevel(BIOME_TERRALITH_STONY_SPIRES) //Southern Andean steppe
				.fromColour(33, 213, 75).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Southern Andean Yungas
				.fromColour(175, 121, 218).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE); //Southern Annamites montane rain forests

			eco_terralith = eco_terralith.fromColour(236, 143, 188).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Southern Cone Mesopotamian savanna
				.fromColour(225, 127, 197).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Southern Congolian forest-savanna mosaic
				.fromColour(140, 168, 234).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Southern Great Lakes forests
				.fromColour(70, 159, 237).toLevel(BIOME_TERRALITH_SHIELD) //Southern Hudson Bay taiga
				.fromColour(102, 216, 87).toLevel(BIOME_TERRALITH_GLACIAL_CHASM) //Southern Indian Ocean Islands tundra
				.fromColour(25, 117, 238).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Southern Korea evergreen forests
				.fromColour(240, 26, 140).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Southern Miombo woodlands
				.fromColour(112, 150, 239).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Southern New Guinea lowland rain forests
				.fromColour(211, 216, 108).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Southern Pacific dry forests
				.fromColour(81, 45, 213).toLevel(BIOME_TERRALITH_SHRUBLAND) //Southern Rift montane forest-grassland mosaic
				.fromColour(187, 200, 73).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Southern Vietnam lowland dry forests
				.fromColour(201, 237, 139).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Southern Zanzibar-Inhambane coastal forest mosaic
				.fromColour(50, 195, 203).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Southwest Amazon moist forests
				.fromColour(85, 78, 218).toLevel(BIOME_TERRALITH_FRACTURED_SAVANNA) //Southwest Australia savanna
				.fromColour(123, 221, 75).toLevel(BIOME_TERRALITH_FRACTURED_SAVANNA) //Southwest Australia woodlands
				.fromColour(220, 157, 109).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Southwest Borneo freshwater swamp forests
				.fromColour(215, 190, 127).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Southwest Iberian Mediterranean sclerophyllous and mixed forests
				.fromColour(147, 240, 104).toLevel(BIOME_TERRALITH_SHRUBLAND) //Southwestern Arabian foothills savanna
				.fromColour(113, 236, 144).toLevel(BIOME_TERRALITH_SANDSTONE_VALLEY) //Southwestern Arabian montane woodlands
				.fromColour(108, 201, 210).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Sri Lanka dry-zone dry evergreen forests
				.fromColour(202, 202, 45).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Sri Lanka lowland rain forests
				.fromColour(62, 227, 106).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Sri Lanka montane rain forests
				.fromColour(145, 124, 229).toLevel(BIOME_TERRALITH_ASHEN_SAVANNA) //St. Helena scrub and woodlands
				.fromColour(131, 24, 224).toLevel(BIOME_TERRALITH_STONY_SPIRES) //St. Peter and St. Paul rocks
				.fromColour(223, 94, 58).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Succulent Karoo
				.fromColour(200, 27, 105).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Suiphun-Khanka meadows and forest meadows
				.fromColour(230, 111, 186).toLevel(BIOME_TERRALITH_BLOOMING_VALLEY) //Sulaiman Range alpine meadows
				.fromColour(39, 158, 205).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Sulawesi lowland rain forests
				.fromColour(81, 209, 58).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Sulawesi montane rain forests
				.fromColour(222, 131, 199).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Sulu Archipelago rain forests
				.fromColour(165, 63, 202).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Sumatran freshwater swamp forests
				.fromColour(220, 50, 236).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Sumatran lowland rain forests
				.fromColour(180, 18, 216).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Sumatran montane rain forests
				.fromColour(229, 32, 95).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Sumatran peat swamp forests
				.fromColour(34, 216, 155).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Sumatran tropical pine forests
				.fromColour(62, 204, 30).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Sumba deciduous forests
				.fromColour(134, 67, 227).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Sundaland heath forests
				.fromColour(207, 46, 191).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Sundarbans freshwater swamp forests
				.fromColour(223, 172, 33).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Swan Coastal Plain Scrub and Woodlands
				.fromColour(146, 66, 217).toLevel(BIOME_TERRALITH_SAKURA_GROVE) //Taiheiyo evergreen forests
				.fromColour(82, 84, 204).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Taiheiyo montane deciduous forests
				.fromColour(95, 110, 210).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Taimyr-Central Siberian tundra
				.fromColour(27, 100, 218).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Taiwan subtropical evergreen forests
				.fromColour(26, 99, 215).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Taklimakan desert
				.fromColour(236, 128, 128).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Talamancan montane forests
				.fromColour(221, 101, 227).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Tamaulipan matorral
				.fromColour(206, 217, 121).toLevel(BIOME_TERRALITH_SHRUBLAND) //Tamaulipan mezquital
				.fromColour(237, 109, 84).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Tapajós-Xingu moist forests
				.fromColour(202, 183, 74).toLevel(BIOME_TERRALITH_SKYLANDS_AUTUMN) //Tarim Basin deciduous forests and steppe
				.fromColour(219, 39, 162).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Tasmanian Central Highland forests
				.fromColour(233, 132, 146).toLevel(BIOME_TERRALITH_BLOOMING_VALLEY) //Tasmanian temperate forests
				.fromColour(51, 21, 202).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Tasmanian temperate rain forests
				.fromColour(33, 217, 131).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Tehuacán Valley matorral
				.fromColour(214, 49, 220).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Tenasserim-South Thailand semi-evergreen rain forests
				.fromColour(227, 136, 168).toLevel(BIOME_TERRALITH_FRACTURED_SAVANNA) //Terai-Duar savanna and grasslands
				.fromColour(203, 62, 228).toLevel(BIOME_TERRALITH_BRUSHLAND) //Texas blackland prairies
				.fromColour(230, 142, 28).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Thar desert
				.fromColour(75, 153, 217).toLevel(BIOME_TERRALITH_STEPPE) //Tian Shan foothill arid steppe
				.fromColour(211, 117, 167).toLevel(BIOME_TERRALITH_GLACIAL_CHASM) //Tian Shan montane conifer forests
				.fromColour(107, 75, 223).toLevel(BIOME_TERRALITH_BLOOMING_VALLEY) //Tian Shan montane steppe and meadows
				.fromColour(218, 136, 68).toLevel(BIOME_TERRALITH_LUSH_DESERT) //Tibesti-Jebel Uweinat montane xeric woodlands
				.fromColour(212, 27, 129).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Tibetan Plateau alpine shrublands and meadows
				.fromColour(238, 210, 100).toLevel(BIOME_TERRALITH_DESERT_OASIS) //Tigris-Euphrates alluvial salt marsh
				.fromColour(213, 95, 91).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE); //Timor and Wetar deciduous forests

			eco_terralith = eco_terralith.fromColour(13, 36, 208).toLevel(BIOME_TERRALITH_GRAVEL_DESERT) //Tirari-Sturt stony desert
				.fromColour(96, 189, 220).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Tocantins-Pindare moist forests
				.fromColour(200, 223, 54).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Tongan tropical moist forests
				.fromColour(236, 139, 197).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Tonle Sap freshwater swamp forests
				.fromColour(121, 216, 161).toLevel(BIOME_TERRALITH_GLACIAL_CHASM) //Torngat Mountain tundra
				.fromColour(58, 207, 60).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Trans Fly savanna and grasslands
				.fromColour(148, 208, 79).toLevel(BIOME_TERRALITH_ICE_MARSH) //Trans-Baikal Bald Mountain tundra
				.fromColour(46, 223, 85).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Trans-Baikal conifer forests
				.fromColour(196, 227, 38).toLevel(BIOME_TERRALITH_ALPINE_HIGHLANDS) //Trans-Mexican Volcanic Belt pine-oak forests
				.fromColour(32, 18, 221).toLevel(BIOME_TERRALITH_STONY_SPIRES) //Trindade-Martin Vaz Islands tropical forests
				.fromColour(175, 88, 218).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Trinidad and Tobago moist forests
				.fromColour(216, 62, 35).toLevel(BIOME_TERRALITH_MOONLIGHT_GROVE) //Tristan Da Cunha-Gough Islands shrub and grasslands
				.fromColour(215, 145, 14).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Trobriand Islands rain forests
				.fromColour(162, 238, 118).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Tuamotu tropical moist forests
				.fromColour(218, 227, 91).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Tubuai tropical moist forests
				.fromColour(128, 210, 177).toLevel(BIOME_TERRALITH_SHRUBLAND) //Tumbes-Piura dry forests
				.fromColour(56, 218, 230).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Tyrrhenian-Adriatic Sclerophyllous and mixed forests
				.fromColour(128, 214, 144).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Uatuma-Trombetas moist forests
				.fromColour(220, 61, 25).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Ucayali moist forests
				.fromColour(62, 154, 224).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Upper Gangetic Plains moist deciduous forests
				.fromColour(64, 215, 150).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Upper Midwest forest-savanna transition
				.fromColour(207, 78, 110).toLevel(BIOME_TERRALITH_SIBERIAN_GROVE) //Ural montane forests and tundra
				.fromColour(208, 161, 104).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Uruguayan savanna
				.fromColour(206, 83, 78).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Ussuri broadleaf and mixed forests
				.fromColour(159, 230, 67).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Valdivian temperate forests
				.fromColour(114, 187, 207).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Vanuatu rain forests
				.fromColour(23, 142, 201).toLevel(BIOME_TERRALITH_PAINTED_MOUNTAINS) //Venezuelan Andes montane forests
				.fromColour(207, 63, 121).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Veracruz dry forests
				.fromColour(208, 24, 76).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Veracruz moist forests
				.fromColour(208, 126, 200).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Veracruz montane forests
				.fromColour(55, 228, 165).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Victoria Basin forest-savanna mosaic
				.fromColour(221, 28, 22).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Victoria Plains tropical savanna
				.fromColour(153, 219, 131).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Vogelkop montane rain forests
				.fromColour(214, 44, 106).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Vogelkop-Aru lowland rain forests
				.fromColour(145, 40, 202).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Wasatch and Uinta montane forests
				.fromColour(107, 186, 210).toLevel(BIOME_TERRALITH_DESERT_SPIRES) //West Saharan montane xeric woodlands
				.fromColour(202, 219, 48).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //West Siberian taiga
				.fromColour(201, 122, 130).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //West Sudanian savanna
				.fromColour(200, 133, 224).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //Western Australian Mulga shrublands
				.fromColour(238, 197, 47).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Western Congolian forest-savanna mosaic
				.fromColour(129, 186, 215).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Western Ecuador moist forests
				.fromColour(141, 202, 80).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Western European broadleaf forests
				.fromColour(240, 175, 132).toLevel(BIOME_TERRALITH_HAZE_MOUNTAIN) //Western Great Lakes forests
				.fromColour(210, 123, 184).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Western Guinean lowland forests
				.fromColour(136, 228, 38).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Western Gulf coastal grasslands
				.fromColour(131, 38, 225).toLevel(BIOME_TERRALITH_STONY_SPIRES) //Western Himalayan alpine shrub and Meadows
				.fromColour(224, 118, 118).toLevel(BIOME_TERRALITH_CLOUD_FOREST) //Western Himalayan broadleaf forests
				.fromColour(90, 201, 35).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Western Himalayan subalpine conifer forests
				.fromColour(61, 209, 232).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Western Java montane rain forests
				.fromColour(33, 207, 219).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Western Java rain forests
				.fromColour(224, 42, 133).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Western Polynesian tropical moist forests
				.fromColour(215, 84, 91).toLevel(BIOME_TERRALITH_BRUSHLAND) //Western short grasslands
				.fromColour(117, 226, 109).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Western Siberian hemiboreal forests
				.fromColour(154, 61, 224).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Western Zambezian grasslands
				.fromColour(74, 134, 223).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Westland temperate forests
				.fromColour(179, 219, 68).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Willamette Valley forests
				.fromColour(224, 19, 53).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Windward Islands moist forests
				.fromColour(155, 208, 20).toLevel(BIOME_TERRALITH_SNOWY_BADLANDS) //Wrangel Island arctic desert
				.fromColour(210, 156, 80).toLevel(BIOME_TERRALITH_SHRUBLAND) //Wyoming Basin shrub steppe
				.fromColour(234, 99, 234).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Xingu-Tocantins-Araguaia moist forests
				.fromColour(205, 97, 227).toLevel(BIOME_TERRALITH_SIBERIAN_TAIGA) //Yamal-Gydan tundra
				.fromColour(111, 232, 105).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Yap tropical dry forests
				.fromColour(216, 15, 35).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Yapen rain forests
				.fromColour(168, 203, 103).toLevel(BIOME_TERRALITH_SAVANNA_BADLANDS); //Yarlung Tsangpo arid steppe

			eco_terralith = eco_terralith.fromColour(212, 209, 49).toLevel(BIOME_TERRALITH_BLOOMING_VALLEY) //Yellow Sea saline meadow
				.fromColour(219, 106, 191).toLevel(BIOME_TERRALITH_AMETHYST_RAINFOREST) //Yucatán dry forests
				.fromColour(54, 217, 111).toLevel(BIOME_TERRALITH_TROPICAL_JUNGLE) //Yucatán moist forests
				.fromColour(236, 189, 60).toLevel(BIOME_TERRALITH_SNOWY_SHIELD) //Yukon Interior dry forests
				.fromColour(106, 227, 219).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Yunnan Plateau subtropical evergreen forests
				.fromColour(16, 190, 202).toLevel(BIOME_TERRALITH_FRACTURED_SAVANNA) //Zagros Mountains forest steppe
				.fromColour(203, 48, 68).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Zambezian and Mopane woodlands
				.fromColour(231, 146, 140).toLevel(BIOME_TERRALITH_SAVANNA_SLOPES) //Zambezian Baikiaea woodlands
				.fromColour(94, 177, 213).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Zambezian coastal flooded savanna
				.fromColour(30, 35, 200).toLevel(BIOME_TERRALITH_ROCKY_JUNGLE) //Zambezian Cryptosepalum dry forests
				.fromColour(219, 94, 70).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Zambezian flooded grasslands
				.fromColour(17, 234, 187).toLevel(BIOME_TERRALITH_ORCHID_SWAMP) //Zambezian halophytics
				.go();
		}


		if (mod_Terralith === "True") {
			var eco_terralith = wp.applyHeightMap(ecoRegionImage)
				.toWorld(world)
				.shift(shiftLongitute, shiftLatitude)
				.applyToLayer(biomesLayer);

			eco_terralith = eco_terralith.fromColour(227, 85, 108).toLevel(BIOME_TERRALITH_ALPINE_GROVE) //Alps conifer and mixed forests
				.fromColour(61, 164, 224).toLevel(BIOME_TERRALITH_HOT_SHRUBLAND) //California coastal sage and chaparral
				.fromColour(119, 95, 226).toLevel(BIOME_TERRALITH_SHRUBLAND) //California interior chaparral and woodlands
				.fromColour(212, 24, 215).toLevel(BIOME_TERRALITH_WHITE_MESA) //Colorado Plateau shrublands
				.fromColour(234, 136, 201).toLevel(BIOME_TERRALITH_JUNGLE_MOUNTAINS) //Guizhou Plateau broadleaf and mixed forests
				.fromColour(61, 167, 238).toLevel(BIOME_TERRALITH_SAKURA_GROVE) //Nihonkai evergreen forests
				.fromColour(58, 218, 37).toLevel(BIOME_TERRALITH_DESERT_OASIS) //Nile Delta flooded savanna
				.fromColour(20, 226, 13).toLevel(BIOME_TERRALITH_YOSEMITE_LOWLANDS) //Sierra Nevada forests
				.fromColour(114, 203, 25).toLevel(BIOME_TERRALITH_YELLOWSTONE) //South Central Rockies forests
				.fromColour(238, 138, 105).toLevel(BIOME_TERRALITH_HIGHLANDS) //South Island montane grasslands
				.fromColour(146, 66, 217).toLevel(BIOME_TERRALITH_SAKURA_GROVE) //Taiheiyo evergreen forests
				.fromColour(145, 40, 202).toLevel(BIOME_TERRALITH_TEMPERATE_HIGHLANDS) //Wasatch and Uinta montane forests
				.fromColour(215, 84, 91).toLevel(BIOME_TERRALITH_BRUSHLAND) //Western short grasslands
				.go();
		}

		//Insert custom biomes / modded biomes ending here:

		if (settingsVanillaPopulation === "False") {

			wp.applyHeightMap(ecoRegionImage)
				.toWorld(world)
				.shift(shiftLongitute, shiftLatitude)
				.applyToLayer(frostLayer)
				.fromColour(53, 231, 121).toLevel(1) //Alaska-St. Elias Range tundra
				.fromColour(76, 205, 166).toLevel(1) //Aleutian Islands tundra
				.fromColour(175, 121, 207).toLevel(1) //Arctic coastal tundra
				.fromColour(91, 202, 60).toLevel(1) //Arctic desert
				.fromColour(198, 96, 239).toLevel(1) //Arctic foothills tundra
				.fromColour(206, 77, 74).toLevel(1) //Altai steppe and semi-desert
				.fromColour(155, 208, 20).toLevel(1) //Wrangel Island arctic desert
				.fromColour(138, 201, 56).toLevel(1) //Bering tundra
				.fromColour(214, 102, 171).toLevel(1) //Beringia upland tundra
				.fromColour(211, 75, 229).toLevel(1) //High Arctic tundra
				.fromColour(208, 106, 43).toLevel(1) //Middle Arctic tundra
				.fromColour(52, 209, 115).toLevel(1) //Novosibirsk Islands arctic desert
				.fromColour(216, 79, 77).toLevel(1) //Rock and Ice
				.fromColour(164, 213, 38).toLevel(1) //Beringia lowland tundra
				.fromColour(16, 221, 221).toLevel(1) //Cherskii-Kolyma mountain tundra
				.fromColour(206, 121, 113).toLevel(1) //Chukchi Peninsula tundra
				.fromColour(202, 28, 112).toLevel(1) //Interior Yukon-Alaska alpine tundra
				.fromColour(121, 236, 44).toLevel(1) //Kalaallit Nunaat high arctic tundra
				.fromColour(30, 122, 208).toLevel(1) //Kalaallit Nunaat low arctic tundra
				.fromColour(236, 106, 230).toLevel(1) //Kola Peninsula tundra
				.fromColour(222, 40, 216).toLevel(1) //Low Arctic tundra
				.fromColour(135, 237, 177).toLevel(1) //Northeast Siberian coastal tundra
				.fromColour(221, 214, 77).toLevel(1) //Northwest Russian-Novaya Zemlya tundra
				.fromColour(113, 44, 232).toLevel(1) //Ogilvie-MacKenzie alpine tundra
				.fromColour(95, 110, 210).toLevel(1) //Taimyr-Central Siberian tundra
				.fromColour(76, 185, 225).toLevel(1) //Antipodes Subantarctic Islands tundra
				.fromColour(223, 98, 79).toLevel(1) //Baffin coastal tundra
				.fromColour(124, 214, 168).toLevel(1) //Brooks-British Range tundra
				.fromColour(173, 116, 208).toLevel(1) //Davis Highlands tundra
				.fromColour(70, 225, 46).toLevel(1) //Kamchatka Mountain tundra and forest tundra
				.fromColour(211, 65, 204).toLevel(1) //Maudlandia Antarctic desert
				.fromColour(220, 139, 85).toLevel(1) //Pacific Coastal Mountain icefields and tundra
				.fromColour(17, 207, 134).toLevel(1) //Scotia Sea Islands tundra
				.fromColour(102, 216, 87).toLevel(1) //Southern Indian Ocean Islands tundra
				.fromColour(211, 117, 167).toLevel(1) //Tian Shan montane conifer forests
				.fromColour(107, 75, 223).toLevel(1) //Tian Shan montane steppe and meadows
				.fromColour(121, 216, 161).toLevel(1) //Torngat Mountain tundra
				.go();

			wp.applyHeightMap(ecoRegionImage)
				.toWorld(world)
				.shift(shiftLongitute, shiftLatitude)
				.applyToLayer(swampTerrain)
				.fromColour(108, 222, 214).toLevel(1) //Borneo peat swamp forests
				.fromColour(224, 60, 98).toLevel(1) //Chao Phraya freshwater swamp forests
				.fromColour(212, 62, 24).toLevel(1) //Cuban wetlands
				.fromColour(235, 227, 108).toLevel(1) //Eastern Congolian swamp forests
				.fromColour(227, 133, 32).toLevel(1) //Everglades
				.fromColour(45, 232, 132).toLevel(1) //Guayaquil flooded grasslands
				.fromColour(19, 231, 178).toLevel(1) //Iquitos varzeá
				.fromColour(82, 169, 220).toLevel(1) //Lake Chad flooded savanna
				.fromColour(174, 37, 208).toLevel(1) //Monte Alegre varzeá
				.fromColour(149, 110, 208).toLevel(1) //Nenjiang River grassland
				.fromColour(213, 66, 208).toLevel(1) //Niger Delta swamp forests
				.fromColour(47, 224, 221).toLevel(1) //Northern New Guinea lowland rain and freshwater swamp forests
				.fromColour(146, 211, 60).toLevel(1) //Orinoco wetlands
				.fromColour(235, 109, 138).toLevel(1) //Pantanal
				.fromColour(108, 230, 137).toLevel(1) //Paraná flooded savanna
				.fromColour(207, 123, 104).toLevel(1) //Peninsular Malaysian peat swamp forests
				.fromColour(35, 205, 61).toLevel(1) //Purus varzeá
				.fromColour(60, 174, 215).toLevel(1) //South Florida rocklands
				.fromColour(220, 157, 109).toLevel(1) //Southwest Borneo freshwater swamp forests
				.fromColour(200, 27, 105).toLevel(1) //Suiphun-Khanka meadows and forest meadows
				.fromColour(165, 63, 202).toLevel(1) //Sumatran freshwater swamp forests
				.fromColour(229, 32, 95).toLevel(1) //Sumatran peat swamp forests
				.fromColour(238, 210, 100).toLevel(1) //Tigris-Euphrates alluvial salt marsh
				.fromColour(98, 214, 200).toLevel(1) //Tonle Sap-Mekong peat swamp forests
				.fromColour(148, 208, 79).toLevel(1) //Trans-Baikal Bald Mountain tundra
				.fromColour(200, 92, 80).toLevel(1) //Western Congolian swamp forests
				.fromColour(94, 177, 213).toLevel(1) //Zambezian coastal flooded savanna
				.fromColour(219, 94, 70).toLevel(1) //Zambezian flooded grasslands
				.fromColour(17, 234, 187).toLevel(1) //Zambezian halophytics
				.go();

			wp.applyHeightMap(ecoRegionImage)
				.toWorld(world)
				.shift(shiftLongitute, shiftLatitude)
				.applyToLayer(swampLayer)
				.fromColour(108, 222, 214).toLevel(15) //Borneo peat swamp forests
				.fromColour(224, 60, 98).toLevel(15) //Chao Phraya freshwater swamp forests
				.fromColour(212, 62, 24).toLevel(15) //Cuban wetlands
				.fromColour(235, 227, 108).toLevel(15) //Eastern Congolian swamp forests
				.fromColour(227, 133, 32).toLevel(15) //Everglades
				.fromColour(45, 232, 132).toLevel(15) //Guayaquil flooded grasslands
				.fromColour(19, 231, 178).toLevel(15) //Iquitos varzeá
				.fromColour(82, 169, 220).toLevel(15) //Lake Chad flooded savanna
				.fromColour(174, 37, 208).toLevel(15) //Monte Alegre varzeá
				.fromColour(149, 110, 208).toLevel(15) //Nenjiang River grassland
				.fromColour(213, 66, 208).toLevel(15) //Niger Delta swamp forests
				.fromColour(47, 224, 221).toLevel(15) //Northern New Guinea lowland rain and freshwater swamp forests
				.fromColour(146, 211, 60).toLevel(15) //Orinoco wetlands
				.fromColour(235, 109, 138).toLevel(15) //Pantanal
				.fromColour(108, 230, 137).toLevel(15) //Paraná flooded savanna
				.fromColour(207, 123, 104).toLevel(15) //Peninsular Malaysian peat swamp forests
				.fromColour(35, 205, 61).toLevel(15) //Purus varzeá
				.fromColour(60, 174, 215).toLevel(15) //South Florida rocklands
				.fromColour(220, 157, 109).toLevel(15) //Southwest Borneo freshwater swamp forests
				.fromColour(200, 27, 105).toLevel(15) //Suiphun-Khanka meadows and forest meadows
				.fromColour(165, 63, 202).toLevel(15) //Sumatran freshwater swamp forests
				.fromColour(229, 32, 95).toLevel(15) //Sumatran peat swamp forests
				.fromColour(238, 210, 100).toLevel(15) //Tigris-Euphrates alluvial salt marsh
				.fromColour(98, 214, 200).toLevel(15) //Tonle Sap-Mekong peat swamp forests
				.fromColour(148, 208, 79).toLevel(15) //Trans-Baikal Bald Mountain tundra
				.fromColour(200, 92, 80).toLevel(15) //Western Congolian swamp forests
				.fromColour(94, 177, 213).toLevel(15) //Zambezian coastal flooded savanna
				.fromColour(219, 94, 70).toLevel(15) //Zambezian flooded grasslands
				.fromColour(17, 234, 187).toLevel(15) //Zambezian halophytics
				.go();


			if (isVersionAtLeast("1-17")) {

				wp.applyHeightMap(ecoRegionImage)
					.toWorld(world)
					.shift(shiftLongitute, shiftLatitude)
					.applyToLayer(dripleafsLayer)
					.fromColour(108, 222, 214).toLevel(15) //Borneo peat swamp forests
					.fromColour(224, 60, 98).toLevel(15) //Chao Phraya freshwater swamp forests
					.fromColour(212, 62, 24).toLevel(15) //Cuban wetlands
					.fromColour(235, 227, 108).toLevel(15) //Eastern Congolian swamp forests
					.fromColour(227, 133, 32).toLevel(15) //Everglades
					.fromColour(45, 232, 132).toLevel(15) //Guayaquil flooded grasslands
					.fromColour(19, 231, 178).toLevel(15) //Iquitos varzeá
					.fromColour(82, 169, 220).toLevel(15) //Lake Chad flooded savanna
					.fromColour(174, 37, 208).toLevel(15) //Monte Alegre varzeá
					.fromColour(149, 110, 208).toLevel(15) //Nenjiang River grassland
					.fromColour(213, 66, 208).toLevel(15) //Niger Delta swamp forests
					.fromColour(47, 224, 221).toLevel(15) //Northern New Guinea lowland rain and freshwater swamp forests
					.fromColour(146, 211, 60).toLevel(15) //Orinoco wetlands
					.fromColour(235, 109, 138).toLevel(15) //Pantanal
					.fromColour(108, 230, 137).toLevel(15) //Paraná flooded savanna
					.fromColour(207, 123, 104).toLevel(15) //Peninsular Malaysian peat swamp forests
					.fromColour(35, 205, 61).toLevel(15) //Purus varzeá
					.fromColour(60, 174, 215).toLevel(15) //South Florida rocklands
					.fromColour(220, 157, 109).toLevel(15) //Southwest Borneo freshwater swamp forests
					.fromColour(200, 27, 105).toLevel(15) //Suiphun-Khanka meadows and forest meadows
					.fromColour(165, 63, 202).toLevel(15) //Sumatran freshwater swamp forests
					.fromColour(229, 32, 95).toLevel(15) //Sumatran peat swamp forests
					.fromColour(238, 210, 100).toLevel(15) //Tigris-Euphrates alluvial salt marsh
					.fromColour(98, 214, 200).toLevel(15) //Tonle Sap-Mekong peat swamp forests
					.fromColour(148, 208, 79).toLevel(15) //Trans-Baikal Bald Mountain tundra
					.fromColour(200, 92, 80).toLevel(15) //Western Congolian swamp forests
					.fromColour(94, 177, 213).toLevel(15) //Zambezian coastal flooded savanna
					.fromColour(219, 94, 70).toLevel(15) //Zambezian flooded grasslands
					.fromColour(17, 234, 187).toLevel(15) //Zambezian halophytics
					.go();

			}

			if (isVersionAtLeast("1-19")) {

				wp.applyHeightMap(ecoRegionImage)
					.toWorld(world)
					.shift(shiftLongitute, shiftLatitude)
					.applyToLayer(mangroveTerrain)
					.fromColour(67, 224, 200).toLevel(1) //Amazon-Orinoco-Southern Caribbean mangroves
					.fromColour(202, 66, 21).toLevel(1) //Bahamian-Antillean mangroves
					.fromColour(37, 37, 218).toLevel(1) //Central African mangroves
					.fromColour(18, 206, 55).toLevel(1) //East African mangroves
					.fromColour(76, 147, 239).toLevel(1) //Goadavari-Krishna mangroves
					.fromColour(210, 48, 69).toLevel(1) //Guianan freshwater swamp forests
					.fromColour(180, 83, 240).toLevel(1) //Guinean mangroves
					.fromColour(104, 108, 203).toLevel(1) //Gurupa varzeá
					.fromColour(188, 68, 212).toLevel(1) //Indochina mangroves
					.fromColour(133, 208, 86).toLevel(1) //Indus River Delta-Arabian Sea mangroves
					.fromColour(156, 206, 57).toLevel(1) //Madagascar mangroves
					.fromColour(207, 208, 122).toLevel(1) //Mesoamerican Gulf-Caribbean mangroves
					.fromColour(118, 201, 149).toLevel(1) //Myanmar Coast mangroves
					.fromColour(41, 212, 175).toLevel(1) //New Guinea mangroves
					.fromColour(47, 33, 239).toLevel(1) //Northern Mesoamerican Pacific mangroves
					.fromColour(148, 74, 239).toLevel(1) //Orinoco Delta swamp forests
					.fromColour(92, 75, 203).toLevel(1) //South American Pacific mangroves
					.fromColour(58, 92, 207).toLevel(1) //Southern Atlantic mangroves
					.fromColour(97, 149, 220).toLevel(1) //Southern Mesoamerican Pacific mangroves
					.fromColour(175, 118, 239).toLevel(1) //Sunda Shelf mangroves
					.fromColour(207, 46, 191).toLevel(1) //Sundarbans freshwater swamp forests
					.fromColour(228, 114, 86).toLevel(1) //Sundarbans mangroves
					.go();

				wp.applyHeightMap(ecoRegionImage)
					.toWorld(world)
					.shift(shiftLongitute, shiftLatitude)
					.applyToLayer(mangroveLayer)
					.fromColour(67, 224, 200).toLevel(15) //Amazon-Orinoco-Southern Caribbean mangroves
					.fromColour(202, 66, 21).toLevel(15) //Bahamian-Antillean mangroves
					.fromColour(37, 37, 218).toLevel(15) //Central African mangroves
					.fromColour(18, 206, 55).toLevel(15) //East African mangroves
					.fromColour(76, 147, 239).toLevel(15) //Goadavari-Krishna mangroves
					.fromColour(210, 48, 69).toLevel(15) //Guianan freshwater swamp forests
					.fromColour(180, 83, 240).toLevel(15) //Guinean mangroves
					.fromColour(104, 108, 203).toLevel(15) //Gurupa varzeá
					.fromColour(188, 68, 212).toLevel(15) //Indochina mangroves
					.fromColour(133, 208, 86).toLevel(15) //Indus River Delta-Arabian Sea mangroves
					.fromColour(156, 206, 57).toLevel(15) //Madagascar mangroves
					.fromColour(207, 208, 122).toLevel(15) //Mesoamerican Gulf-Caribbean mangroves
					.fromColour(118, 201, 149).toLevel(15) //Myanmar Coast mangroves
					.fromColour(41, 212, 175).toLevel(15) //New Guinea mangroves
					.fromColour(47, 33, 239).toLevel(15) //Northern Mesoamerican Pacific mangroves
					.fromColour(148, 74, 239).toLevel(15) //Orinoco Delta swamp forests
					.fromColour(92, 75, 203).toLevel(15) //South American Pacific mangroves
					.fromColour(58, 92, 207).toLevel(15) //Southern Atlantic mangroves
					.fromColour(97, 149, 220).toLevel(15) //Southern Mesoamerican Pacific mangroves
					.fromColour(175, 118, 239).toLevel(15) //Sunda Shelf mangroves
					.fromColour(207, 46, 191).toLevel(15) //Sundarbans freshwater swamp forests
					.fromColour(228, 114, 86).toLevel(15) //Sundarbans mangroves
					.go();

			}

			if (settingsMapVersion === "1-20") {

				wp.applyHeightMap(ecoRegionImage)
					.toWorld(world)
					.shift(shiftLongitute, shiftLatitude)
					.applyToLayer(cherryBlossumTreesLayer)
					.fromColour(61, 167, 238).toLevel(15)
					.fromColour(206, 145, 65).toLevel(15)
					.fromColour(146, 66, 217).toLevel(15)
					.go();

			}

		}

	}

	//temporary layers for filtering mixed vegetation
	wp.applyHeightMap(climateImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(plainsLayer)
		.fromColour(255, 255, 0).toLevel(1) //Csa - plains FFFF00
		.fromColour(200, 200, 0).toLevel(1) //Csb - plains C8C800
		.fromColour(150, 255, 150).toLevel(1) //Cwa - plains 96FF96
		.fromColour(100, 200, 100).toLevel(1) //Cwb - plains 64C864
		.fromColour(50, 150, 50).toLevel(1) //Cwc - plains 329632
		.fromColour(200, 255, 80).toLevel(1) //Cfa - plains C8FF50
		.fromColour(100, 255, 80).toLevel(1) //Cfb - plains 64FF50
		.fromColour(50, 200, 0).toLevel(1) //Cfc - plains 32C800
		.fromColour(0, 255, 255).toLevel(1) //Dfa - plains 00FFFF
		.fromColour(55, 200, 255).toLevel(1) //Dfb - plains 37C8FF
		.go();

	wp.applyHeightMap(climateImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(desertLayer)
		.fromColour(255, 0, 0).toLevel(1) //BWh - desert FF0000
		.fromColour(255, 150, 150).toLevel(1) //BWk - desert FF9696
		.fromColour(255, 220, 100).toLevel(1) //BSk - desert FFDC64
		.go();

	wp.applyHeightMap(climateImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(acaciaLayer)
		.fromColour(0, 120, 255).toLevel(1) //Am - jungle_edge 0078FF
		.fromColour(70, 170, 250).toLevel(1) //Aw - savannah 46AAFA
		.fromColour(245, 165, 0).toLevel(1) //BSh - savannah F5A500
		.go();

	wp.applyHeightMap(climateImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(tundraLayer)
		.fromColour(255, 0, 255).toLevel(1) //Dsa - taiga FF00FF
		.fromColour(200, 0, 200).toLevel(1) //Dsb - taiga C800C8
		.fromColour(150, 50, 150).toLevel(1) //Dsc - taiga 963296
		.fromColour(150, 100, 150).toLevel(1) //Dsd - taiga 966496
		.fromColour(170, 175, 255).toLevel(1) //Dwa - taiga AAAFFF
		.fromColour(90, 120, 220).toLevel(1) //Dwb - taiga 5A78DC
		.fromColour(75, 80, 180).toLevel(1) //Dwc - taiga 4B50B4
		.fromColour(50, 0, 135).toLevel(1) //Dwd - taiga 320087
		.fromColour(0, 125, 125).toLevel(1) //Dfc - taiga 007D7D
		.fromColour(0, 70, 95).toLevel(1) //Dfd - taiga 00465F
		.fromColour(178, 178, 178).toLevel(1) //ET - snowy_tundra B2B2B2
		.fromColour(102, 102, 102).toLevel(1) //EF - snowy_tundra 666666
		.go();

	wp.applyHeightMap(climateImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(jungleLayer)
		.fromColour(0, 0, 255).toLevel(1) //Af - jungle 0000FF 
		.fromColour(0, 120, 255).toLevel(1) //Am - jungle_edge 0078FF
		.go();

	//base oceans

	wp.applyHeightMap(bathymetryImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(biomesLayer)
		.fromLevels(234, 254).toLevel(BIOME_OCEAN) //oceanBiome
		.fromLevels(0, 234).toLevel(BIOME_DEEP_OCEAN) //deepOceanBiome
		.go();

	wp.applyHeightMap(bathymetryImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(oceanLayer)
		.fromLevels(234, 254).toLevel(15) //oceanLayer
		.go();

	wp.applyHeightMap(bathymetryImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(deepOceanLayer)
		.fromLevels(0, 234).toLevel(15) //deepOceanLayer
		.go();

	print("biomes created");

}
