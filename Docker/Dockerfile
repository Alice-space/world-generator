FROM ubuntu:24.04

ARG WORLDPAINTER_VERSION=2.26.1
ARG INSTALL_MINUTOR=true
ARG ENABLE_TUNA_MIRROR=false

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Optional: switch to TUNA mirror for faster downloads in China
RUN if [ "${ENABLE_TUNA_MIRROR}" = "true" ]; then \
        printf '%s\n' \
            "Types: deb" \
            "URIs: http://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports" \
            "Suites: noble noble-updates noble-backports" \
            "Components: main restricted universe multiverse" \
            "Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg" \
            "" \
            "Types: deb" \
            "URIs: http://ports.ubuntu.com/ubuntu-ports/" \
            "Suites: noble-security" \
            "Components: main restricted universe multiverse" \
            "Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg" \
        > /etc/apt/sources.list.d/ubuntu.sources; \
    fi

# Base system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        axel \
        build-essential \
        cmake \
        dpkg \
        gcc \
        git \
        gnupg \
        libbz2-dev \
        libexpat1-dev \
        libffi-dev \
        libjpeg-dev \
        libpng-dev \
        libssl-dev \
        libtiff-dev \
        libboost-dev \
        openjdk-21-jdk \
        python3-dev \
        python3-pip \
        python3-setuptools \
        python3-venv \
        python3-wheel \
        unzip \
        wget \
        xorg \
        xserver-xorg \
        xvfb \
        zlib1g-dev \
        imagemagick \
        software-properties-common \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# QGIS repository and packages
RUN mkdir -p /etc/apt/keyrings \
    && wget -O /etc/apt/keyrings/qgis-archive-keyring.gpg https://download.qgis.org/downloads/qgis-archive-keyring.gpg \
    && . /etc/os-release \
    && { \
        echo "Types: deb deb-src"; \
        echo "URIs: https://qgis.org/debian"; \
        echo "Suites: ${VERSION_CODENAME}"; \
        echo "Architectures: $(dpkg --print-architecture)"; \
        echo "Components: main"; \
        echo "Signed-By: /etc/apt/keyrings/qgis-archive-keyring.gpg"; \
    } > /etc/apt/sources.list.d/qgis.sources \
    && apt-get update \
    && apt-get install -y --no-install-recommends qgis qgis-plugin-grass \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# WorldPainter and optional Minutor
RUN wget -O /tmp/worldpainter_${WORLDPAINTER_VERSION}.deb https://www.worldpainter.net/files/worldpainter_${WORLDPAINTER_VERSION}.deb \
    && dpkg -i /tmp/worldpainter_${WORLDPAINTER_VERSION}.deb \
    && rm /tmp/worldpainter_${WORLDPAINTER_VERSION}.deb \
    && mkdir -p /root/.local/share/worldpainter/ \
    && sed -i 's/# -Xmx512m/-Xmx6G/g' /opt/worldpainter/wpscript.vmoptions \
    && if [ "${INSTALL_MINUTOR}" = "true" ]; then \
        tmpdir=$(mktemp -d); \
        wget -O "${tmpdir}/Minutor.Ubuntu-22.04.zip" https://github.com/mrkite/minutor/releases/download/2.20.0/Minutor.Ubuntu-22.04.zip; \
        unzip "${tmpdir}/Minutor.Ubuntu-22.04.zip" -d "${tmpdir}"; \
        chmod +x "${tmpdir}/minutor"; \
        mv "${tmpdir}/minutor" /usr/local/bin/minutor; \
        rm -rf "${tmpdir}"; \
    fi

COPY requirements.txt /tmp/requirements.txt

RUN if [ "${ENABLE_TUNA_MIRROR}" = "true" ]; then \
        export PIP_INDEX_URL=https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple; \
    fi; \
    pip install --break-system-packages --no-cache-dir --ignore-installed -r /tmp/requirements.txt \
    && rm -rf /root/.cache/pip /tmp/requirements.txt

RUN mkdir -p /workspace

# COPY config /root/.local/share/worldpainter/config

WORKDIR /workspace

# start interactive shell by default
CMD ["/bin/bash"]
