#!/usr/bin/env bash
# 从 cloudflared 容器日志中提取 Quick Tunnel 公网 URL（需已用 tunnel profile 启动）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
COMPOSE=(docker compose -f docker-compose.yml -f docker-compose.tunnel.yml)
if ! "${COMPOSE[@]}" logs --tail=5 cloudflared &>/dev/null; then
  echo "无法读取 cloudflared 日志（容器可能未创建）。请先执行：" >&2
  echo "  ./scripts/up-with-tunnel.sh" >&2
  exit 1
fi
echo "正在从 cloudflared 日志中查找 trycloudflare 地址（若刚启动请稍等几秒后重试）..."
"${COMPOSE[@]}" logs cloudflared 2>&1 | grep -Eo 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' | tail -5 || true
"${COMPOSE[@]}" logs --tail=80 cloudflared 2>&1
