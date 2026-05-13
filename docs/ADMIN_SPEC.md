# gflowx-router — 管理后台产品规格（按需求重写）

> **原则**：**底座与 API 继续复用 new-api**（`backend/` 子模块）；`frontend/` 按 **gflowx-router 产品体验** 重新设计信息架构与页面，与官方 Web **并存**：深度运维可暂时走官方界面，新后台逐步吸收高频路径。  
> **路由来源**：以下 `/api/...` 均摘自当前子模块 `backend/router/api-router.go`（随上游版本可能增减，对接前以实际响应为准）。

---

## 1. 角色与边界

| 角色 | 典型诉求 | 新后台目标（首版→迭代） |
|------|-----------|-------------------------|
| **普通用户** | 登录、看额度与分组、管理自己的 API Key、查看调用/用量、充值或订阅（若部署方开启） | 优先覆盖：**会话、个人信息、Key 生命周期、只读模型/倍率、订阅/充值入口（可选）** |
| **管理员** | 用户与分组、渠道、日志、模型元数据、兑换码等 | **第一阶段外链官方 Web**；后续按需在新前端 **Admin 分区** 逐项对接 `AdminAuth` 接口 |
| **Root** | 系统选项、性能、上游倍率同步等 | **长期**仍以官方 Web 或专用工具为主；新前端仅链入或极少量封装 |

**gflowx-router 独有（场景路由）**：标签 → 模型池、别名、健康 TTL 等由 **网关进程配置**（环境变量与 JSON 文件，见 `docs/ROUTER.md`）。**不在 new-api 默认库里**。新后台若要「可视化改池」，需要 **后续新增只读/读写 API**（薄 BFF 或补丁内小接口）或 **仅展示静态说明 + 链到运维文档**。

---

## 2. 功能清单（按模块）

### 2.1 认证与账户

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 登录（账密 / 2FA） | P0 | 与现有一致；可扩展 Passkey 等（new-api 已具备部分路由） |
| 注册 | P1 | 依赖部署是否开放 `POST /api/user/register` 与 Turnstile 等 |
| 退出 | P0 | `GET /api/user/logout` |
| 个人资料查看/修改 | P1 | `GET/PUT /api/user/self` |
| 用户分组列表（可读） | P1 | `GET /api/user/groups`（未鉴权）或登录后 `GET /api/user/self/groups` |

### 2.2 首页 / 仪表盘（产品化「套餐感」）

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 额度与用量摘要 | P0 | `GET /api/user/self` |
| 按日用量曲线 | P2 | `GET /api/data/self` |
| 个人日志统计 | P2 | `GET /api/log/self/stat` |
| **订阅 / 套餐卡片**（若启用订阅插件） | P1 | `GET /api/subscription/plans`、`GET /api/subscription/self`、`PUT /api/subscription/self/preference`；支付走各 `.../pay` 与回调（见上游文档） |
| 充值入口（传统额度） | P2 | `GET /api/user/topup/info`、`POST /api/user/topup` 等（视支付方式开启） |

### 2.3 API Key

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 分页列表 | P0 | `GET /api/token/`（已实现） |
| 新建 / 编辑 / 删除 | P0 | `POST /api/token/`、`PUT /api/token/`、`DELETE /api/token/:id` |
| 查看完整 Key / 批量导出 | P1 | `POST /api/token/:id/key`、`POST /api/token/batch/keys`（注意限流与安全） |

### 2.4 模型与调用（「统一接口」心智）

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 当前用户可用模型列表 | P1 | `GET /api/user/models` |
| 公开模型列表（仪表盘类） | P2 | `GET /api/models`（需 `UserAuth`） |
| 倍率/计价配置只读 | P2 | `GET /api/ratio_config` |
| **场景标签说明**（静态展示 + 文档链接） | P0 | 链 `docs/API.md` / 站内 `/docs` 路由（待实现） |

### 2.5 日志与排错

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 个人请求日志 / 搜索 | P2 | `GET /api/log/self`、`GET /api/log/self/search` |

### 2.6 管理员（第二阶段起）

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 用户列表与搜索、创建、管理 | P2 | `GET/POST/PUT/DELETE /api/user/...`（`AdminAuth`） |
| 渠道列表与测试 | P2 | `GET/POST/PUT /api/channel/...` |
| 分组列表 | P2 | `GET /api/group/` |
| 模型元数据 | P2 | `GET/POST/PUT/DELETE /api/models/...` |
| 订阅计划管理 | P2 | `GET/POST/PUT/PATCH /api/subscription/admin/...` |

### 2.7 gflowx 独有（第三阶段或独立工具）

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 场景池 JSON 查看/编辑 | P3 | 今日无标准 REST；需 **设计只读 API 或配置中心** |
| 别名表、健康策略开关 | P3 | 同上，或运维在部署层维护 |

---

## 3. 接口映射表（新后台功能 → new-api）

