#!/usr/bin/env bash
# 启动官方 new-api 底座（PostgreSQL + Redis + 预构建镜像）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/backend"
exec docker compose up -d "$@"
