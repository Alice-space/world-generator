# World Generator

A Minecraft world generator inspired by [Minecraft Earth Map](https://earth.motfe.net/) that runs in parallel for improved performance.

**中文安装指南** | [Chinese Installation Guide](README.zh.md)

## Table of Contents

- [Direct Installation Guide](#direct-installation-guide)
- [Docker Installation (Recommended)](#docker-installation-recommended)
- [Usage](#usage)
- [Processing Pipeline](#processing-pipeline)
- [Inputs & Outputs](#inputs--outputs)
- [Project Structure](#project-structure)
- [Configuration](#configuration)

## Direct Installation Guide

This guide provides step-by-step instructions to install all dependencies directly on your system without using Docker.

### Prerequisites

- Ubuntu-based Linux distribution (tested on Ubuntu 24.04 LTS)
- Root or sudo access
- Stable internet connection
- At least 8GB RAM (recommended 16GB+)
- 50GB+ free disk space

### Step 1: System Dependencies

Update your package manager and install essential build tools:

```bash
sudo apt update
sudo apt install -y git wget dpkg unzip axel gcc zlib1g-dev build-essential
```

### Step 2: Python Environment

Install Python 3 and development tools:

```bash
sudo apt install -y python3-dev python3-pip python3-setuptools python3-wheel python3-venv libssl-dev libffi-dev
```

### Step 3: Java Runtime

Install OpenJDK 21 and X11 dependencies:

```bash
sudo apt install -y openjdk-21-jdk xserver-xorg xorg xvfb cmake libboost-dev
```

### Step 4: Image Processing

Install ImageMagick and image processing libraries:

```bash
sudo apt install -y libpng-dev libjpeg-dev libtiff-dev imagemagick
```

### Step 5: QGIS Installation

Add QGIS repository and install QGIS:

```bash
sudo apt install -y gnupg software-properties-common
sudo wget -O /etc/apt/keyrings/qgis-archive-keyring.gpg https://download.qgis.org/downloads/qgis-archive-keyring.gpg

echo 'Types: deb deb-src' | sudo tee -a /etc/apt/sources.list.d/qgis.sources
echo 'URIs: https://qgis.org/debian' | sudo tee -a /etc/apt/sources.list.d/qgis.sources
echo "Suites: $(lsb_release -cs)" | sudo tee -a /etc/apt/sources.list.d/qgis.sources
echo 'Architectures: amd64' | sudo tee -a /etc/apt/sources.list.d/qgis.sources
echo 'Components: main' | sudo tee -a /etc/apt/sources.list.d/qgis.sources
echo 'Signed-By: /etc/apt/keyrings/qgis-archive-keyring.gpg' | sudo tee -a /etc/apt/sources.list.d/qgis.sources

sudo apt update
sudo apt install -y qgis qgis-plugin-grass
```

### Step 6: WorldPainter Installation

Download and install WorldPainter:

```bash
wget -O /tmp/worldpainter_2.26.1.deb https://www.worldpainter.net/files/worldpainter_2.26.1.deb
sudo dpkg -i /tmp/worldpainter_2.26.1.deb
rm /tmp/worldpainter_2.26.1.deb
mkdir -p ~/.local/share/worldpainter/
```

Configure WorldPainter memory settings:

```bash
sudo sed -i 's/# -Xmx512m/-Xmx6G/g' /opt/worldpainter/wpscript.vmoptions
```

### Step 7: Minutor Installation

Download and install Minutor map viewer:

```bash
sudo apt update
sudo apt install -y qtbase5-dev qtbase5-dev-tools libqt5widgets5 libqt5gui5 libqt5core5a
wget -O /tmp/Minutor.Ubuntu-22.04.zip https://github.com/mrkite/minutor/releases/download/2.21.0/Minutor.Ubuntu-22.04.zip
unzip /tmp/Minutor.Ubuntu-22.04.zip
chmod +x minutor
sudo mv minutor /usr/bin/
rm /tmp/Minutor.Ubuntu-22.04.zip
```

### Step 8: Python Dependencies

Create and activate a virtual environment, then install required Python packages:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -U pip setuptools wheel
pip install geopandas pebble pyyaml shapely
```

> Make sure to activate the virtual environment before running Python scripts, or invoke using the full path `venv/bin/python`.

### Step 9: GDAL / ogr2ogr

Install GDAL so that the `ogr2ogr` utility is available for shapefile conversion:

```bash
sudo apt install -y gdal-bin
```

### Step 10: osmium-tool (required)

Install the `osmium` CLI; `preprocess.py` shells out to `osmium tags-filter` for
multi-threaded layer extraction, so this step is mandatory:

```bash
sudo apt install -y osmium-tool
```

**Note**: This is not the Python package `osmium` (pyosmium). We rely on the
C++ `osmium` command-line tool executed via subprocess; make sure it is on your
`PATH` before running the generator.

### Step 11: ImageMagick Configuration

Remove restrictive ImageMagick policy:

```bash
sudo rm /etc/ImageMagick-6/policy.xml
```

### Step 12: Project Setup

Clone the repository and set up the workspace:

```bash
git clone <repository-url>
cd world-generator
mkdir -p workspace
```

Copy configuration files:

```bash
cp config.example.yaml config.yaml
# Edit config.yaml according to your needs
```

### Step 13: Configuration Files Setup

Create necessary configuration directories:

```bash
mkdir -p ~/.local/share/worldpainter/config
# Copy worldpainter config files if provided
```

## Docker Installation (Recommended)

For a containerized setup, use Docker:

### Prerequisites

- Docker installed on your system

### Quick Start

```bash
# Pull the pre-built image
docker pull alicespaceli/trumancrafts_builder:v0.0.3

# Run the container
docker run -idt --rm -v $(pwd):/workspace alicespaceli/trumancrafts_builder:v0.0.3
```

## Usage

### Data Preparation

1. Download required data files from [Tiles Installation Guide](https://earth.motfe.net/tiles-installation/)
2. Extract all data files to the `Data` folder; the following is an example structure after setup:

```plaintext
Data/
├── voidscript.js
├── worldpainter-script.zip
├── osm/(place .osm files under all/)
│   └── all/
├── qgis-bathymetry/
├── qgis-heightmap/
├── qgis-terrain/
├── qgis-project/
└── wpscript/
    ├── backups/
    ├── exports/
    ├── farm/
    ├── layer/
    ├── ocean/
    ├── ores/
    ├── roads/
    ├── schematics/
    ├── terrain/
    └── worldpainter_files/
```

3. Configure `config.yaml` according to your needs

### Running the Generator

For direct installation:

```bash
# Set system limits
ulimit -s unlimited
ulimit -n 100000

# Run with virtual display
xvfb-run python3 main.py > generator.log
```

For Docker installation:

```bash
# Container runs automatically, check logs
tail -f generator.log
```

### Monitoring Progress

Check the `generator.log` file for progress updates:

```bash
tail -f generator.log
```

## Processing Pipeline

The `world_generator` package splits the workload into two major stages that you
can run with `world-generator preprocess`, `world-generator tiles`, or the
default `world-generator run` command (installed via `pip` or invoked with
`python -m world_generator.cli`). Internally the pipeline is organized as
follows:

1. **Configuration & entry point** (`world_generator.cli`, `pipeline.py`):
   reads `config.yaml` (or `WORLD_GENERATOR_CONFIG`) into a typed
   `GeneratorConfig`, wires logging, and determines whether to run the full
   pipeline or individual stages.
2. **OSM preprocessing** (`preprocess.py`): orchestrates multiple `osmium
   tags-filter` CLI invocations (one per thematic layer) against the planet
   extract (`pbf_path`) and writes `.osm` files under `osm_folder_path/all/` in
   parallel. The optional `osm_switch` in the config lets you disable specific
   layers (e.g., aerodromes or rivers).
3. **Geometry fixing** (`ogr2ogr` + GeoPandas): converts each `.osm` layer into
   vector datasets (GeoPackage by default, or Shapefile if configured) via GDAL
   and applies `GeoSeries.make_valid()` cleanup so downstream QGIS/WorldPainter
   steps receive valid geometries.
4. **QGIS image exports** (`imageexport.py`): copies or symlinks the generated
   OSM files into the QGIS project folder (`tiles.copy_osm_files`), then calls
   QGIS in headless mode to export every selected layer tile-by-tile into
   `scripts_folder_path/image_exports/<TILE>/`.
5. **Heightmap resampling**: still in `imageexport.py`, `gdal_translate` crops
   `HQheightmap.tif` into 16-bit PNGs inside each tile's `heightmap/` directory
   so downstream tools have height data at `blocks_per_tile` resolution.
6. **Image post-processing** (`magick.py`): ImageMagick normalizes palettes,
   creates water masks, fills voids, and prepares reduced-color terrain assets
   that match the WorldPainter script expectations.
7. **WorldPainter automation** (`wpscript.py`): drives the `wpscript` CLI to
   combine the exported rasters with the WorldPainter template contained in
   `scripts_folder_path/wpscript/`, producing `.world` files and per-tile
   `region/` exports. Each tile also receives a quick-look render via Minutor.
8. **Packaging & overview** (`tiles.post_process_map`): merges the exported
   `region/` directories into the final Minecraft save folder
   `scripts_folder_path/<world_name>/region/`, then runs Minutor once more to
   draw `<world_name>.png` as an at-a-glance map.

## Inputs & Outputs

### Key inputs

| Input | Provided via | Notes |
| --- | --- | --- |
| `config.yaml` | Copy from `config.example.yaml` | Defines absolute paths for every dependency plus numeric knobs (`blocks_per_tile`, `degree_per_tile`, `threads`, etc.). |
| OpenStreetMap PBF (`pbf_path`) | Download from Geofabrik/planet | Raw geography source that is split per theme. |
| QGIS projects (`qgis_project_path`, `qgis_bathymetry_project_path`, `qgis_terrain_project_path`, `qgis_heightmap_project_path`) | Bundled separately in `Data/qgis-*` | Provide layer styling and layout definitions used during exports. |
| WorldPainter scripts (`scripts_folder_path/wpscript`, `wpscript.js`, `voidscript.js`, `worldpainter-script.zip`) | Download from the Minecraft Earth Map guide | Consumed by `wpscript` to build `.world` files; keep the directory structure intact. |
| Optional layer toggles (`osm_switch`, `rivers`) | `config.yaml` | Enable/disable generated shapefiles per theme and pick which river layer name to reference inside the QGIS project. |

### Generated artifacts

| Output | Location | Produced by |
| --- | --- | --- |
| Layer-specific `.osm` files | `osm_folder_path/all/*.osm` | `osmium tags-filter` pipeline |
| Geometry-fixed vector layers (GPKG by default) | `osm_folder_path/all/*.(gpkg|shp)` | `ogr2ogr` + GeoPandas |
| Per-tile rasters | `scripts_folder_path/image_exports/<TILE>/*` | `imageexport.export_image` |
| Heightmaps (16-bit) | `scripts_folder_path/image_exports/<TILE>/heightmap/<TILE>.png` | `gdal_translate` step in `imageexport.py` |
| ImageMagick intermediates | Same tile folders (`*_terrain_reduced_colors.png`, masks, etc.) | `magick.run_magick` |
| WorldPainter worlds | `scripts_folder_path/wpscript/worldpainter_files/<TILE>.world` | `wpscript.py` |
| Tile exports | `scripts_folder_path/wpscript/exports/<TILE>/region/*.mca` | WorldPainter + Minutor automation |
| Final Minecraft save | `scripts_folder_path/<world_name>/region/*.mca` | `tiles.post_process_map` |
| Preview render | `scripts_folder_path/<world_name>.png` | Final Minutor call |
| Logs | `generator.log` (or `--log-file`) | CLI logging configuration |

## Project Structure

```
.
├── Data/                         # External assets (OSM, QGIS projects, wpscript, etc.)
│   ├── osm/                      # Contains `all/` where preprocessed OSM/Shapefiles live
│   ├── qgis-bathymetry/
│   ├── qgis-heightmap/
│   ├── qgis-terrain/
│   ├── qgis-project/
│   ├── wpscript/                 # Provided by the WorldPainter script pack
│   ├── wpscript.js               # Automation entry point consumed by `wpscript`
│   └── voidscript.js, worldpainter-script.zip, etc.
├── Docker/                       # Container recipes (Dockerfile, compose examples)
├── src/
│   └── world_generator/
│       ├── cli.py                # CLI entry point (`world-generator` console script)
│       ├── pipeline.py           # High-level orchestrator for stages
│       ├── preprocess.py         # OSM splitting via osmium CLI + GDAL/GeoPandas fixes
│       ├── tiles.py              # Tile workflow driver (QGIS export → WorldPainter)
│       ├── imageexport.py        # Headless QGIS rendering helpers
│       ├── magick.py             # ImageMagick-based raster cleanup
│       ├── wpscript.py           # Calls the WorldPainter automation tool
│       ├── qgiscontroller.py     # Thin wrappers around QGIS / PyQt APIs
│       └── tools.py              # Shared helpers (tile naming)
├── config.example.yaml           # Copy to config.yaml and customize paths
├── pyproject.toml / requirements.txt # Python package + dependency metadata
├── run.sh                        # Convenience wrapper for bare-metal runs
├── README.md / README.zh.md      # Documentation (EN / 中文)
└── generator.log (runtime)       # Created automatically unless --log-file overrides
```

## Configuration

Edit `config.yaml` to customize (set `scripts_folder_path` if your scripts/data live outside `./Data`):

- `osm_folder_path`: Path to OSM data files
- `vector_driver`: Choose `GPKG` (default) to avoid the legacy Shapefile 2GB/254-char limits,
  or switch back to `ESRI Shapefile` if older tooling depends on `.shp` outputs.
- Processing parameters and output settings

For detailed configuration options, see the example configuration file.

### River Layer Options

Set the `rivers` field in `config.yaml` to control which QGIS layer is exported into WorldPainter:
- `rivers_small`: High-detail layer that keeps tributaries; best for zoomed-in or large worlds.
- `rivers_medium`: Balanced density (default) that drops minor creeks while keeping secondary branches.
- `rivers_large`: Only the widest rivers for minimal clutter on small worlds or stylized maps.
- `MajorRiversMany`: Alternate Natural Earth–style dataset with extra branches compared to `rivers_large`.
- `MajorRiversFew`: The sparsest Natural Earth variant, keeping just continental-scale trunks.

## Troubleshooting

### Common Issues

1. **Permission denied errors**: Ensure you have proper file permissions
2. **Memory issues**: Increase Java heap size in WorldPainter configuration
3. **Display errors**: Make sure X11 forwarding is properly configured, or use `xvfb-run`
4. **Missing dependencies**: Re-run the installation steps for missing packages

### System Requirements

- **Minimum**: 8GB RAM, 4 CPU cores, 50GB storage
- **Recommended**: 16GB+ RAM, 8+ CPU cores, 100GB+ storage
- **OS**: Ubuntu 24.04 LTS (other Ubuntu-based distributions may require package name adjustments)
