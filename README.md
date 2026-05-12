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

- **后端**：Go（基于 New-API 二开）
- **前端**：React + Ant Design / shadcn-ui（全新开发）
- **数据库**：MySQL / PostgreSQL / SQLite
- **部署**：Docker 一键部署

## 📖 文档

- [开发文档](docs/DEVELOPMENT.md) — 完整的开发规范和架构说明
- [API 文档](docs/API.md) — 接口规范
- [路由设计](docs/ROUTER.md) — 智能路由引擎设计
- [前端设计](docs/FRONTEND.md) — UI/UX 设计规范

## 🚀 快速开始

```bash
# Docker 部署
docker compose up -d

# 访问
open http://localhost:3000
```

## 📄 License

MIT
