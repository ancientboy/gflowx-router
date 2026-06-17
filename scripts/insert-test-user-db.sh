#!/usr/bin/env bash
# 在 PostgreSQL 中直接插入一个 new-api 普通用户（绕过 HTTP 注册 / Turnstile）。
# 适用：官方 docker-compose（服务名 postgres，库 new-api，用户 root）。
#
# 用法：
#   ./scripts/insert-test-user-db.sh
#   USERNAME=gflowx_u1 PASSWORD='TestUser88!' ./scripts/insert-test-user-db.sh
#   PG_CMD='docker exec -i mypostgres psql -U root -d new-api' ./scripts/insert-test-user-db.sh
#
# 依赖：本机可 docker exec 到 Postgres；仓库已拉 backend 子模块（用于 go run 生成 bcrypt）。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f backend/go.mod ]]; then
  echo "缺少 backend 子模块，请先: git submodule update --init --recursive" >&2
  exit 1
fi

USERNAME="${USERNAME:-gflowx_db_$(date +%s)}"
PASSWORD="${PASSWORD:-TestUser88!}"
PG_CMD="${PG_CMD:-docker exec -i postgres psql -U root -d new-api}"

echo "生成 bcrypt（与 new-api common.Password2Hash 一致，cost=Default）…"
HASH="$(cd backend && go run ../scripts/gen_bcrypt_hash.go "$PASSWORD")"

export GF_USERNAME="$USERNAME"
export GF_PASSWORD_HASH="$HASH"

SQL_FILE="$(mktemp)"
cleanup() {
  rm -f "$SQL_FILE"
}
trap cleanup EXIT

python3 <<'PY' >"$SQL_FILE"
import os

u = os.environ["GF_USERNAME"].replace("'", "''")
h = os.environ["GF_PASSWORD_HASH"].replace("'", "''")

sql = f"""
BEGIN;

INSERT INTO users (
  username,
  password,
  display_name,
  role,
  status,
  email,
  github_id,
  discord_id,
  oidc_id,
  wechat_id,
  telegram_id,
  quota,
  used_quota,
  request_count,
  "group",
  aff_code,
  aff_count,
  aff_quota,
  aff_history,
  inviter_id,
  setting,
  remark,
  stripe_customer,
  linux_do_id,
  created_at,
  last_login_at
) VALUES (
  '{u}',
  '{h}',
  '{u}',
  1,
  1,
  '',
  '',
  '',
  '',
  '',
  '',
  0,
  0,
  0,
  'default',
  substr(md5(random()::text || clock_timestamp()::text), 1, 10),
  0,
  0,
  0,
  0,
  '{{}}',
  '',
  '',
  '',
  extract(epoch from now())::bigint,
  0
);

COMMIT;
"""
print(sql)
PY

echo "执行: $PG_CMD"
if ! command -v docker >/dev/null 2>&1; then
  echo "未找到 docker，已生成 SQL 于临时文件，请自行用 psql 执行：" >&2
  cat "$SQL_FILE"
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -qx 'postgres'; then
  echo "未检测到名为 postgres 的容器。请设置 PG_CMD 指向你的 psql，例如：" >&2
  echo '  PG_CMD="docker exec -i <容器名> psql -U root -d new-api"' >&2
  echo "--- SQL ---"
  cat "$SQL_FILE"
  exit 1
fi

$PG_CMD -v ON_ERROR_STOP=1 <"$SQL_FILE"

echo ""
echo "已插入用户（若 username 已存在会报错，可换 USERNAME 重试）："
echo "  用户名: $USERNAME"
echo "  密码:   $PASSWORD"
