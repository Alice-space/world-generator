# 世界生成器

一个受 [Minecraft Earth Map](https://earth.motfe.net/) 启发的 Minecraft 世界生成器，支持并行运行以提高性能。

**English Installation Guide** | [英文安装指南](README.md)

## 目录

- [直接安装指南](#直接安装指南)
- [Docker 安装（推荐）](#docker-安装推荐)
- [使用方法](#使用方法)
- [项目结构](#项目结构)
- [配置说明](#配置说明)

## 直接安装指南

本指南提供在不使用 Docker 的情况下，直接在系统上安装所有依赖项的分步说明。

### 系统要求

- 基于 Debian/Ubuntu 的 Linux 发行版（在 Debian Bookworm 上测试）
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
sudo mkdir -m755 -p /etc/apt/keyrings
sudo wget -O /etc/apt/keyrings/qgis-archive-keyring.gpg https://download.qgis.org/downloads/qgis-archive-keyring.gpg

echo 'Types: deb deb-src' | sudo tee -a /etc/apt/sources.list.d/qgis.sources
echo 'URIs: https://qgis.org/debian' | sudo tee -a /etc/apt/sources.list.d/qgis.sources
echo 'Suites: bookworm' | sudo tee -a /etc/apt/sources.list.d/qgis.sources
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
wget -O /tmp/Minutor.Ubuntu-22.04.zip https://github.com/mrkite/minutor/releases/download/2.21.0/Minutor.Ubuntu-22.04.zip
unzip /tmp/Minutor.Ubuntu-22.04.zip
chmod +x minutor
sudo mv minutor /usr/bin/
rm /tmp/Minutor.Ubuntu-22.04.zip
```

### 步骤 8：Python 依赖项

安装所需的 Python 包：

```bash
pip install osmium pebble pyyaml --break-system-packages
```

### 步骤 9：ImageMagick 配置

删除限制性的 ImageMagick 策略：

```bash
sudo rm /etc/ImageMagick-6/policy.xml
```

### 步骤 10：项目设置

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

### 步骤 11：配置文件设置

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

# 使用虚拟显示运行
xvfb-run python3 main.py > generator.log
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

## 项目结构

```
.
├── Data/                    # 数据目录
│   ├── voidscript.js
│   ├── worldpainter-script.zip
│   ├── wpscript/
│   ├── osm/                 # OSM 文件位置
│   │   └── all/
│   ├── qgis-bathymetry/     # 测深数据
│   ├── qgis-heightmap/      # 高度图数据
│   ├── qgis-terrain/        # 地形数据
│   ├── qgis-project/        # QGIS 项目文件
│   └── wpscript/            # WorldPainter 脚本
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
├── Docker/                  # Docker 配置
├── config.yaml              # 主配置文件
├── main.py                  # 主应用程序
├── generator.log            # 运行时日志
└── run.sh                   # 启动脚本
```

## 配置说明

编辑 `config.yaml` 进行自定义：

- `scripts_folder_path`: WorldPainter 脚本路径
- `osm_folder_path`: OSM 数据文件路径
- 处理参数和输出设置

有关详细的配置选项，请参阅示例配置文件。

## 故障排除

### 常见问题

1. **权限被拒绝错误**：确保您具有适当的文件权限
2. **内存问题**：增加 WorldPainter 配置中的 Java 堆大小
3. **显示错误**：确保 X11 转发配置正确
4. **缺少依赖项**：重新运行缺少软件包的安装步骤

### 系统要求

- **最低要求**：8GB 内存，4 个 CPU 核心，50GB 存储空间
- **推荐配置**：16GB+ 内存，8+ 个 CPU 核心，100GB+ 存储空间
- **操作系统**：Debian/Ubuntu Linux（其他发行版可能需要调整软件包名称）
