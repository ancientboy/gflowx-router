# gflowx-router — 开发文档

> 版本：v0.1.0-draft
> 日期：2026-05-12
> 产品代号：gflowx-router

---

## 一、项目概述

### 1.1 产品定位

gflowx-router 是一个 **场景化 AI API 智能路由网关**。

与 One-API / New-API 暴露数百个模型让用户自己选不同，gflowx-router 让用户**选择使用场景**（写代码、写文章、看图片...），系统自动将请求路由到最优的后端模型。

### 1.2 目标用户

| 用户类型 | 需求 | 痛点 |
|---------|------|------|
| **个人开发者** | 接入 AI 写代码 | 不知道选哪个模型，Key 管理麻烦 |
| **内容创作者** | 写文章、做图片/视频 | 不知道什么模型擅长什么 |
| **创业团队** | 多人共用 AI | 成本控制、额度管理 |
| **学生/研究者** | 学习、翻译、论文 | 预算有限，需要性价比 |

### 1.3 核心差异化

| 维度 | One-API / New-API | gflowx-router |
|------|-------------------|---------------|
| 用户选择 | 选具体模型（gpt-4o、claude-3.5...） | **选场景**（smart、code、write...） |
| 认知负担 | 高（需要了解模型差异） | **低**（标签即功能） |
| 路由策略 | 手动配权重 | **智能分级 + 自动降级** |
| 前端复杂度 | 高（10+ 管理页面） | **低**（3 个核心页面） |
| 适合人群 | 技术用户 | **所有人** |

### 1.4 New-API 二开策略（已定）

1. **起点冻结**：接入 new-api 时选定一个稳定的 **tag 或 commit** 作为底座，写入发布说明或变更记录，便于追溯与对比上游。
2. **主仓与更新**：以 **自有 fork 仓库** 为唯一主开发线；上游 new-api **不强制跟更**，按需阅读 release / 安全公告，**有选择地** cherry-pick 或合并；日常维护由团队自行负责。

   **集成顺序（推荐）**：fork 导入后，**优先**在「与 upstream 尽量一致」的形态下 **端到端跑通**（构建、数据库迁移、Docker、环境变量；**可暂时保留 new-api 官方自带 Web** 作管理与联调），用于确认 **底座与部署无误、二开未破坏核心路径**。**再** 并行开发同仓 `frontend/`（gflowx-router 管理端 UI）及场景路由等差异化能力。新前端 **P0 齐备** 后，将 **对外默认入口** 切至 gflowx-router 管理端；官方 Web 可下线，或 **仅在开发/内网** 保留作功能对照。这与「最终产品不复用官方 UI」不矛盾：**先同构跑通降低土建风险，再换产品面**。

3. **前端路线——同仓全新前端工程**：在 **同一 monorepo** 内维护独立目录（如 `frontend/`），**默认不复用** new-api 自带管理端 UI 作为对外产品面。视觉与信息架构按 **`docs/FRONTEND.md`** 实现，与官方 new-api 界面 **脱钩**，避免混淆。技术栈以 `frontend/package.json` 为准。  
   **（可选）** 若需在 **与 upstream 相同技术栈** 下迭代（`backend/web/default/`，TanStack Router + Rsbuild + Tailwind），可在官方控制台目录内 **增量加路由与页面**（例如场景路由说明 **`/gflowx-scenes`**）；此类改动可通过 **`patches/0001-...` 一并 `git am`** 分发，与根目录 `frontend/` **可并存**（见 [`BACKEND_PIN.md`](BACKEND_PIN.md)）。
4. **功能对齐与防遗漏**：new-api 管理端功能面较广（用户、渠道、模型、计费、日志、系统设置等）。全新前端须维护 **「路由 / 页面 ↔ 后端 API」对照清单**（亦见 [`ADMIN_SPEC.md`](ADMIN_SPEC.md)），按 **P0（可上线最小集）→ P1 → P2** 分阶段验收；开发期可将 **上游 new-api 前端仅作本地对照**（不随产品对外发布），用于查漏，而非代码复用来源。

> **许可证**：衍生作品仍须遵守 new-api 所采用的开源许可证（如 AGPL）及署名要求，与是否「独立主仓」无关。

