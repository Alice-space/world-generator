//delete duplicate XdeepWater layers
if (true) {

	wp.applyLayer(water1deep)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(water5deepFilter)
		.toLevel(0)
		.go();
	wp.applyLayer(water2deep)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(water5deepFilter)
		.toLevel(0)
		.go();
	wp.applyLayer(water3deep)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(water5deepFilter)
		.toLevel(0)
		.go();
	wp.applyLayer(water4deep)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(water5deepFilter)
		.toLevel(0)
		.go();

	wp.applyLayer(water1deep)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(water4deepFilter)
		.toLevel(0)
		.go();
	wp.applyLayer(water2deep)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(water4deepFilter)
		.toLevel(0)
		.go();
	wp.applyLayer(water3deep)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(water4deepFilter)
		.toLevel(0)
		.go();

	wp.applyLayer(water1deep)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(water3deepFilter)
		.toLevel(0)
		.go();
	wp.applyLayer(water2deep)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(water3deepFilter)
		.toLevel(0)
		.go();

	wp.applyLayer(water1deep)
		.toWorld(world)
		.shift(shiftLongitute, shiftLatitude)
		.withFilter(water2deepFilter)
		.toLevel(0)
		.go();

}

