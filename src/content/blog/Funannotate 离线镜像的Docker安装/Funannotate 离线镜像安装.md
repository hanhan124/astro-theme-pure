---
title: Funannotate 离线镜像的Docker安装
publishDate: 2025-09-14
description: '离线服务器一次性装好 Funannotate 的完整流程：下载、加载、修兼容、跑测试。'
tags:
  - Funannotate
  - Docker
  - 基因组注释
heroImage:
  src: ./thumbnail.jpg
  color: "#64574D"
language: 中文
---
## 0. 场景
- 服务器 **无法直连 Docker Hub**  
- 系统 **Docker 版本老旧**（18.x 及以下），不支持 `--mount` 语法  
- 需要 **一次性离线部署** Funannotate 1.8.x 并验证可用

---

## 1. 获取离线镜像

| 工具  | 作用  |
|---|---|
| `dget` | 断点续传 Docker Hub 镜像，无需 docker pull |

```bash
# ① 下载 dget（linux/amd64）
wget -c https://gitee.com/mirrors/dget/releases/download/v0.3/dget_linux_amd64 -O dget
chmod +x dget

# ② 断点续拉（失败重复执行即可）
./dget nextgenusfs/funannotate
# 完成后得到 funannotate_latest-img.tar.gz
```

---

## 2. 加载镜像

```bash
docker load -i funannotate_latest-img.tar.gz
docker images | grep funannotate
# 预期
# nextgenusfs/funannotate   latest   bcde41375f71   7 weeks ago   12.6 GB
```

---

## 3. 修复「unknown flag: --mount」兼容脚本

旧版 Docker 不认 `--mount`，官方 wrapper 会报错。直接替换为 `-v` 版本：

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
TZ="$(date +'%Z')"

docker run --rm -it \
  --user "${USER}" \
  -e TZ="${TZ}" \
  --workdir "${WORKDIR}" \
  -v "${WORKDIR}:${WORKDIR}" \
  nextgenusfs/funannotate:latest \
  funannotate "$@"
EOF

chmod +x funannotate-docker
mkdir -p ~/.local/bin
mv funannotate-docker ~/.local/bin/   # 确保目录在 $PATH
```

---

## 4. 验证：跑官方测试

```bash
funannotate-docker test -t predict --cpus 12
```

出现

```
#########################################################
SUCCESS: `funannotate predict` test complete.
#########################################################
```

即 **安装成功**，可投入正式分析。

---

## 5. 常用命令速查

| 任务 | 命令 |
|---|---|
| 查看帮助 | `funannotate-docker` |
| 预测基因 | `funannotate-docker predict -i genome.fa -o out -s "Aspergillus nidulans"` |
| 功能注释 | `funannotate-docker annotate -i out` |
| 比较基因组 | `funannotate-docker compare -i out1 out2 out3` |

---

## 6. 常见问题

1. **加载镜像失败**  
   → 确认 `funannotate_latest-img.tar.gz` 完整（`gzip -t` 无报错）。

2. **wrapper 执行无权限**  
   → `chmod +x` 并检查 `~/.local/bin` 是否已加入 `PATH`。

3. **测试时提示数据库缺失**  
   → 首次使用执行  
   `funannotate-docker setup -b all`  
   若服务器仍无法联网，参考[官方手动下载数据库](https://funannotate.readthedocs.io/en/latest/databases.html#manual-install)。

---

> 至此，离线环境即可完整使用 Funannotate 全部功能。
```