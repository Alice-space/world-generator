//export
if (true) {

	//and export the world (skip .world save — it's immediately deleted by the pipeline)
	wp.exportWorld(world)
		.toDirectory(path + 'wpscript/exports')
		.go();

	world = null;
	print("world exported");

}
