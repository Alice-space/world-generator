//heightmap
if (true) {

	//load the correct platform Format from the existing *.world files for the heightmap import
	var platformTemplate = loadWorldTemplate(resolvePlatformWorld(verticalScale, tilesPerMap));
	var platformMapFormat = platformTemplate.getPlatform();

	var heightMapImage = wp.getHeightMap().fromFile(path + 'image_exports/' + tile + '/heightmap/' + heightmapName + '.png').go();
	var world = createWorldForScale(verticalScale, {
		heightMap: heightMapImage,
		shiftLongitute: shiftLongitute,
		shiftLatitude: shiftLatitude,
		mapFormat: platformMapFormat
	});


	//load the correct GameTypes from the existing *.world files
	copyGameTypeFromTemplate(world, verticalScale, tilesPerMap);

	//var dimension = world.getDimension(0);
	//dimension.setMinecraftSeed(27594263);

	var bathymetryScale = getBathymetryScaleFor(verticalScale);

	//set water level to 1 (or lower build limit) on land, so it is possible to have land below Y=62
	Myimage = javax.imageio.ImageIO.read(new java.io.File(path + 'image_exports/' + tile + '/' + tile + '_bathymetry.png'));
	var dimension = world.getDimension(0);
	var raster = Myimage.getRaster();
	for (var x = 0; x < Myimage.getWidth(); x++) {
		for (var y = 0; y < Myimage.getHeight(); y++) {
			PixelColor = new java.awt.Color(Myimage.getRGB(x, y));
			if (PixelColor.getRed() === 255) {
				if (isVersionAtLeast("1-18")) {
					dimension.setWaterLevelAt(x + shiftLongitute, y + shiftLatitude, settingsLowerBuildLimit + 1);
				} else {
					dimension.setWaterLevelAt(x + shiftLongitute, y + shiftLatitude, 1);
				}
			} else {
				var height = raster.getSample(x, y, 0);
				var diff = Math.ceil((255 - height) * bathymetryScale);
				var newHeight = 255 - diff;
				if (isVersionAtLeast("1-18")) {
					dimension.setHeightAt(x + shiftLongitute, y + shiftLatitude, newHeight - 193);
				} else {
					if (newHeight - 193 <= settingsLowerBuildLimit + 1) {
						dimension.setHeightAt(x + shiftLongitute, y + shiftLatitude, settingsLowerBuildLimit + 1);
					} else {
						dimension.setHeightAt(x + shiftLongitute, y + shiftLatitude, newHeight - 193);
					}
				}
			}
		}
	}

	//bug in WorldPainter. The preference for layers are ignored, so remove the frost layer in this script. ??? still a bug in 2.10.10 ???
	wp.applyLayer(frostLayer)
		.toWorld(world)
		.toLevel(0)
		.go();

	if (isVersionAtLeast("1-18")) {
		var resizeWorld = org.pepsoft.worldpainter.util.WorldUtils.resizeWorld
		var transform = org.pepsoft.worldpainter.HeightTransform.IDENTITY
		resizeWorld(world, transform, settingsLowerBuildLimit, settingsUpperBuildLimit, true, null)
	}

	heightMapImage = null;
	print("heightmap created");
}