### 1.5 仓库结构与第一阶段（官方底座跑通）

- **`backend/`**：官方 [QuantumNous/new-api](https://github.com/QuantumNous/new-api) 的 **Git 子模块**，用于版本对齐与可选的 cherry-pick；当前固定提交见 [`docs/BACKEND_PIN.md`](BACKEND_PIN.md)。
- **首次克隆**（带子模块）：
  ```bash
  git clone --recurse-submodules <本仓库 URL>
  ```
  若已克隆未带子模块：
  ```bash
  git submodule update --init --recursive
  ```
- **应用 gflowx-router 后端补丁**（场景路由 `gflowxscene`、`controller/relay.go` 改动，以及 **default 控制台** 内 **`/gflowx-scenes`** 路由增量；子模块指针仍指向官方 pin，补丁见 `patches/`）：
  ```bash
  ./scripts/apply-gflowx-backend-patch.sh
  ```
- **启动官方栈**（PostgreSQL + Redis + `calciumion/new-api` 镜像）任选其一：
  - 仓库根目录：`docker compose up -d`（需 Compose **v2.20+**，根目录 `docker-compose.yml` 通过 `include` 引用 `backend/docker-compose.yml`）
  - 或：`./scripts/up-official.sh`
  - 或：`cd backend && docker compose up -d`
- **验证**：浏览器打开 `http://localhost:3000`；健康检查见子模块 compose 中 `new-api` 的 `healthcheck`。
- **外网 / Cursor Web**：云端 Agent 给出的 `localhost` 无法在你本机浏览器打开；请在可执行 Docker 的环境使用 Quick Tunnel 等，见 [`docs/EXTERNAL_ACCESS.md`](EXTERNAL_ACCESS.md)。
- **`frontend/`**：gflowx-router 全新管理端脚手架（`frontend/`）；与官方 Web 并行开发，待 P0 后再切换默认入口。

### 1.6 自有 new-api fork（团队协作，可选）

当团队维护 **QuantumNous/new-api 的 fork** 并将 gflowx-router 二开直接推到该 fork 的 `main`（或固定分支）时：

1. 将根目录 `.gitmodules` 中 `backend` 的 `url` 改为 fork 地址，并 `git submodule sync`。
2. 将子模块指针提交到 **fork 上已含 gflowx-router 改动的提交**（不再依赖同事本机 `git am`）。
3. 新成员克隆后只需 `git submodule update --init`，**无需**再执行 `./scripts/apply-gflowx-backend-patch.sh`（除非仍想保留「上游 pin + 补丁」双轨流程做对照）。

在 fork 未就绪前，可继续使用 `patches/` + `apply-gflowx-backend-patch.sh` 流程；详见 [`docs/BACKEND_PIN.md`](BACKEND_PIN.md)。

---

## 二、系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                     用户 / 客户端                         │
│  Cursor · Claude Code · OpenClaw · ChatGPT-Next-Web · ... │
└──────────────────────────┬──────────────────────────────┘
                           │ OpenAI 兼容协议
                           ▼
┌──────────────────────────────────────────────────────────┐
│                    gflowx-router                          │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              🧠 智能路由层（新增核心）                 │ │
│  │                                                     │ │
│  │  场景解析 → 分类匹配 → 模型池选择 → 路由决策          │ │
│  │  • 场景分类映射表                                    │ │
│  │  • 分级路由策略（优先级/成本/延迟）                    │ │
│  │  • 健康检查 & 自动摘除                               │ │
│  │  • 额度感知 & 自动降级                               │ │
│  └────────────────────┬────────────────────────────────┘ │
│                       │                                   │
│  ┌────────────────────▼────────────────────────────────┐ │
│  │              🔄 格式适配层（复用 New-API）             │ │
│  │                                                     │ │
│  │  OpenAI → Claude → Gemini → 通义 → 智谱 → 百度      │ │
│  │  统一输入输出：OpenAI 格式                            │ │
│  └────────────────────┬────────────────────────────────┘ │
│                       │                                   │
│  ┌────────────────────▼────────────────────────────────┐ │
│  │              🔧 渠道管理层（复用 New-API）             │ │
│  │                                                     │ │
│  │  • 多 Key 轮询 / 负载均衡                            │ │
│  │  • 流式传输（SSE）                                   │ │
│  │  • Token 计费 / 额度管理                             │ │
│  │  • 错误重试 / 超时处理                               │ │
│  │  • 日志 / 统计                                      │ │
│  └────────────────────┬────────────────────────────────┘ │
│                       │                                   │
│  ┌────────────────────▼────────────────────────────────┐ │
│  │              💾 数据层                               │ │
│  │  MySQL / PostgreSQL / SQLite                         │ │
│  │  • 用户 / Key / 额度 / 日志 / 渠道配置               │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                  🏭 AI 供应商（60+）                       │
│  OpenAI | Anthropic | Google Gemini | 智谱 GLM           │
│  阿里通义 | DeepSeek | Groq | xAI | 百度 | 讯飞          │
│  Kimi | MiniMax | 字节豆包 | Together | Fireworks | ...  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 模块划分

```
gflowx-router/
├── backend/                 # 后端（基于 New-API 二开）
│   ├── router/              # 🆕 智能路由引擎
│   │   ├── category.go      #    场景分类定义
│   │   ├── matcher.go       #    场景-模型映射
│   │   ├── strategy.go      #    路由策略（优先级/成本/延迟）
│   │   ├── health.go        #    渠道健康检查
│   │   └── fallback.go      #    自动降级逻辑
│   ├── relay/               # ✅ 格式适配（复用 New-API）
│   │   ├── openai/          #    OpenAI 格式
│   │   ├── claude/          #    Claude 格式
│   │   ├── gemini/          #    Gemini 格式
│   │   └── ...              #    其他供应商适配
│   ├── controller/          # ✅ API 控制器（复用 + 扩展）
│   ├── model/               # ✅ 数据模型（复用 + 扩展）
│   ├── middleware/           # 🔧 中间件（复用 + 新增）
│   └── main.go              # 入口
│
├── frontend/                # gflowx-router 全新管理端（Vite + React + Ant Design 脚手架）
│   ├── src/
│   │   ├── pages/           #    Home / Dashboard / Keys 占位路由
│   │   ├── App.tsx
│   │   └── ...
│   ├── vite.config.ts       #    开发代理 /api、/v1 → new-api :3000
│   └── package.json
│
├── docs/                    # 文档
├── config/                  # 配置文件
├── scripts/                 # 工具脚本
├── docker-compose.yml       # Docker 部署
└── Dockerfile
```

---

## 三、智能路由设计（核心）

### 3.1 场景分类体系

用户通过 `model` 字段传递场景标签，系统自动路由：

```json
// 用户请求
{
  "model": "smart",
  "messages": [{"role": "user", "content": "帮我分析这段代码"}]
}

// 系统自动路由到：Claude Sonnet → GPT-4o → GLM-5
```

#### 3.1.1 通用分类

| 分类标签 | 说明 | 后端模型池 | 计费倍率 |
|---------|------|-----------|---------|
| `smart` | 综合最强 | Claude Opus/Sonnet, GPT-4o, GLM-5 | 1.0x |
| `fast` | 极速响应 | Groq Llama, Qwen Flash, DeepSeek V3 | 0.2x |
| `cheap` | 经济实惠 | DeepSeek V3, Qwen, GLM-4-Flash | 0.1x |

#### 3.1.2 场景分类

| 分类标签 | 说明 | 后端模型池 | 计费倍率 |
|---------|------|-----------|---------|
| `code` | 代码开发 | Claude Sonnet, DeepSeek Coder, GPT-4o | 0.8x |
| `write` | 长文写作 | Claude Opus, Kimi, GPT-4o | 1.0x |
| `creative` | 创意脑暴 | Claude Opus, GPT-4o, GLM-5 | 1.0x |
| `vision` | 图片理解 | GPT-4o, Gemini Pro, Claude Sonnet | 1.0x |
| `image` | 图片生成 | Seedance, Sora, DALL-E 3, Flux | 1.5x |
| `video` | 视频生成 | Sora, Runway, Seedance | 2.0x |
| `translate` | 翻译 | DeepL, GPT-4o, DeepSeek | 0.3x |
| `embed` | 向量嵌入 | text-embedding-3, bge-large | 0.05x |
| `tts` | 语音合成 | ElevenLabs, Edge TTS, OpenAI TTS | 0.3x |
| `stt` | 语音识别 | Whisper, Deepgram, Qwen STT | 0.2x |

### 3.2 角色推荐方案

用户注册时选择身份，系统推荐对应套餐：

#### 💻 开发者套餐（Developer Pack）

```yaml
name: 开发者套餐
description: 写代码、调试、代码审查
categories:
  - code       # 代码开发（主力）
  - smart      # 复杂问题
  - fast       # 快速补全
  - vision     # 截图识码
  - embed      # 代码搜索
pricing:
  free: { code: 100次/天, fast: 500次/天 }
  pro:  { code: 无限, smart: 1000次/天, vision: 500次/天 }
```

#### ✍️ 创作者套餐（Creator Pack）

```yaml
name: 创作者套餐
description: 写作、设计、图片视频生成
categories:
  - write      # 长文写作（主力）
  - creative   # 创意脑暴
  - image      # 图片生成
  - video      # 视频生成
  - vision     # 参考图分析
pricing:
  free: { write: 50次/天, image: 10次/天 }
  pro:  { write: 无限, image: 100次/天, video: 20次/天 }
```

#### 🎓 学习套餐（Learner Pack）

```yaml
name: 学习套餐
description: 辅导、翻译、笔记整理
categories:
  - smart      # 辅导答疑
  - translate  # 翻译
  - fast       # 快速问答
  - tts        # 朗读
pricing:
  free: { fast: 300次/天, translate: 100次/天 }
  pro:  { smart: 500次/天, translate: 无限, tts: 200次/天 }
```

#### 📊 商务套餐（Business Pack）

```yaml
name: 商务套餐
description: 营销、分析、报告
categories:
  - smart      # 分析决策
  - write      # 报告撰写
  - translate  # 多语言
  - creative   # 营销创意
pricing:
  free: { fast: 200次/天 }
  pro:  { smart: 无限, write: 无限, translate: 无限 }
```

#### 🎨 设计师套餐（Designer Pack）

```yaml
name: 设计师套餐
description: 图片生成、风格设计、视觉创意
categories:
  - image      # 图片生成（主力）
  - vision     # 参考图分析
  - creative   # 创意发散
  - video      # 动态视频
pricing:
  free: { image: 20次/天, creative: 50次/天 }
  pro:  { image: 500次/天, video: 50次/天, creative: 无限 }
```

### 3.3 路由策略

```
用户请求 model="code"
        │
        ▼
┌───────────────────┐
│  1. 解析场景分类    │  code → 代码开发类
└────────┬──────────┘
         │
┌────────▼──────────┐
│  2. 查找模型池     │  [Claude Sonnet, DeepSeek Coder, GPT-4o, ...]
└────────┬──────────┘
         │
┌────────▼──────────┐
│  3. 健康检查       │  过滤掉不可用的渠道
└────────┬──────────┘
         │
┌────────▼──────────┐
│  4. 策略选择       │
│  ┌──────────────┐ │
│  │ 优先级策略    │ │  按预设优先级尝试
│  │ 成本策略     │ │  选最便宜的
│  │ 延迟策略     │ │  选最快的
│  │ 负载均衡     │ │  轮询分配
│  └──────────────┘ │
└────────┬──────────┘
         │
┌────────▼──────────┐
│  5. 额度检查       │  确认渠道有余额
└────────┬──────────┘
         │
┌────────▼──────────┐
│  6. 格式适配       │  转换为目标供应商格式
└────────┬──────────┘
         │
┌────────▼──────────┐
│  7. 发送请求       │  流式/非流式
└────────┬──────────┘
         │
    ┌────┴────┐
    │ 成功？   │
    ├─ Yes ──→ 返回结果 ✅
    └─ No ───→ 重试下一个模型 🔄（回到步骤 4）
```

#### 路由策略配置

```yaml
# config/router.yaml

categories:
  code:
    tier1:                    # 优先级最高
      - model: claude-sonnet
        weight: 50           # 权重 50%
        channels: [anthropic-main, anthropic-backup]
      - model: gpt-4o
        weight: 30
        channels: [openai-main]
    tier2:                    # 次选
      - model: deepseek-coder
        weight: 60
        channels: [deepseek-main]
      - model: qwen-coder
        weight: 40
        channels: [aliyun-main]
    tier3:                    # 兜底
      - model: glm-4-flash
        weight: 100
        channels: [zhipu-free]

  smart:
    tier1:
      - model: claude-opus
        weight: 40
      - model: gpt-4o
        weight: 40
      - model: glm-5
        weight: 20
    tier2:
      - model: deepseek-v3
        weight: 60
      - model: qwen-max
        weight: 40
    tier3:
      - model: glm-4-flash
        weight: 100

  image:
    tier1:
      - model: seedance
        weight: 40
      - model: sora
        weight: 30
      - model: dall-e-3
        weight: 30
    tier2:
      - model: flux-pro
        weight: 50
      - model: midjourney
        weight: 50

# 全局策略
strategy:
  health_check:
    enabled: true
    interval: 30s            # 每 30s 检查一次
    timeout: 5s              # 超时 5s 标记不可用
    recovery: 60s            # 60s 后重新尝试

  fallback:
    max_retries: 3           # 最多重试 3 次
    retry_delay: 0           # 无延迟（立即重试下一个）
    cross_tier: true         # 允许跨 Tier 降级

  rate_limit:
    per_key: 60/min          # 单 Key 限速
    per_category: 1000/min   # 单分类限速
```

### 3.4 高级模式

支持懂行的用户直接指定具体模型：

```json
// 场景标签模式（默认）
{"model": "smart", "messages": [...]}

// 高级模式（直接指定模型）
{"model": "claude-sonnet-4-20250514", "messages": [...]}

// 别名模式（简写）
{"model": "claude", "messages": [...]}     // → Claude Sonnet
{"model": "gpt4", "messages": [...]}       // → GPT-4o
{"model": "deepseek", "messages": [...]}   // → DeepSeek V3
```

---

## 四、前端设计

### 4.1 设计原则

1. **极简** — 不超过 3 个核心页面
2. **直觉** — 用户不需要看文档就能用
3. **干净** — 留白充足，信息密度低
4. **现代** — 参考 Vercel / Linear 的设计风格

### 4.2 页面规划

#### Page 1: 落地页 `/`

```
┌─────────────────────────────────────────────┐
│  gflowx-router              [登录] [注册]           │
├─────────────────────────────────────────────┤
│                                              │
│        AI 路由，简单到不像话                   │
│   不选模型，选场景。一个接口搞定所有 AI。       │
│                                              │
│        [ 🚀 开始使用 ]  [ 📖 文档 ]           │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  你主要用 AI 做什么？                         │
│                                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │💻 开发者 │ │✍️ 创作者 │ │📊 商务  │       │
│  │写代码调试│ │写作设计  │ │营销分析  │       │
│  └─────────┘ └─────────┘ └─────────┘       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │🎓 学习者 │ │🎨 设计师 │ │🔬 研究者│       │
│  │翻译笔记  │ │图片视频  │ │论文知识  │       │
│  └─────────┘ └─────────┘ └─────────┘       │
│                                              │
└─────────────────────────────────────────────┘
```

#### Page 2: 仪表盘 `/dashboard`

```
┌─────────────────────────────────────────────┐
│  gflowx-router   仪表盘   Key管理        [头像▼]    │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 今日调用  │ │ 本月费用  │ │ 剩余额度  │    │
│  │  1,234   │ │  ¥45.60  │ │  ¥120.00 │    │
│  │ ↑12%     │ │ ↓5%      │ │          │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                                              │
│  调用量趋势（近 7 天）                        │
│  ┌──────────────────────────────────────┐   │
│  │       ╱╲     ╱╲                      │   │
│  │     ╱    ╲ ╱    ╲   ╱╲              │   │
│  │   ╱            ╲╱    ╲╱             │   │
│  │  ╱                              ╱╲   │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  场景分布                                    │
│  ┌──────────────────────────────────────┐   │
│  │  💻 code    ████████████ 45%         │   │
│  │  🧠 smart   ██████      25%         │   │
│  │  ⚡ fast    ████        15%         │   │
│  │  👁 vision  ██          10%         │   │
│  │  ✍️ write   █            5%         │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  最近请求                                    │
│  ┌──────────────────────────────────────┐   │
│  │ code  │ Claude Sonnet │ 1.2K tokens  │   │
│  │ smart │ GPT-4o        │ 800 tokens   │   │
│  │ fast  │ DeepSeek V3   │ 500 tokens   │   │
│  └──────────────────────────────────────┘   │
│                                              │
└─────────────────────────────────────────────┘
```

#### Page 3: Key 管理 `/keys`

```
┌─────────────────────────────────────────────┐
│  gflowx-router   仪表盘   Key管理        [头像▼]    │
├─────────────────────────────────────────────┤
│                                              │
│  API Keys                     [ + 新建 Key ] │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ 🔑 sk-gflowx-xxxx...xxxx            │   │
│  │    套餐：💻 开发者                    │   │
│  │    额度：¥120.00 / ¥200.00           │   │
│  │    今日：234 次调用                   │   │
│  │    可用场景：code, smart, fast        │   │
│  │                        [复制] [设置] │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ 🔑 sk-gflowx-yyyy...yyyy            │   │
│  │    套餐：✍️ 创作者                    │   │
│  │    额度：¥80.00 / ¥150.00            │   │
│  │    今日：56 次调用                    │   │
│  │    可用场景：write, creative, image   │   │
│  │                        [复制] [设置] │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ──────────────────────────────────────      │
│                                              │
│  📖 接入方式                                 │
│                                              │
│  Base URL: https://api.gflowx.com/v1        │
│  API Key:  sk-gflowx-xxxx...xxxx            │
│                                              │
│  # 场景模式（推荐）                           │
│  model: "code"                               │
│  model: "smart"                              │
│  model: "fast"                               │
│                                              │
│  # 高级模式（可选）                           │
│  model: "claude-sonnet"                      │
│  model: "gpt-4o"                             │
│                                              │
└─────────────────────────────────────────────┘
```

### 4.3 设计风格参考

| 参考 | 取什么 |
|------|--------|
| **Vercel Dashboard** | 整体布局、卡片风格、黑白主色调 |
| **Linear** | 侧边导航、极简交互、动效 |
| **Stripe Dashboard** | 数据图表、统计卡片 |
| **Raycast** | 搜索框设计、快捷操作 |

### 4.4 配色方案

```
主色调：深黑 #0A0A0A / 纯白 #FFFFFF
强调色：靛蓝 #4F46E5（按钮/链接）
成功色：翠绿 #10B981
警告色：琥珀 #F59E0B
危险色：玫红 #EF4444
背景色：浅灰 #F9FAFB（亮色模式）/ #111111（暗色模式）
```

---

## 五、后端开发规范

### 5.1 基于 New-API 的改动范围

#### ✅ 复用（不改动）

| 模块 | 说明 |
|------|------|
| `relay/` | 格式适配层（OpenAI/Claude/Gemini/通义/智谱/百度...） |
| `model/` | 数据模型（用户/渠道/令牌/日志） |
| `controller/` 部分 | 基础 CRUD 控制器 |
| `middleware/` 部分 | 认证/限流/日志中间件 |
| `common/` | 工具函数 |
| `billing/` | Token 计费引擎 |

#### 🔧 修改（适配新功能）

| 模块 | 改动 |
|------|------|
| `router/` | **新增**智能路由引擎（核心） |
| `controller/` | 新增场景分类、角色推荐相关 API |
| `model/` | 新增场景分类表、角色配置表、套餐表 |
| `middleware/` | 新增场景解析中间件 |
| `web/` | **删除**原有前端，替换为新前端 |

#### ❌ 删除

| 模块 | 原因 |
|------|------|
| `web/classic/` | 旧前端，不要了 |
| `web/default/` | 旧前端，不要了 |
| Midjourney 相关 | 不需要（简化） |
| Suno 相关 | 不需要（简化） |

### 5.2 新增模块设计

#### 智能路由引擎 `router/`

```go
// router/category.go — 场景分类定义
package router

type Category struct {
    ID          string   `json:"id"`           // 分类标识：code, smart, write...
    Name        string   `json:"name"`          // 显示名：代码开发
    Icon        string   `json:"icon"`          // 图标
    Description string   `json:"description"`   // 描述
    Models      []ModelTier `json:"models"`     // 模型分级
    RateMultiplier float64 `json:"rate_multiplier"` // 计费倍率
}

type ModelTier struct {
    Tier     int      `json:"tier"`     // 1=优先, 2=次选, 3=兜底
    Models   []string `json:"models"`   // 模型列表
    Weights  []int    `json:"weights"`  // 权重（对应 Models）
}
```

```go
// router/matcher.go — 场景匹配
package router

// ResolveModel 解析用户请求的 model 字段
// 支持三种模式：
// 1. 场景标签："code" → 智能路由
// 2. 别名："claude" → 映射到具体模型
// 3. 具体模型："claude-sonnet-4-20250514" → 直接使用
func ResolveModel(modelName string) (*RouteResult, error)
```

```go
// router/strategy.go — 路由策略
package router

type Strategy interface {
    Select(candidates []Candidate) (*Candidate, error)
}

type PriorityStrategy struct{}  // 按优先级
type CostStrategy struct{}      // 按成本
type LatencyStrategy struct{}   // 按延迟
type RoundRobinStrategy struct{} // 轮询
```

```go
// router/health.go — 健康检查
package router

type HealthChecker struct {
    checks    map[string]*ChannelHealth
    interval  time.Duration
    timeout   time.Duration
}

type ChannelHealth struct {
    ChannelID  string
    Healthy    bool
    Latency    time.Duration
    LastCheck  time.Time
    FailCount  int
}
```

#### 数据库新增表

```sql
-- 场景分类表
CREATE TABLE categories (
    id          VARCHAR(32) PRIMARY KEY,    -- code, smart, write...
    name        VARCHAR(64) NOT NULL,
    icon        VARCHAR(16),
    description TEXT,
    rate_multiplier DECIMAL(10,2) DEFAULT 1.0,
    tier_config JSON,                       -- 模型分级配置
    enabled     BOOLEAN DEFAULT TRUE,
    created_at  DATETIME,
    updated_at  DATETIME
);

-- 角色套餐表
CREATE TABLE packs (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    key         VARCHAR(32) UNIQUE,          -- developer, creator, learner...
    name        VARCHAR(64) NOT NULL,
    description TEXT,
    icon        VARCHAR(16),
    categories  JSON,                        -- 包含的场景分类及额度
    pricing     JSON,                        -- 价格配置
    is_default  BOOLEAN DEFAULT FALSE,
    sort_order  INT DEFAULT 0,
    enabled     BOOLEAN DEFAULT TRUE,
    created_at  DATETIME,
    updated_at  DATETIME
);

-- 模型别名表
CREATE TABLE model_aliases (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    alias       VARCHAR(64) UNIQUE,          -- claude, gpt4, deepseek...
    model_id    VARCHAR(128) NOT NULL,       -- 映射到的具体模型
    category_id VARCHAR(32),                 -- 关联的分类
    enabled     BOOLEAN DEFAULT TRUE
);
```

### 5.3 API 设计（新增接口）

```
# 场景分类
GET    /api/categories              — 获取所有场景分类
GET    /api/categories/:id          — 获取分类详情（含模型池）

# 角色套餐
GET    /api/packs                   — 获取所有套餐
GET    /api/packs/:id               — 获取套餐详情
POST   /api/packs/recommend         — 根据身份推荐套餐

# Key 管理（扩展）
POST   /api/keys                    — 创建 Key（指定套餐）
GET    /api/keys/:id/usage          — 获取 Key 用量详情
GET    /api/keys/:id/categories     — 获取 Key 可用场景

# 路由（核心）
POST   /v1/chat/completions         — 聊天（支持场景标签作为 model）
POST   /v1/images/generations       — 图片生成
POST   /v1/embeddings               — 向量嵌入
POST   /v1/audio/speech             — 语音合成
POST   /v1/audio/transcriptions     — 语音识别
```

---

## 六、开发计划

### Phase 1: MVP（3-4 周）

**目标**：跑通核心流程

| 周次 | 任务 | 产出 |
|------|------|------|
| W1 | Fork New-API，清理不需要的模块 | 可编译运行的基础后端 |
| W1 | 新增场景分类表 + 种子数据 | 数据库迁移脚本 |
| W2 | 开发智能路由引擎 | router/ 模块 |
| W2 | 场景标签 → 模型路由跑通 | 基础路由功能 |
| W3 | 开发前端落地页 | 选身份 → 推荐 → 生成 Key |
| W3 | 开发前端仪表盘 | 用量统计展示 |
| W4 | Key 管理 + 接入文档页面 | 完整用户流程 |
| W4 | Docker 部署 + 测试 | 可部署的 MVP |

**MVP 验收标准**：
- [ ] 用户注册 → 选身份 → 获得推荐套餐 → 生成 Key
- [ ] 使用 Key 调用 `model="code"` 自动路由到最优代码模型
- [ ] 仪表盘展示调用量和费用
- [ ] Docker 一键部署

### Phase 2: 完善（2-3 周）

- [ ] 5 种角色套餐完善
- [ ] 健康检查 + 自动降级
- [ ] 充值系统（支付宝/Stripe）
- [ ] 高级模式（直接指定模型）
- [ ] 模型别名系统
- [ ] 管理后台（渠道管理/用户管理）

### Phase 3: 高级功能（持续）

- [ ] 延迟感知路由
- [ ] 成本优化策略
- [ ] 多租户 / 组织管理
- [ ] API 分析和报告
- [ ] Webhook / 事件通知
- [ ] Cloudflare Tunnel 支持

---

## 七、技术选型

| 层级 | 技术 | 理由 |
|------|------|------|
| 后端语言 | Go | 复用 New-API，性能好，单二进制 |
| 前端框架 | React 18 + Vite | 快、现代 |
| UI 库 | Ant Design 5 / shadcn-ui | 简洁好看 |
| 图表 | Recharts / Chart.js | 轻量够用 |
| 数据库 | MySQL 8（生产）/ SQLite（开发） | 复用 New-API |
| 缓存 | Redis（可选） | 提升路由性能 |
| 部署 | Docker + Docker Compose | 一键部署 |
| CI/CD | GitHub Actions | 自动化 |

---

## 八、部署方案

### Docker Compose（推荐）

```yaml
# docker-compose.yml
version: '3.8'

services:
  gflowx:
    build: .
    container_name: gflowx-router
    restart: always
    ports:
      - "3000:3000"
    environment:
      - TZ=Asia/Shanghai
      - SQL_DSN=root:${DB_PASSWORD}@tcp(mysql:3306)/gflowx?charset=utf8mb4&parseTime=True
      - REDIS_CONN_STRING=redis://redis:6379
      - SESSION_SECRET=${SESSION_SECRET}
    depends_on:
      - mysql
      - redis
    volumes:
      - ./data/uploads:/data/uploads

  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: gflowx
    volumes:
      - ./data/mysql:/var/lib/mysql

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - ./data/redis:/data
```

### 环境变量

```bash
# 必需
SQL_DSN=root:password@tcp(localhost:3306)/gflowx
SESSION_SECRET=your-secret-key

# 可选
REDIS_CONN_STRING=redis://localhost:6379
PORT=3000
SYNC_FREQUENCY=60
NODE_TYPE=master

# gflowx-router 自定义
GFLOWX_DEFAULT_PACK=developer        # 默认套餐
GFLOWX_HEALTH_CHECK=true             # 健康检查
GFLOWX_FALLBACK_ENABLED=true         # 自动降级
GFLOWX_ADVANCED_MODE=true            # 高级模式（直接指定模型）
```

---

## 九、竞品参考

| 项目 | Stars | 值得学习 |
|------|-------|---------|
| [New-API](https://github.com/QuantumNous/new-api) | 32K+ | 渠道管理、格式适配、计费引擎（底层基座） |
| [One-API](https://github.com/songquanpeng/one-api) | 33K+ | 多机部署、稳定性、社区生态 |
| [One-Hub](https://github.com/MartialBE/one-hub) | 2.8K+ | UI 设计（Berry Admin）、仪表盘 |
| [9Router](https://9router.com) | — | 场景化路由思路、3 层分级、用户分类 |

---

_最后更新：2026-05-12_