**图例**：✅ 已在前端接入 · 🔲 规划接入 · 🔐 需管理员 · 🧩 需 Root · ⚙️ gflowx 自建/补丁 · — 视部署开启

| 功能 | 方法 | 路径 | 鉴权 | 状态 |
|------|------|------|------|------|
| 登录 | POST | `/api/user/login` | 无 | ✅ `auth.ts` |
| 退出 | GET | `/api/user/logout` | User | ✅ |
| 当前用户 | GET | `/api/user/self` | User | ✅ `auth.ts` / Dashboard |
| 更新资料 | PUT | `/api/user/self` | User | 🔲 |
| 注册 | POST | `/api/user/register` | 无 | 🔲 |
| 公开状态 | GET | `/api/status` | 无 | ✅ 落地页 |
| 用户分组（公开列表） | GET | `/api/user/groups` | 无 | 🔲 |
| 登录用户分组 | GET | `/api/user/self/groups` | User | 🔲 |
| 用户可用模型 | GET | `/api/user/models` | User | 🔲 |
| Token 列表 | GET | `/api/token/` | User | ✅ `token.ts` |
| Token 搜索 | GET | `/api/token/search` | User | 🔲 |
| Token 详情 | GET | `/api/token/:id` | User | 🔲 |
| 新建 Token | POST | `/api/token/` | User | 🔲 |
| 更新 Token | PUT | `/api/token/` | User | 🔲 |
| 删除 Token | DELETE | `/api/token/:id` | User | 🔲 |
| 查看明文 Key | POST | `/api/token/:id/key` | User | 🔲 |
| 订阅计划列表 | GET | `/api/subscription/plans` | User | 🔲 |
| 我的订阅 | GET | `/api/subscription/self` | User | 🔲 |
| 订阅偏好 | PUT | `/api/subscription/self/preference` | User | 🔲 |
| 倍率配置（只读） | GET | `/api/ratio_config` | 限流 | 🔲 |
| 个人用量按日 | GET | `/api/data/self` | User | 🔲 |
| 个人日志 | GET | `/api/log/self` | User | 🔲 |
| 聊天补全（调用） | POST | `/v1/chat/completions` | Bearer Token | 文档 `docs/API.md` |
| 用户管理 | * | `/api/user/`（子路径） | Admin | 🔐 |
| 渠道管理 | * | `/api/channel/` | Admin | 🔐 |
| 模型元数据 | * | `/api/models/` | Admin | 🔐 |
| 订阅管理后台 | * | `/api/subscription/admin/` | Admin | 🔐 |
| 系统选项 | * | `/api/option/` | Root | 🧩 |

---

## 4. 实施阶段（与仓库迭代对齐）

| 阶段 | 目标 | 主要交付 |
|------|------|----------|
| **F1 — 用户闭环** | 普通用户「能持续用」 | Key 新建/编辑/删除/复制；个人资料只读或简单编辑；链到 API 文档 |
| **F2 — 套餐与模型心智** | 对齐「角色/套餐/模型」产品叙事 | 仪表盘增强：`self` + `subscription/self` + `plans`（若开启）；`GET /api/user/models` 只读列表；分组说明文案 |
| **F3 — 用量与日志** | 可观测 | `data/self` 图表；`log/self` 简单筛选 |
| **F4 — Admin 分区** | 少跳转官方 Web | 用户/渠道/模型 只读或高频写操作（按风险逐项开放） |
| **F5 — gflowx 配置面** | 场景池运维 | 设计读接口或外链运维手册；可选补丁暴露只读 JSON |

详细任务勾选见 **`docs/WORK_PLAN.md` 阶段 F**。

---

## 5. 与官方 Web 的关系

- **并存**：同一 `Base URL` 下，官方打包 UI 与 `frontend/` 可并行部署（路径由部署方式决定）；新后台顶栏保留 **「经典管理后台」** 外链为推荐做法，直到 F4 覆盖足够管理面。
- **官方 default 控制台（`web/default`）**：自 gflowx-router 补丁起，可在侧栏进入 **`/gflowx-scenes`**（「场景路由」），用于在 **与 new-api 相同技术栈** 下展示场景标签、角色/分组说明与请求示例；网关侧池化/别名等仍以环境变量与文件配置为准（只读说明）。详见 `docs/BACKEND_PIN.md` 与 `docs/DEVELOPMENT.md` §1.4。
- **Cookie 会话**：与现有一致，`withCredentials` 同源或代理到 new-api。

---

## 6. 文档维护

- 本页随 **对接进度** 更新「状态」列（✅ / 🔲）。  
- 上游路由变更时，以 `backend/router/api-router.go` 为准做一次 diff 同步。

---

_版本：v1 · 与 `docs/DEVELOPMENT.md`、`docs/FRONTEND.md` 一致：底座 new-api，体验 gflowx-router。_
