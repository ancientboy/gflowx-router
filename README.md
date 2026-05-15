# GFlowX Router 🚀

> AI 智能路由网关 — 用户选场景，系统选模型

GFlowX Router 是一个基于分类推荐的 AI API 智能中转站。用户无需了解具体模型，只需选择使用场景，系统自动路由到最优模型。

## 🎯 核心理念

**传统方式**：用户面对 200+ 模型列表，不知道选什么  
**GFlowX 方式**：用户选「写代码」「写文章」「看图片」，系统智能路由

## ✨ 核心特性

- 🏷️ **场景化分类** — 不选模型，选场景
- 🧠 **智能路由** — 多层分级 + 健康检查 + 自动降级
- 🔄 **格式适配** — OpenAI/Claude/Gemini/通义/智谱 统一转换
- 💰 **灵活计费** — 按场景分类计费，无需关心模型单价
- 📊 **极简管理** — 3 个页面搞定一切
- 🔌 **OpenAI 兼容** — 一行代码接入，无需改动现有工具

## 🏗️ 技术架构

- **后端底座**：`backend/` 为官方 [QuantumNous/new-api](https://github.com/QuantumNous/new-api) 的 **Git 子模块**（Go；二开与场景路由将在此之上演进）
- **前端**：根目录 **`frontend/`** 为独立 Vite + React + Ant Design 站点（与 new-api 默认管理端脱钩；见 `docs/FRONTEND.md`）
  - **`/`**：面向终端用户的**营销首页**，自带**独立顶栏**（影棚风深色主区）。
  - **`/login`**、**`/dashboard`**、**`/keys`**：浅色 **控制台壳**（另一套顶栏），后续可接 new-api API。
  - 外网临时预览：`./scripts/dev-tunnel-frontend.sh`（需本机 `npm`；自动下载 `cloudflared` 到 `/tmp/cloudflared`）。
- **数据库（当前官方 compose）**：PostgreSQL + Redis（见 `backend/docker-compose.yml`）
- **部署**：Docker Compose；根目录编排通过 `include` 引用子模块内官方 compose

## 📖 文档

- [开发文档](docs/DEVELOPMENT.md) — 架构与二开策略（含「先跑通官方再换 GFlowX 前端」）
- [后端子模块版本](docs/BACKEND_PIN.md) — 当前锁定的 new-api 提交
- [API 文档](docs/API.md) — GFlowX 接口规范（产品向）
- [路由设计](docs/ROUTER.md) — 智能路由引擎设计
- [前端设计](docs/FRONTEND.md) — UI/UX 设计规范

## 🚀 快速开始（第一阶段：官方 new-api 跑通）

环境要求：**Docker**、**Docker Compose v2.20+**（根目录 `docker-compose.yml` 使用 `include`）。

```bash
git clone --recurse-submodules https://github.com/ancientboy/gflowx-router.git
cd gflowx-router
docker compose up -d
```

若克隆时未拉取子模块：

```bash
git submodule update --init --recursive
docker compose up -d
```

启动完成后访问：**http://localhost:3000**（与官方 new-api 一致）。

等效命令（任选其一）：

```bash
./scripts/up-official.sh
# 或
cd backend && docker compose up -d
```

> 默认数据库与 Redis 密码写在 `backend/docker-compose.yml` 中，**仅适用于本地/内网验证**；上生产前请全部更换，并阅读 new-api 官方环境变量说明。

本环境若未安装 Docker，无法在 CI 容器内替你完成拉镜像验证；请在本地或装有 Docker 的机器上执行上述命令。

## 独立前端（`frontend/`）

```bash
cd frontend
npm install
npm run dev
# 浏览器打开 http://127.0.0.1:5173/  — 用户向首页（独立顶栏）
# http://127.0.0.1:5173/login  — 控制台壳（浅色顶栏）
```

Cursor Web Agent 等无法访问本机时，可在仓库根目录执行：

```bash
./scripts/dev-tunnel-frontend.sh
```

终端会打印 **trycloudflare.com** 的 HTTPS 临时域名（进程结束后失效）。

## 📄 License

- **`backend/`（子模块 [QuantumNous/new-api](https://github.com/QuantumNous/new-api)）** 适用 **AGPL-3.0**，以子模块内 `LICENSE` 为准；修改与分发须遵守该许可及项目署名要求。
- 本仓库中 GFlowX 自有文档、脚本等，若与 AGPL 产生覆盖关系，以你方后续在根目录补充的 `LICENSE` 及法务结论为准；**不要**再假定整仓为历史上的「MIT 示例文案」。
