//filters
if (true) {

	var noWaterFilter = wp.createFilter()
		.exceptOnTerrain(37) // terrain=water for ocean and rivers
		.go();

	var noWaterFilterForRivers = wp.createFilter()
		.exceptOnTerrain(37) // terrain=water for ocean and rivers
		.belowDegrees(35)
		.go();

	var waterFilter = wp.createFilter()
		.onlyOnWater() // only on real ocean (no rivers or lakes
		.go();

	var oceanFilter = wp.createFilter()
		.onlyOnLayer(oceanLayer)
		.go();

	var oceanCoralFilter = wp.createFilter()
		.onlyOnLayer(oceanLayer)
		.belowLevel(58)
		.go();

	var noOceanFilter = wp.createFilter()
		.exceptOnLayer(oceanLayer)
		.go();

	var deepOceanFilter = wp.createFilter()
		.onlyOnLayer(deepOceanLayer)
		.go();

	var sandFilter = wp.createFilter()
		.onlyOnTerrain(5)
		.go();

	var water1deepFilter = wp.createFilter()
		.onlyOnLayer(water1deep)
		.go();

	var water2deepFilter = wp.createFilter()
		.onlyOnLayer(water2deep)
		.go();

	var water3deepFilter = wp.createFilter()
		.onlyOnLayer(water3deep)
		.go();

	var water4deepFilter = wp.createFilter()
		.onlyOnLayer(water4deep)
		.go();

	var water5deepFilter = wp.createFilter()
		.onlyOnLayer(water5deep)
		.go();

	var snowyFilter = wp.createFilter()
		.onlyOnTerrain(40)
		.go();

	var mesaFilter = wp.createFilter()
		.onlyOnTerrain(9)
		.go();

	var swampFilter = wp.createFilter()
		.onlyOnLayer(swampLayer)
		.go();

	var swampFilterBelowDegrees = wp.createFilter()
		.onlyOnLayer(swampLayer)
		.belowDegrees(35)
		.go();

}

