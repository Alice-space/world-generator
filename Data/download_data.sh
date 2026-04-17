#!/usr/bin/env bash
# download_data.sh — 下载 world-generator 所需的大型数据文件
#
# 数据托管于 HuggingFace: https://huggingface.co/datasets/Alice-space/world-generator-data
# 包含 4 个 QGIS 项目目录（因文件过大无法纳入 git）：
#   - qgis-project    (~28 GB)
#   - qgis-bathymetry (~16 GB)
#   - qgis-terrain    (~45 GB)
#   - qgis-heightmap  (~163 GB)
#
# 用法:
#   bash Data/download_data.sh              # 下载全部（QGIS + OSM PBF）
#   bash Data/download_data.sh --skip-osm  # 仅下载 QGIS 项目文件
#   bash Data/download_data.sh --skip-qgis # 仅下载 OSM PBF
#
# 环境变量:
#   HF_TOKEN    — HuggingFace API token（私有 repo 时必须）
#   HF_ENDPOINT — 镜像站点（如 https://hf-mirror.com），默认 https://huggingface.co

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HF_REPO="Alice-space/world-generator-data"
HF_ENDPOINT="${HF_ENDPOINT:-https://huggingface.co}"
HF_TOKEN="${HF_TOKEN:-}"
SKIP_QGIS=false
SKIP_OSM=false

# 颜色输出
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }

# 解析参数
for arg in "$@"; do
  case $arg in
    --skip-qgis)  SKIP_QGIS=true ;;
    --skip-osm)   SKIP_OSM=true  ;;
    --hf-token=*) HF_TOKEN="${arg#*=}" ;;
    *) warn "Unknown argument: $arg" ;;
  esac
done

# 下载 QGIS 项目文件（来自 HuggingFace dataset）
download_qgis() {
  info "下载 QGIS 项目文件（总计约 252 GB）..."
  info "来源: https://huggingface.co/datasets/${HF_REPO}"

  if command -v huggingface-cli &>/dev/null; then
    local token_args=()
    [[ -n "$HF_TOKEN" ]] && token_args=(--token "$HF_TOKEN")

    # huggingface-cli 使用 HF_ENDPOINT 环境变量
    export HF_ENDPOINT

    info "使用 huggingface-cli 下载..."
    huggingface-cli download "$HF_REPO" \
      --repo-type dataset \
      --local-dir "$SCRIPT_DIR" \
      "${token_args[@]}" \
      --include "qgis-project/**" "qgis-bathymetry/**" "qgis-terrain/**" "qgis-heightmap/**"

  elif python3 -c "import huggingface_hub" 2>/dev/null; then
    info "使用 Python huggingface_hub 下载..."
    local token_arg=""
    [[ -n "$HF_TOKEN" ]] && token_arg=", token='${HF_TOKEN}'"
    python3 - <<PYEOF
import os
from huggingface_hub import snapshot_download
os.environ.setdefault("HF_ENDPOINT", "${HF_ENDPOINT}")
snapshot_download(
    repo_id="${HF_REPO}",
    repo_type="dataset",
    local_dir="${SCRIPT_DIR}",
    allow_patterns=["qgis-project/**", "qgis-bathymetry/**", "qgis-terrain/**", "qgis-heightmap/**"],
    ${token_arg}
)
PYEOF

  else
    error "未找到 huggingface-cli 或 huggingface_hub 库。"
    error "请先安装: pip install huggingface_hub"
    error ""
    error "如果网络受限，可使用镜像站点："
    error "  export HF_ENDPOINT=https://hf-mirror.com"
    error "  bash Data/download_data.sh"
    exit 1
  fi

  info "QGIS 项目文件下载完成"
}

# 下载 OSM PBF（调用现有的 download.sh）
download_osm() {
  local osm_script="$SCRIPT_DIR/download.sh"
  if [[ -f "$osm_script" ]]; then
    info "使用 download.sh 下载 OSM PBF..."
    bash "$osm_script"
  else
    warn "未找到 $osm_script，跳过 OSM PBF 下载"
    info "推荐来源: https://download.geofabrik.de/ 或 https://planet.openstreetmap.org/"
    info "请手动将 PBF 文件放置到 Data/ 目录"
  fi
}

# 主流程
echo "============================================================"
echo "  world-generator 数据下载工具"
echo "  HF Endpoint: ${HF_ENDPOINT}"
echo "  本地目录:    ${SCRIPT_DIR}"
echo "============================================================"

[[ "$SKIP_QGIS" == "false" ]] && download_qgis
[[ "$SKIP_OSM"  == "false" ]] && download_osm

echo ""
info "数据下载完成"
