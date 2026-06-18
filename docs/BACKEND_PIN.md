# New-API 底座版本（子模块固定点）

本文件记录 gflowx-router 当前锁定的 **QuantumNous/new-api** 提交，便于对照上游与排查问题。

| 字段 | 值 |
|------|-----|
| 远程仓库 | https://github.com/QuantumNous/new-api |
| Git 子模块路径 | `backend/` |
| 当前提交（以 `git submodule status` 为准） | `3856b9d2c0bc3f412992d3ae17d975bf59900b1b` |
| 子模块标签参考 | `v1.0.0-rc.5` 之后 1 个提交 |
| 提交说明 | `chore(deps): bump axios from 1.15.0 to 1.15.2 in /web/classic` |

## gflowx-router 二开补丁（场景路由）

在 **不修改子模块远程 URL** 的前提下，gflowx-router 对 new-api 的改动以 **`git am` 补丁** 形式放在 `patches/0001-feat-gflowx-scene-tag-to-model-resolution-before-rel.patch`。

克隆本仓库并 `git submodule update --init` 后，在仓库根目录执行：

```bash
./scripts/apply-gflowx-backend-patch.sh
```

若你曾应用过 **仅含 Go 的旧版** `0001` 补丁（有 `gflowxscene/` 但 **无** `web/default/.../gflowx-scenes/`），请先 **`cd backend && git checkout 3856b9d2 && git clean -fd`**（或重新 `submodule update` 到 pin），再执行上述脚本，以便一次性应用 **Go + default Web** 的完整补丁。

这会在 `backend/` 内生成 `gflowxscene/`、改写 `controller/relay.go`，并在 **default 控制台**（`web/default`）增加路由 **`/gflowx-scenes`**（侧栏「场景路由」）用于展示场景标签与角色/分组说明。

升级子模块后请更新上表中的提交哈希与说明；若上游变更导致补丁失效，需重新导出补丁（见下）。

```bash
cd backend && git fetch origin && git checkout <tag-or-commit> && cd .. && git add backend && git commit -m "chore(backend): bump new-api submodule"
```
