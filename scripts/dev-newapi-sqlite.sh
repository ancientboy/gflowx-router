#!/usr/bin/env bash
# 不依赖 Docker，在本机用 SQLite + 内置前端 dist 跑 new-api（开发验证）
# 用法：在仓库根目录执行  ./scripts/dev-newapi-sqlite.sh
# 默认端口 3000；另开终端可执行：/tmp/cloudflared tunnel --url http://127.0.0.1:3000
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BE="$ROOT/backend"
cd "$BE"
mkdir -p data logs

if [ ! -f web/default/dist/index.html ]; then
  echo "[dev-newapi] 构建 default 前端..."
  (cd web/default && npm install && npm run build)
fi

if [ ! -f web/classic/dist/index.html ]; then
  echo "[dev-newapi] classic 前端未构建：暂用 default 的 dist 满足 Go embed（仅开发用）。"
  rm -rf web/classic/dist
  cp -a web/default/dist web/classic/dist
fi

export SQLITE_PATH="$BE/data/one-api.db?_busy_timeout=30000"
unset SQL_DSN REDIS_CONN_STRING
export MEMORY_CACHE_ENABLED=true
export GIN_MODE="${GIN_MODE:-debug}"

echo "[dev-newapi] 启动 http://127.0.0.1:${PORT:-3000}/ （首次需在 Web 向导完成初始化）"
exec go run . --port "${PORT:-3000}" --log-dir "$BE/logs"
