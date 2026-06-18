# gflowx-router 🚀

> AI 智能路由网关 — 用户选场景，系统选模型

**gflowx-router** 是基于场景分类的 AI API 智能中转：用户无需面对冗长模型列表，只需按场景发起请求，由路由层解析为具体上游模型并尽量稳定、省钱。

## 🎯 核心理念

**传统方式**：用户面对 200+ 模型列表，不知道选什么  
**gflowx-router 方式**：用户选「写代码」「写文章」「看图片」，系统智能路由

## ✨ 核心特性

- 🏷️ **场景化分类** — 不选模型，选场景
- 🧠 **智能路由** — 模型池、健康跳过、失败时池内降级（见 `docs/ROUTER.md`）
- 🔄 **格式适配** — OpenAI/Claude/Gemini 等由 new-api 底座统一转换
- 💰 **灵活计费** — 沿用 new-api 额度与计费模型
- 📊 **极简管理** — 新管理端聚焦常用能力（见 `docs/FRONTEND.md` §6）
- 🔌 **OpenAI 兼容** — 一行代码接入，无需改动现有工具

## 🏗️ 技术架构

- **后端底座**：`backend/` 为官方 [QuantumNous/new-api](https://github.com/QuantumNous/new-api) 的 **Git 子模块**（Go）；场景/别名/模型池等二开在补丁 `patches/` 中注入 `gflowxscene`。
- **管理端**：`frontend/` 为 **Vite + React + Ant Design** 独立工程（与 new-api 自带 Web 分离）；设计见 `docs/FRONTEND.md`。本地：`cd frontend && npm install && npm run dev`（`/api`、`/v1` 代理到 `127.0.0.1:3000`）。
- **数据库（当前官方 compose）**：PostgreSQL + Redis（见 `backend/docker-compose.yml`）
- **部署**：Docker Compose；根目录编排通过 `include` 引用子模块内官方 compose（Compose 项目名 **`gflowx-router`**）

## 📖 文档

- [开发文档](docs/DEVELOPMENT.md) — 架构与二开策略（含「先跑通官方再切 gflowx-router 管理端」）
- [后端子模块版本](docs/BACKEND_PIN.md) — 当前锁定的 new-api 提交
- [API 文档](docs/API.md) — gflowx-router 接口约定（产品向）
- [路由设计](docs/ROUTER.md) — 智能路由与场景解析
- [前端设计](docs/FRONTEND.md) — UI/UX 规范与 **管理端已实现清单（§6）**
- [管理后台规格](docs/ADMIN_SPEC.md) — **按需求重写后台**的功能清单、new-api 接口映射、阶段 F1–F5（与 `WORK_PLAN` 阶段 F 对应）
- [订阅档位与场景设计](docs/SUBSCRIPTION_DESIGN.md) — **三档订阅**与场景池、分组、周期的对齐方式（产品定稿）
- [按分组切换场景池（技术）](docs/GFLOWX_POOL_BY_GROUP_DESIGN.md) — **池 JSON v2**、解析优先级、兼容与只读 API 建议
- [产品落地页规划](docs/LANDING_PAGE.md) — `/` 落地信息架构与分阶段任务（阶段 E）
- [外网访问](docs/EXTERNAL_ACCESS.md) — 隧道与无 Docker 本地跑法
- [工作清单](docs/WORK_PLAN.md) — 任务与完成状态

## 🚀 快速开始（第一阶段：官方 new-api 跑通）

环境要求：**Docker**、**Docker Compose v2.20+**（根目录 `docker-compose.yml` 使用 `include`）。

```bash
git clone --recurse-submodules https://github.com/ancientboy/gflowx-router.git
cd gflowx-router
./scripts/apply-gflowx-backend-patch.sh
docker compose up -d
```

若克隆时未拉取子模块：

```bash
git submodule update --init --recursive
./scripts/apply-gflowx-backend-patch.sh
docker compose up -d
```

启动完成后访问：**http://localhost:3000**（与官方 new-api 一致）。

可选：将 `config/gflowx_scene_pools.example.json`（平面池 v1）或 `config/gflowx_scene_pools_by_group.example.json`（按分组 v2，见 `docs/GFLOWX_POOL_BY_GROUP_DESIGN.md`）复制为自定义路径，并设置 `GFLOWX_SCENE_POOLS_FILE` / `GFLOWX_ALIASES_FILE`（详见 `docs/ROUTER.md` §8）。

等效命令（任选其一）：

```bash
./scripts/up-official.sh
# 或
cd backend && docker compose up -d
```

> 默认数据库与 Redis 密码写在 `backend/docker-compose.yml` 中，**仅适用于本地/内网验证**；上生产前请全部更换，并阅读 new-api 官方环境变量说明。

本环境若未安装 Docker，无法在 CI 容器内替你完成拉镜像验证；请在本地或装有 Docker 的机器上执行上述命令。

### 管理端（`frontend/`）

需 **Node 22+**：

```bash
cd frontend && npm install && npm run dev
```

详见 [`frontend/README.md`](frontend/README.md) 与 [`docs/FRONTEND.md`](docs/FRONTEND.md) §6。

## 🌐 外网访问（Cursor Web / 手机 / 分享给他人）

在 **Cursor Web Agent** 里，对话中的 `http://localhost:3000` **不是**你电脑上的地址，浏览器打不开是正常现象。

请在你 **自己能跑 Docker 的机器**（本机或云主机）上按仓库根目录命令启动，然后任选其一拿到 **HTTPS 公网链接**：

```bash
./scripts/up-with-tunnel.sh
./scripts/show-tunnel-url.sh
```

或手动：

```bash
docker compose -f docker-compose.yml -f docker-compose.tunnel.yml --profile tunnel up -d
docker compose -f docker-compose.yml -f docker-compose.tunnel.yml logs cloudflared
```

**没有 Docker 时**（例如部分云端 Agent 容器）：先 `./scripts/dev-newapi-sqlite.sh` 用 SQLite 起 new-api，再在同一环境执行 `cloudflared tunnel --url http://127.0.0.1:3000`，从日志复制 `https://xxxx.trycloudflare.com`（步骤见 [`docs/EXTERNAL_ACCESS.md`](docs/EXTERNAL_ACCESS.md)）。

日志中会出现 `https://xxxx.trycloudflare.com`，用浏览器打开即可。**每次重启隧道 URL 会变**；仅适合开发演示，详见 [`docs/EXTERNAL_ACCESS.md`](docs/EXTERNAL_ACCESS.md)。

## 📄 License

见仓库根目录 [`LICENSE`](LICENSE)：**本仓库自有文件**（文档、脚本、`frontend/`、`patches/`、`config/` 示例等）在 **MIT** 下授权；**`backend/` 子模块**为 [QuantumNous/new-api](https://github.com/QuantumNous/new-api)，适用 **AGPL-3.0**，构建或分发包含该子模块的产物时须遵守 AGPL 义务。
