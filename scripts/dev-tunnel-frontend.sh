#!/usr/bin/env bash
# 启动 Vite 开发服 + Cloudflare Quick Tunnel，便于 Web Agent 外网访问。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/frontend"
if ! command -v npm >/dev/null 2>&1; then
  echo "需要 npm" >&2
  exit 1
fi
if [[ ! -d node_modules ]]; then
  npm install
fi

CF="${CF:-/tmp/cloudflared}"
if [[ ! -x "$CF" ]]; then
  echo "正在下载 cloudflared -> /tmp/cloudflared …"
  curl -sSL "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64" -o /tmp/cloudflared
  chmod +x /tmp/cloudflared
  CF=/tmp/cloudflared
fi

npm run dev &
DEV_PID=$!
cleanup() {
  kill "$DEV_PID" 2>/dev/null || true
}
trap cleanup EXIT

for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5173/ | grep -q 200; then
    break
  fi
  sleep 1
done

echo "Tunnel log: /tmp/gflowx-frontend-tunnel.log"
"$CF" tunnel --url "http://127.0.0.1:5173" 2>&1 | tee /tmp/gflowx-frontend-tunnel.log
