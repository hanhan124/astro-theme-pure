---
title: Funannotate 离线镜像安装笔记（Docker 版）
publishDate: 2025-09-14
description: Funannotate安装
tags:
  - Funannotate
  - 生信
heroImage:
  src: 
  color: "#64574D"
language: 中文
---

> Funannotate 是一个基因组预测、注释与比较软件包，最初为 30 Mb 级真菌基因组设计，现已支持更大基因组，同时提供轻量级比较基因组平台。  
> 通过 `funannotate annotate` 注释后的基因组可直接用 `funannotate compare` 生成 HTML 报告，支持同源聚类、系统发育树、GO 富集及 dN/dS 计算。  
> 官方文档：[Installation — Funannotate 1.8.16 documentation](https://funannotate.readthedocs.io/en/latest/)

---

## 1. 获取离线镜像（服务器无法直接 docker pull）

### 1.1 下载 dget 工具
```bash
wget https://gitee.com/mirrors/dget/releases/download/v0.3/dget_linux_amd64 -O dget
chmod +x dget
```

### 1.2 断点续拉镜像
```bash
./dget nextgenusfs/funannotate          # 网络中断后重复执行即可
# 最终得到 funannotate_latest-img.tar.gz
```

### 1.3 下载官方 wrapper 脚本
```bash
wget -O funannotate-docker https://raw.githubusercontent.com/nextgenusfs/funannotate/master/funannotate-docker
chmod 755 funannotate-docker
mkdir -p ~/.local/bin
ln -s $(pwd)/funannotate-docker ~/.local/bin/   # 确保已在 $PATH
```

---

## 2. 加载镜像
```bash
docker load -i funannotate_latest-img.tar.gz
docker images | grep funannotate
# 预期输出
# nextgenusfs/funannotate   latest   bcde41375f71   7 weeks ago   12.6 GB
```

---

## 3. 修复 `--mount` 不兼容旧版 Docker

旧版 Docker 不支持 `--mount` 语法，需将 `funannotate-docker` 替换为以下兼容脚本：

```bash
cat > funannotate-docker <<'EOF'
#!/usr/bin/env bash
realpath() {
  OURPWD=$PWD
  cd "$(dirname "$1")"
  LINK=$(readlink "$(basename "$1")")
  while [ "$LINK" ]; do
    cd "$(dirname "$LINK")"
    LINK=$(readlink "$(basename "$1")")
  done
  REALPATH="$PWD/$(basename "$1")"
  cd "$OURPWD"
  echo "$REALPATH"
}

USER="$(id -u $(logname)):$(id -g $(logname))"
WORKDIR="$(realpath .)"
MOUNT="-v ${WORKDIR}:${WORKDIR}"
TZ="$(date +'%Z')"

docker run --rm -it \
  --user "${USER}" \
  -e TZ="${TZ}" \
  --workdir "${WORKDIR}" \
  ${MOUNT} \
  nextgenusfs/funannotate:latest funannotate "$@"
EOF

chmod +x funannotate-docker
```

---

## 4. 验证安装
```bash
funannotate-docker test -t predict --cpus 12
```

若末尾出现：

```
#########################################################
SUCCESS: `funannotate predict` test complete.
#########################################################
```

即表示安装成功，可开始正式分析。
```