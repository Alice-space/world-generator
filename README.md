# World Generator

A Minecraft world generator inspired by [Minecraft Earth Map](https://earth.motfe.net/) that runs in parallel for improved performance.

**中文安装指南** | [Chinese Installation Guide](README.zh.md)

## Table of Contents

- [Direct Installation Guide](#direct-installation-guide)
- [Docker Installation (Recommended)](#docker-installation-recommended)
- [Usage](#usage)
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

Install required Python packages:

```bash
pip install osmium pebble pyyaml --break-system-packages
```

### Step 9: ImageMagick Configuration

Remove restrictive ImageMagick policy:

```bash
sudo rm /etc/ImageMagick-6/policy.xml
```

### Step 10: Project Setup

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

### Step 11: Configuration Files Setup

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

## Project Structure

```
.
├── Data/                    # Data directory
│   ├── voidscript.js
│   ├── worldpainter-script.zip
│   ├── osm/                 # OSM files location
│   │   └── all/
│   ├── qgis-bathymetry/     # Bathymetry data
│   ├── qgis-heightmap/      # Heightmap data
│   ├── qgis-terrain/        # Terrain data
│   ├── qgis-project/        # QGIS project files
│   └── wpscript/            # WorldPainter scripts
│       ├── backups/
│       ├── exports/
│       ├── farm/
│       ├── layer/
│       ├── ocean/
│       ├── ores/
│       ├── roads/
│       ├── schematics/
│       ├── terrain/
│       └── worldpainter_files/
│   ├── Dockerfile           # Container image recipe
│   └── docker-compose.yml   # Optional compose file
├── config.yaml              # Main configuration file
-├── main.py                  # Main application
-├── generator.log            # Runtime logs
-└── run.sh                   # Startup script
└── workspace/               # Default working/output directory
    └── (tiles and outputs)
```

## Configuration

Edit `config.yaml` to customize:

- `scripts_folder_path`: Path to WorldPainter scripts
- `osm_folder_path`: Path to OSM data files
- Processing parameters and output settings

For detailed configuration options, see the example configuration file.

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
