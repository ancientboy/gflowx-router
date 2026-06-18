#!/usr/bin/env bash
# 启动 new-api 底座 + Cloudflare Quick Tunnel（外网 HTTPS）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
exec docker compose -f docker-compose.yml -f docker-compose.tunnel.yml --profile tunnel up -d "$@"
