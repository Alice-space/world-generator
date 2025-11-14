//export
if (true) {

	//last but not least, save the world
	wp.saveWorld(world)
		.toFile(path + 'wpscript/worldpainter_files/' + tile + '.world')
		.go();

	print("*.world file saved");

	//and export the world
	wp.exportWorld(world)
		.toDirectory(path + 'wpscript/exports')
		.go();

	world = null;
	print("world exported");

}
