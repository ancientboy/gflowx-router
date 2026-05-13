# New-API 底座版本（子模块固定点）

本文件记录 GFlowX Router 当前锁定的 **QuantumNous/new-api** 提交，便于对照上游与排查问题。

| 字段 | 值 |
|------|-----|
| 远程仓库 | https://github.com/QuantumNous/new-api |
| Git 子模块路径 | `backend/` |
| 当前提交（以 `git submodule status` 为准） | `49d6662b989644505a869c8b42d9fc11213d2ecb` |
| 子模块说明 | 含 GFlowX `gflowxscene` 场景标签路由（见 `docs/ROUTER.md` §7） |
| 提交说明 | `feat(gflowx): scene tag to model resolution before relay` |

升级子模块后请更新上表中的提交哈希与说明。

> **推送说明**：若你在 `backend/` 内做了二开提交（如本仓库的 `gflowxscene`），`git push` 默认会推向子模块的 `origin`（即 QuantumNous/new-api）。若无写权限，请将子模块 `origin` 改为你方 **fork** 的 URL，从 fork 提 PR 合入上游；父仓库则 `git add backend` 记录新的子模块提交指针。

```bash
cd backend && git fetch origin && git checkout <tag-or-commit> && cd .. && git add backend && git commit -m "chore(backend): bump new-api submodule"
```
