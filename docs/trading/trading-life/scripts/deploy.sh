#!/usr/bin/env bash
# 部署交易人生静态资源到 204 服务器
# 用法: ./scripts/deploy.sh [user@host]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="${1:-root@43.98.167.204}"
REMOTE_DIR="/opt/trading-agent/dashboard/static/life"

echo "==> 构建..."
cd "$ROOT"
npm run build

echo "==> 上传到 $REMOTE:$REMOTE_DIR"
ssh "$REMOTE" "mkdir -p '$REMOTE_DIR'"
rsync -avz --delete "$ROOT/dist/" "$REMOTE:$REMOTE_DIR/"

echo "==> 完成: http://43.98.167.204/trading/life/"
