//shift calculations
if (true) {

	//filename calculation
	var tile = "";
	if (latitude > 9) {
		tile = tile.concat(directionLatitude + latitude);
	} else {
		tile = tile.concat(directionLatitude + "0" + latitude);
	}

	if (longitute > 99) {
		tile = tile.concat(directionLongitute + longitute);
	} else if (longitute > 9) {
		tile = tile.concat(directionLongitute + "0" + longitute);
	} else {
		tile = tile.concat(directionLongitute + "00" + longitute);
	}
	//end filename calculation

	//offset calculation
	var shiftLatitude = 0;
	if (directionLatitude === "N") {
		var shiftLatitude = (((latitude - tilesPerMap + 1) * scale * -1) / tilesPerMap) - scale;
	} else if (directionLatitude === "S") {
		var shiftLatitude = (((latitude + tilesPerMap - 1) * scale) / tilesPerMap) - scale;
	}
	var shiftLongitute = 0;
	if (directionLongitute === "E") {
		var shiftLongitute = longitute * scale / tilesPerMap;
	} else if (directionLongitute === "W") {
		var shiftLongitute = longitute * scale * -1 / tilesPerMap;
	}

	shiftLongitute = shiftLongitute + (settingsMapOffset * scale * 360 / tilesPerMap);

}

