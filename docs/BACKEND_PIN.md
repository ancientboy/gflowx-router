# New-API 底座版本（子模块固定点）

本文件记录 GFlowX Router 当前锁定的 **QuantumNous/new-api** 提交，便于对照上游与排查问题。

| 字段 | 值 |
|------|-----|
| 远程仓库 | https://github.com/QuantumNous/new-api |
| Git 子模块路径 | `backend/` |
| 当前提交（以 `git submodule status` 为准） | `3856b9d2c0bc3f412992d3ae17d975bf59900b1b` |
| 子模块标签参考 | `v1.0.0-rc.5` 之后 1 个提交 |
| 提交说明 | `chore(deps): bump axios from 1.15.0 to 1.15.2 in /web/classic` |

升级子模块后请更新上表中的提交哈希与说明。

```bash
cd backend && git fetch origin && git checkout <tag-or-commit> && cd .. && git add backend && git commit -m "chore(backend): bump new-api submodule"
```
