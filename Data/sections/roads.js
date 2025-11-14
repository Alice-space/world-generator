//roads
if (true) {

	if (settingsHighways === "True") {

		//highway and big road
		heightMap(road)
			.withFilter(noWaterFilter)
			.applyToLayer(bigRoadLayer)
			.fromColour(200, 200, 200).toLevel(1)
			.go();

		//replace with bridges over water

		heightMap(road)
			.withFilter(water1deepFilter)
			.applyToLayer(bigRoadBridge1Layer)
			.fromColour(200, 200, 200).toLevel(1)
			.go();

		heightMap(road)
			.withFilter(water2deepFilter)
			.applyToLayer(bigRoadBridge1Layer)
			.fromColour(200, 200, 200).toLevel(1)
			.go();

		heightMap(road)
			.withFilter(water3deepFilter)
			.applyToLayer(bigRoadBridge2Layer)
			.fromColour(200, 200, 200).toLevel(1)
			.go();

		heightMap(road)
			.withFilter(water4deepFilter)
			.applyToLayer(bigRoadBridge2Layer)
			.fromColour(200, 200, 200).toLevel(1)
			.go();

		heightMap(road)
			.withFilter(water5deepFilter)
			.applyToLayer(bigRoadBridge3Layer)
			.fromColour(200, 200, 200).toLevel(1)
			.go();

	}

	if (settingsStreets === "True") {

		//middle_road
		heightMap(road)
			.applyToLayer(middleRoadLayer)
			.fromColour(0, 0, 0).toLevel(1)
			.go();

		//replace with bridges over water

		heightMap(road)
			.withFilter(water1deepFilter)
			.applyToLayer(middleRoadBridge1Layer)
			.fromColour(0, 0, 0).toLevel(1)
			.go();

		heightMap(road)
			.withFilter(water2deepFilter)
			.applyToLayer(middleRoadBridge1Layer)
			.fromColour(0, 0, 0).toLevel(1)
			.go();

		heightMap(road)
			.withFilter(water3deepFilter)
			.applyToLayer(middleRoadBridge2Layer)
			.fromColour(0, 0, 0).toLevel(1)
			.go();

		heightMap(road)
			.withFilter(water4deepFilter)
			.applyToLayer(middleRoadBridge2Layer)
			.fromColour(0, 0, 0).toLevel(1)
			.go();

		heightMap(road)
			.withFilter(water5deepFilter)
			.applyToLayer(middleRoadBridge3Layer)
			.fromColour(0, 0, 0).toLevel(1)
			.go();

	}

	if (settingsSmallStreets === "True") {
		//small_road
		heightMap(road)
			.withFilter(noWaterFilter)
			.applyToLayer(middleRoadLayer)
			.fromColour(0, 0, 255).toLevel(1)
			.go();

		//remove on wetland and swamp
		heightMap(wetImage)
			.applyToLayer(middleRoadLayer)
			.fromColour(0, 127, 127).toLevel(0) //remove on wetland
			.go();
	}

	print("roads created");
}

