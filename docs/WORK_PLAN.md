# gflowx-router — 工作清单（按顺序执行）

> 维护方式：完成一项可将 `[ ]` 改为 `[x]`，并在 PR / 提交说明中引用本节编号。

## 阶段 A — 底座与可运行性

| # | 状态 | 内容 |
|---|------|------|
| A1 | [x] | `backend` 子模块（官方 new-api）与 Docker / 文档 |
| A2 | [x] | 外网临时访问（Cloudflare Quick Tunnel + 无 Docker 脚本） |
| A3 | [x] | `patches/` + `apply-gflowx-backend-patch.sh`（子模块不指向不可推送的私有提交） |

## 阶段 B — 场景路由（后端）

| # | 状态 | 内容 |
|---|------|------|
| B1 | [x] | v0：`gflowxscene` 标签 → 单模型 + env 覆盖（补丁内） |
| B2 | [x] | v1：模型池配置（JSON 文件）+ relay 内按池顺序降级（对齐 `ROUTER.md` §8） |
| B3 | [x] | 健康检查与自动摘除（进程内 TTL；可关；Redis 见后续） |
| B4 | [x] | 别名表（`claude` / `gpt4` / `deepseek`）与 `docs/API.md` 对齐 |

## 阶段 C — 新前端（管理端 gflowx-router）

| # | 状态 | 内容 |
|---|------|------|
| C1 | [x] | Vite + React + TS + Ant Design + Router 脚手架 |
| C2 | [x] | Axios 客户端、`withCredentials`、统一错误处理 |
| C3 | [x] | 登录页 → `POST /api/user/login`，会话 Cookie |
| C4 | [x] | 受保护路由；Layout 展示当前用户与退出 |
| C5 | [x] | 仪表盘：`GET /api/user/self` 展示额度等 |
| C6 | [x] | 密钥页：`GET /api/token/` 分页表格 |
| C7 | [x] | 首页：公开 `GET /api/status` + 产品说明 |
| C8 | [x] | 环境变量 `VITE_API_BASE_URL`（`frontend/.env.example`） |
| C9 | [x] | 与 `docs/FRONTEND.md` 设计令牌对齐；浅色/深色主题切换（Ant Design + CSS 变量） |

## 阶段 D — 工程化与发布

| # | 状态 | 内容 |
|---|------|------|
| D1 | [x] | GitHub Actions：`apply-gflowx-backend-patch` + `go test ./gflowxscene/...` |
| D2 | [x] | GitHub Actions：`frontend` npm ci + lint + build |
| D3 | [x] | 自有 new-api fork 路径：`docs/DEVELOPMENT.md` §1.6（子模块改 URL、免 `git am` 说明） |
| D4 | [x] | 根目录 `LICENSE`：MIT（本仓自有部分）+ AGPL 对 `backend/` 的合规说明 |

---

**当前迭代目标**：阶段 A–D 清单已闭环；后续可在「Redis 健康」「Tier 权重」「自有 fork 落地」上继续演进。
