# 世界生成器

一个受 [Minecraft Earth Map](https://earth.motfe.net/) 启发的 Minecraft 世界生成器，支持并行运行以提高性能。

**English Installation Guide** | [英文安装指南](README.md)

## 目录

- [直接安装指南](#直接安装指南)
- [Docker 安装（推荐）](#docker-安装推荐)
- [使用方法](#使用方法)
- [处理流程](#处理流程)
- [输入与输出](#输入与输出)
- [项目结构](#项目结构)
- [配置说明](#配置说明)

## 直接安装指南

本指南提供在不使用 Docker 的情况下，直接在系统上安装所有依赖项的分步说明。

### 系统要求

- 基于 Ubuntu 的 Linux 发行版（在 Ubuntu 24.04 LTS 上测试）
- Root 或 sudo 权限
- 稳定的互联网连接
- 至少 8GB 内存（推荐 16GB+）
- 50GB+ 可用磁盘空间

### 步骤 1：系统依赖项

更新软件包管理器并安装基本构建工具：

```bash
sudo apt update
sudo apt install -y git wget dpkg unzip axel gcc zlib1g-dev build-essential
```

### 步骤 2：Python 环境

安装 Python 3 和开发工具：

```bash
sudo apt install -y python3-dev python3-pip python3-setuptools python3-wheel python3-venv libssl-dev libffi-dev
```

### 步骤 3：Java 运行时

安装 OpenJDK 21 和 X11 依赖项：

```bash
sudo apt install -y openjdk-21-jdk xserver-xorg xorg xvfb cmake libboost-dev
```

### 步骤 4：图像处理

安装 ImageMagick 和图像处理库：

```bash
sudo apt install -y libpng-dev libjpeg-dev libtiff-dev imagemagick
```

### 步骤 5：QGIS 安装

添加 QGIS 仓库并安装 QGIS：

```bash
sudo apt install -y gnupg software-properties-common
# sudo mkdir -m755 -p /etc/apt/keyrings # no need now
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

### 步骤 6：WorldPainter 安装

下载并安装 WorldPainter：

```bash
wget -O /tmp/worldpainter_2.26.1.deb https://www.worldpainter.net/files/worldpainter_2.26.1.deb
sudo dpkg -i /tmp/worldpainter_2.26.1.deb
rm /tmp/worldpainter_2.26.1.deb
mkdir -p ~/.local/share/worldpainter/
```

配置 WorldPainter 内存设置：

```bash
sudo sed -i 's/# -Xmx512m/-Xmx6G/g' /opt/worldpainter/wpscript.vmoptions
```

### 步骤 7：Minutor 安装

下载并安装 Minutor 地图查看器：

```bash
sudo apt update
sudo apt install qtbase5-dev qtbase5-dev-tools libqt5widgets5 libqt5gui5 libqt5core5a
wget -O /tmp/Minutor.Ubuntu-22.04.zip https://github.com/mrkite/minutor/releases/download/2.21.0/Minutor.Ubuntu-22.04.zip
unzip /tmp/Minutor.Ubuntu-22.04.zip
chmod +x minutor
sudo mv minutor /usr/bin/
rm /tmp/Minutor.Ubuntu-22.04.zip
```

### 步骤 8：Python 依赖项

创建并激活虚拟环境，然后安装所需的 Python 包：

```bash
python3 -m venv venv
source venv/bin/activate
pip install -U pip setuptools wheel
pip install geopandas pebble pyyaml shapely
```

> 在后续步骤中如需运行 Python 脚本，请确保虚拟环境已激活。或使用 `venv/bin/python` 完整路径调用。

### 步骤 9：GDAL / ogr2ogr

安装 GDAL，使 `ogr2ogr` 可用于矢量格式转换：

```bash
sudo apt install -y gdal-bin
```

### 步骤 10：安装 osmium-tool（必需）

安装 `osmium` 命令行工具；`preprocess.py` 会调用 `osmium tags-filter`
完成多线程图层提取，因此此步骤为必选：

```bash
sudo apt install -y osmium-tool
```

**注意**：这不是 Python 包 `osmium`（pyosmium），而是独立的 C++
命令行工具。生成器直接通过子进程调用该 CLI，请确保它在 `PATH`
中可用。

### 步骤 11：ImageMagick 配置

删除限制性的 ImageMagick 策略：

```bash
sudo rm /etc/ImageMagick-6/policy.xml
```

### 步骤 12：项目设置

克隆仓库并设置工作区：

```bash
git clone <repository-url>
cd world-generator
mkdir -p workspace
```

复制配置文件：

```bash
cp config.example.yaml config.yaml
# 根据您的需求编辑 config.yaml
```

### 步骤 13：配置文件设置

创建必要的配置目录：

```bash
mkdir -p ~/.local/share/worldpainter/config
# 如果提供了 worldpainter 配置文件，请复制
```

## Docker 安装（推荐）

对于容器化设置，请使用 Docker：

### 前提条件

- 系统上已安装 Docker

### 快速开始

```bash
# 拉取预构建镜像
docker pull alicespaceli/trumancrafts_builder:v0.0.3

# 运行容器
docker run -idt --rm -v $(pwd):/workspace alicespaceli/trumancrafts_builder:v0.0.3
```

## 使用方法

### 数据准备

1. 从 [Tiles 安装指南](https://earth.motfe.net/tiles-installation/) 下载所需的数据文件
2. 将所有数据文件提取到 `Data` 文件夹
3. 根据您的需求配置 `config.yaml`

### 运行生成器

对于直接安装：

```bash
# 设置系统限制
ulimit -s unlimited
ulimit -n 100000

# 使用虚拟显示运行（如已激活虚拟环境）
xvfb-run python3 main.py > generator.log
```

若未激活虚拟环境，可使用虚拟环境中的 Python 解释器运行：

```bash
xvfb-run venv/bin/python main.py > generator.log
```

对于 Docker 安装：

```bash
# 容器自动运行，检查日志
tail -f generator.log
```

### 监控进度

检查 `generator.log` 文件以获取进度更新：

```bash
tail -f generator.log
```

## 处理流程

`world_generator` 包分成两个主要阶段，可通过 `world-generator preprocess`、`world-generator tiles` 或默认的 `world-generator run`（`pip` 安装后或 `python -m world_generator.cli`）来执行。内部管线如下：

1. **配置与入口**（`world_generator.cli`, `pipeline.py`）：读取 `config.yaml`（或 `WORLD_GENERATOR_CONFIG` 环境变量），构建类型安全的 `GeneratorConfig`，配置日志并决定运行整套流程还是单独阶段。
2. **OSM 预处理**（`preprocess.py`）：调度多个 `osmium tags-filter` CLI
   命令（每个图层一个）并行读取 `pbf_path`，输出到
   `osm_folder_path/all/*.osm`，`osm_switch` 可在配置里禁用特定图层。
3. **几何修复**（`ogr2ogr` + GeoPandas）：借助 GDAL 将 `.osm` 图层转换为矢量数据集（默认 GeoPackage，可按需改为 Shapefile），并使用 `GeoSeries.make_valid()` 清理几何，确保 QGIS/WorldPainter 可稳定读取。
4. **QGIS 影像导出**（`imageexport.py` 与 `tiles.copy_osm_files`）：将生成的 OSM 文件软链/复制到 QGIS 工程目录，然后在无头模式下为所有选定图层逐瓦片导出到 `scripts_folder_path/image_exports/<TILE>/`。
5. **高度图重采样**：仍在 `imageexport.py` 内，`gdal_translate` 将 `HQheightmap.tif` 切片为 16bit PNG，输出到各瓦片的 `heightmap/` 目录，分辨率由 `blocks_per_tile` 决定。
6. **图像后处理**（`magick.py`）：调用 ImageMagick 统一调色板、生成水体掩膜、填补空洞，并生成匹配 WorldPainter 模板的 `*_terrain_reduced_colors.png` 等资源。
7. **WorldPainter 自动化**（`wpscript.py`）：驱动 `wpscript` CLI，把导出的栅格与 `scripts_folder_path/wpscript/` 中的模板组合，产出 `.world` 文件和每瓦片的 `region/` 导出，同时用 Minutor 渲染快速预览。
8. **打包与概览**（`tiles.post_process_map`）：汇总所有瓦片的 `region/` 到最终世界目录 `scripts_folder_path/<world_name>/region/`，再用 Minutor 生成 `<world_name>.png` 总览图。

## 输入与输出

### 关键输入

| 输入 | 配置方式 | 说明 |
| --- | --- | --- |
| `config.yaml` | 复制 `config.example.yaml` 并填写绝对路径 | 定义所有依赖位置以及数值参数（`blocks_per_tile`、`degree_per_tile`、`threads` 等）。 |
| OpenStreetMap PBF (`pbf_path`) | 自行从 Geofabrik/planet 下载 | 原始地理数据，供预处理拆分。 |
| QGIS 工程 (`qgis_project_path`、`qgis_bathymetry_project_path`、`qgis_terrain_project_path`、`qgis_heightmap_project_path`) | `Data/qgis-*` 目录 | 包含样式与布局设置，为各类图层导出提供模板。 |
| WorldPainter 脚本集 (`scripts_folder_path/wpscript`、`wpscript.js`、`voidscript.js`、`worldpainter-script.zip`) | 参考 Minecraft Earth Map 指南下载 | `wpscript` 自动化运行所需的脚本与素材，目录结构需保持完整。 |
| 可选图层开关 (`osm_switch`、`rivers`) | `config.yaml` | 控制哪些 OSM 图层要输出，以及 QGIS 工程引用的河流图层名称。 |

### 生成产物

| 输出 | 位置 | 由谁生成 |
| --- | --- | --- |
| 按主题拆分的 `.osm` | `osm_folder_path/all/*.osm` | `osmium tags-filter` 流程 |
| 修复后的矢量文件（默认 `.gpkg`） | `osm_folder_path/all/*.(gpkg|shp)` | `ogr2ogr` + GeoPandas |
| 每瓦片的图层栅格 | `scripts_folder_path/image_exports/<TILE>/*` | `imageexport.export_image` |
| 16bit 高程图 | `scripts_folder_path/image_exports/<TILE>/heightmap/<TILE>.png` | `imageexport.py` 中的 `gdal_translate` 步骤 |
| ImageMagick 中间件 | 同瓦片目录（如 `*_terrain_reduced_colors.png`） | `magick.run_magick` |
| WorldPainter `.world` 文件 | `scripts_folder_path/wpscript/worldpainter_files/<TILE>.world` | `wpscript.py` |
| 瓦片导出文件 | `scripts_folder_path/wpscript/exports/<TILE>/region/*.mca` | WorldPainter + Minutor 自动化 |
| 最终 Minecraft 世界 | `scripts_folder_path/<world_name>/region/*.mca` | `tiles.post_process_map` |
| 总览渲染图 | `scripts_folder_path/<world_name>.png` | 最后一次 Minutor 调用 |
| 日志 | `generator.log`（或 `--log-file` 指定） | CLI 日志配置 |

## 项目结构

```
.
├── Data/                         # 外部资产（OSM、QGIS 工程、wpscript 等）
│   ├── osm/                      # 包含 `all/`，预处理输出位于此处
│   ├── qgis-bathymetry/
│   ├── qgis-heightmap/
│   ├── qgis-terrain/
│   ├── qgis-project/
│   ├── wpscript/                 # WorldPainter 脚本包提供的模板
│   ├── wpscript.js               # `wpscript` CLI 入口
│   └── voidscript.js、worldpainter-script.zip 等资源
├── Docker/                       # Dockerfile 与 compose 示例
├── src/
│   └── world_generator/
│       ├── cli.py                # CLI 入口（`world-generator` 指令）
│       ├── pipeline.py           # 流水线调度
│       ├── preprocess.py         # 调用 osmium CLI 进行 OSM 拆分 + GDAL/GeoPandas 几何修复
│       ├── tiles.py              # 瓦片工作流驱动（QGIS → WorldPainter）
│       ├── imageexport.py        # QGIS 影像导出工具
│       ├── magick.py             # ImageMagick 栅格处理
│       ├── wpscript.py           # WorldPainter 自动化调用
│       ├── qgiscontroller.py     # QGIS / PyQt 封装
│       └── tools.py              # 通用工具（瓦片编号等）
├── config.example.yaml           # 复制为 config.yaml 并按需修改
├── pyproject.toml / requirements.txt # Python 包与依赖声明
├── run.sh                        # 本地运行脚本
├── README.md / README.zh.md      # 文档（英文/中文）
└── generator.log                 # 默认日志文件，可用 --log-file 指定
```

## 配置说明

编辑 `config.yaml` 进行自定义（如脚本目录不在 `./Data`，可修改 `scripts_folder_path`）：

- `osm_folder_path`: OSM 数据文件路径
- `vector_driver`: 选择 `GPKG`（默认，避免 Shapefile 2GB/字段长度限制）或 `ESRI Shapefile`（需要兼容旧 `.shp` 工作流时使用）。
- 处理参数和输出设置

有关详细的配置选项，请参阅示例配置文件。

### 河流图层选项

在 `config.yaml` 中通过 `rivers` 字段选择要导出的 QGIS 图层：
- `rivers_small`：保留大量支流，细节最丰富，适合需要高精度的地图。
- `rivers_medium`：默认方案，去掉最细小的溪流但保留次级分支，兼顾细节与性能。
- `rivers_large`：仅保留最宽的河道，适合小世界或希望减少图层噪点的场景。
- `MajorRiversMany`：来自 Natural Earth 的河网版本，分支较多，风格不同于标准层。
- `MajorRiversFew`：同一数据集的精简版本，仅保留洲际主干河流。
