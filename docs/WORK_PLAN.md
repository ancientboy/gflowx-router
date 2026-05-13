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
| C7 | [x] | 首页 → 已由 **阶段 E** 升级为完整产品落地页（本行保留为历史里程碑，详见 E1–E9） |
| C8 | [x] | 环境变量 `VITE_API_BASE_URL`（`frontend/.env.example`） |
| C9 | [x] | 与 `docs/FRONTEND.md` 设计令牌对齐；浅色/深色主题切换（Ant Design + CSS 变量） |

## 阶段 D — 工程化与发布

| # | 状态 | 内容 |
|---|------|------|
| D1 | [x] | GitHub Actions：`apply-gflowx-backend-patch` + `go test ./gflowxscene/...` |
| D2 | [x] | GitHub Actions：`frontend` npm ci + lint + build |
| D3 | [x] | 自有 new-api fork 路径：`docs/DEVELOPMENT.md` §1.6（子模块改 URL、免 `git am` 说明） |
| D4 | [x] | 根目录 `LICENSE`：MIT（本仓自有部分）+ AGPL 对 `backend/` 的合规说明 |

## 阶段 E — 产品落地页（`/`）

| # | 状态 | 内容 |
|---|------|------|
| E1 | [x] | 规划设计文档 `docs/LANDING_PAGE.md`（信息架构、区块、任务表） |
| E2 | [x] | Shell：`/` 使用营销顶栏（锚点 + 登录/控制台）；其它路由保留管理端导航 |
| E3 | [x] | Hero：主副标题、CTA、与设计令牌一致的首屏 |
| E4 | [x] | 对比区：传统 / gflowx-router / 精细控制 三卡片 |
| E5 | [x] | 场景网格 + Modal 示例 JSON + 复制 |
| E6 | [x] | 三步接入（Steps）+ 文档引用 |
| E7 | [x] | FAQ（Collapse） |
| E8 | [x] | 页脚外链 + 折叠展示 `GET /api/status` |
| E9 | [x] | `index.html`：`lang=zh-CN`、`<meta name="description">`、title 加长；`og:image` 等见 E10 |
| E10 | [x] | 打磨：注册/套餐 CTA（`LandingPricing` + 登录 query 提示）、社交分享图（`og-image.svg` + `VITE_SITE_URL` 注入）、Lighthouse 基础（`<main>`、跳过链接、懒加载重块）、可选 GA4（`VITE_GA_MEASUREMENT_ID`）、`Suspense` 懒加载场景区以下模块 |

## 阶段 F — 管理后台按需求重写（复用 new-api API）

> 规格全文：**[`docs/ADMIN_SPEC.md`](ADMIN_SPEC.md)**（功能清单、接口映射、阶段 F1–F5）。

| # | 状态 | 内容 |
|---|------|------|
| F0 | [x] | 写入 `docs/ADMIN_SPEC.md`：角色边界、功能模块、与 `api-router.go` 对齐的接口映射表、F1–F5 分期 |
| F1 | [ ] | 用户闭环：Token 新建/编辑/删除/复制；`PUT /api/user/self` 或只读资料；站内 API 文档入口（`/docs` 或外链） |
| F2 | [ ] | 套餐与模型心智：仪表盘聚合 `subscription/*`（若部署开启）、`GET /api/user/models`、分组/订阅说明文案；**档位与场景对齐**见 `docs/SUBSCRIPTION_DESIGN.md` |
| F3 | [ ] | 用量与日志：`GET /api/data/self`、`GET /api/log/self`（+ 简单筛选） |
| F4 | [ ] | Admin 分区（可选）：用户/渠道/模型 高频接口 + 顶栏「经典管理后台」外链 |
| F5 | [ ] | gflowx 场景池配置面：只读 API 或运维文档链（与 `ROUTER.md` 一致） |

---

**当前迭代目标**：按 **`docs/ADMIN_SPEC.md`** 推进 **阶段 F**（先 F1 用户闭环）；深度运维可继续暂用 new-api 自带 Web。
