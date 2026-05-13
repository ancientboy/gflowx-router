#!/usr/bin/env bash
# 在已初始化的 backend 子模块（处于官方 pin 提交）上应用 gflowx-api 场景路由补丁。
# 用法：./scripts/apply-gflowx-backend-patch.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PATCH="$ROOT/patches/0001-feat-gflowx-scene-tag-to-model-resolution-before-rel.patch"
if [ ! -f "$PATCH" ]; then
  echo "missing patch: $PATCH" >&2
  exit 1
fi
cd "$ROOT/backend"
if git rev-parse --verify HEAD >/dev/null 2>&1; then
  :
fi
# 若已应用过（存在 gflowxscene），则跳过
if [ -d gflowxscene ]; then
  echo "gflowxscene/ already present; skip apply (reset backend submodule if you need a clean re-apply)." >&2
  exit 0
fi
git am "$PATCH"
echo "Applied gflowx-api backend patch. To publish for your team, push this backend state to your new-api fork and update .gitmodules."
