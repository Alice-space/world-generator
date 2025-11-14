//remove temporary layers for filtering mixed vegetation
if (true) {

	wp.applyHeightMap(climateImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(plainsLayer)
		.fromColour(255, 255, 0).toLevel(0) //Csa - plains FFFF00
		.fromColour(200, 200, 0).toLevel(0) //Csb - plains C8C800
		.fromColour(150, 255, 150).toLevel(0) //Cwa - plains 96FF96
		.fromColour(100, 200, 100).toLevel(0) //Cwb - plains 64C864
		.fromColour(50, 150, 50).toLevel(0) //Cwc - plains 329632
		.fromColour(200, 255, 80).toLevel(0) //Cfa - plains C8FF50
		.fromColour(100, 255, 80).toLevel(0) //Cfb - plains 64FF50
		.fromColour(50, 200, 0).toLevel(0) //Cfc - plains 32C800
		.fromColour(0, 255, 255).toLevel(0) //Dfa - plains 00FFFF
		.fromColour(55, 200, 255).toLevel(0) //Dfb - plains 37C8FF
		.go();

	wp.applyHeightMap(climateImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(desertLayer)
		.fromColour(255, 0, 0).toLevel(0) //BWh - desert FF0000
		.fromColour(255, 150, 150).toLevel(0) //BWk - desert FF9696
		.fromColour(255, 220, 100).toLevel(0) //BSk - desert FFDC64
		.go();

	wp.applyHeightMap(climateImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(acaciaLayer)
		.fromColour(0, 0, 255).toLevel(0) //Af - jungle 0000FF 
		.fromColour(0, 120, 255).toLevel(0) //Am - jungle_edge 0078FF
		.fromColour(70, 170, 250).toLevel(0) //Aw - savannah 46AAFA
		.fromColour(245, 165, 0).toLevel(0) //BSh - savannah F5A500
		.go();

	wp.applyHeightMap(climateImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(tundraLayer)
		.fromColour(255, 0, 255).toLevel(0) //Dsa - taiga FF00FF
		.fromColour(200, 0, 200).toLevel(0) //Dsb - taiga C800C8
		.fromColour(150, 50, 150).toLevel(0) //Dsc - taiga 963296
		.fromColour(150, 100, 150).toLevel(0) //Dsd - taiga 966496
		.fromColour(170, 175, 255).toLevel(0) //Dwa - taiga AAAFFF
		.fromColour(90, 120, 220).toLevel(0) //Dwb - taiga 5A78DC
		.fromColour(75, 80, 180).toLevel(0) //Dwc - taiga 4B50B4
		.fromColour(50, 0, 135).toLevel(0) //Dwd - taiga 320087
		.fromColour(0, 125, 125).toLevel(0) //Dfc - taiga 007D7D
		.fromColour(0, 70, 95).toLevel(0) //Dfd - taiga 00465F
		.fromColour(178, 178, 178).toLevel(0) //ET - snowy_tundra B2B2B2
		.fromColour(102, 102, 102).toLevel(0) //EF - snowy_tundra 666666
		.go();

	wp.applyHeightMap(climateImage)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.applyToLayer(jungleLayer)
		.fromColour(0, 0, 255).toLevel(0) //Af - jungle 0000FF 
		.fromColour(0, 120, 255).toLevel(0) //Am - jungle_edge 0078FF
		.go();

}

