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

这会在 `backend/` 内生成 `gflowxscene/` 并改写 `controller/relay.go`。若你已将 `backend` 推送到 **自有的 new-api fork**，请把 `.gitmodules` 的 `url` 改为 fork 地址，并把补丁后的提交推到该 fork，团队成员即可直接依赖子模块指针而无需每次 `git am`（流程说明见 [`docs/DEVELOPMENT.md`](DEVELOPMENT.md) §1.6）。

升级子模块后请更新上表中的提交哈希与说明；若上游变更导致补丁失效，需重新导出补丁（见下）。

```bash
cd backend && git fetch origin && git checkout <tag-or-commit> && cd .. && git add backend && git commit -m "chore(backend): bump new-api submodule"
```
