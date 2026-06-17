#!/usr/bin/env bash
# 向运行中的 new-api 注册一个测试用户（POST /api/user/register）。
# 前置：已 docker compose up；默认网关 http://localhost:3000。
# 若控制台开启了 Turnstile，请设置环境变量 TURNSTILE_TOKEN（对应前端拿到的 token）或关闭校验。
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
USER_PREFIX="${USER_PREFIX:-gflowx_test}"
TS="$(date +%s)"
USERNAME="${USERNAME:-${USER_PREFIX}_${TS}}"
PASSWORD="${PASSWORD:-TestUser88!}"

if ! command -v curl >/dev/null 2>&1; then
  echo "需要 curl" >&2
  exit 1
fi

url="${BASE_URL%/}/api/user/register"
if [[ -n "${TURNSTILE_TOKEN:-}" ]]; then
  url="${url}?turnstile=${TURNSTILE_TOKEN}"
fi

echo "POST $url"
echo "username=$USERNAME"

body=$(printf '{"username":"%s","password":"%s"}' "$USERNAME" "$PASSWORD")

code="$(curl -sS -o /tmp/gflowx-reg.json -w "%{http_code}" \
  -X POST "$url" \
  -H 'Content-Type: application/json' \
  -d "$body")"

cat /tmp/gflowx-reg.json
echo ""
echo "HTTP $code"

if [[ "$code" != "200" ]]; then
  echo "注册请求未返回 200。请确认 new-api 已启动、已关闭「禁止注册」、Turnstile 已配置或传入 TURNSTILE_TOKEN。" >&2
  exit 1
fi

if command -v python3 >/dev/null 2>&1; then
  if ! python3 -c "import json,sys; d=json.load(open('/tmp/gflowx-reg.json')); sys.exit(0 if d.get('success') else 1)"; then
    echo "接口返回 success!=true，请根据 JSON 内 message 排查。" >&2
    exit 1
  fi
else
  if ! grep -qE '"success"[[:space:]]*:[[:space:]]*true' /tmp/gflowx-reg.json; then
    echo "接口返回 success!=true，请根据 JSON 内 message 排查。" >&2
    exit 1
  fi
fi

echo ""
echo "—— 测试账号已创建 ——"
echo "  用户名: $USERNAME"
echo "  密码:   $PASSWORD"
echo "（请自行保存；脚本每次默认生成新用户名。）"
