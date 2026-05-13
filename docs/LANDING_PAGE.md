# gflowx-router — 产品落地页规划设计

> 目标：未登录访客 **30 秒内理解价值**；开发者 **1 分钟内知道怎么接 API**；与 `docs/FRONTEND.md`、`docs/DEVELOPMENT.md` §4.2 线框对齐。

---

## 1. 目标与受众

| 受众 | 诉求 | 落地页回应 |
|------|------|------------|
| 个人开发者 | 不想研究模型列表 | 「场景标签」+ 示例请求 |
| 团队 / 运维 | 要稳定、可观测 | 健康/池降级说明 + 可选服务状态 |
| 决策者 | 成本与可控 | 对比区 + FAQ 计费说明（与 new-api 能力一致处） |

**非目标（本页不做）**：完整注册/支付流程、控制台内渠道配置（仍在 new-api 或后续管理端）。

---

## 2. 信息架构与路由

| 路径 | 说明 |
|------|------|
| **`/`** | 产品落地页（本文范围） |
| **`/login`** | 登录（已有） |
| **`/dashboard`、`/keys`** | 登录后控制台（已有；从落地页 CTA 进入） |

**首屏导航（仅 `/`）**：品牌 → 锚点「场景与能力」「如何使用」「常见问题」→ 登录；已登录时增加「进入控制台」。

**锚点 ID 约定**（便于 Header 链接与滚动）：

- `#landing-scenes` — 场景卡片区  
- `#landing-how` — 三步接入  
- `#landing-faq` — FAQ  
- `#landing-status` — 可选公开状态（`/api/status`）

---

## 3. 区块设计（自上而下）

### 3.1 Hero（首屏）

- **主标题**：一句话价值（不选模型，选场景）。  
- **副标题**：兼容 OpenAI 客户端、`model` 传场景标签即可。  
- **主 CTA**：`登录`（`/login`）；**次 CTA**：已登录则 `进入控制台`（`/dashboard`），未登录可「查看场景」滚动至 `#landing-scenes`。  
- **视觉**：全宽背景、与主题色 `#4F46E5` 呼应的轻渐变或网格纹理（暗色模式对比度 WCAG 注意）。

### 3.2 对比条（传统 vs gflowx-router）

- 两列或三卡片：**选模型** vs **选场景**；可选第三张 **路由层兜底**（池/健康，链接 `docs/ROUTER.md`）。

### 3.3 场景与能力（核心差异化）

- **场景卡片网格**：与 `docs/API.md` 一致的标签（`code` / `smart` / `fast` …），每张：名称、一句说明、**查看示例**（Modal：`model` + 最小 JSON + `curl` 可复制）。  
- **别名提示**：一句 + 链到 `docs/API.md` 或站内锚点 FAQ。

### 3.4 如何使用（三步）

1. 在 new-api 管理端配置渠道与额度（外链说明文案即可）。  
2. 创建 API Key。  
3. 客户端 `baseURL` 指向网关，`model` 填场景标签。

### 3.5 FAQ（折叠面板）

建议 4～6 条：场景与具体模型关系、关闭场景路由 env、别名、与官方 Web 关系、AGPL 提示（链 `LICENSE`）。

### 3.6 页脚

- 文档链接：`docs/API.md`、`docs/ROUTER.md`（仓库内相对路径在页面上写「见仓库文档」或 GitHub raw 视你们托管方式）。  
- **公开状态**：折叠区或锚点 `#landing-status`，请求失败时友好提示（不打断首屏）。

---

## 4. 与现有前端的关系

- 落地页组件建议目录：`frontend/src/pages/landing/`，`Home.tsx` 仅 re-export `LandingPage`，便于维护。  
- **全局 Shell**：在 `pathname === '/'` 时使用「营销型」顶栏；其余路由保持原管理端顶栏。  
- **样式**：复用 `index.css` 变量与 `gflow-card`；落地专有样式放 `landing.css`。

---

## 5. 响应式与无障碍

- **断点**：与 `docs/FRONTEND.md` §5 一致；场景区手机单列。  
- **键盘**：Modal 可 Esc 关闭；锚点跳转后可用 `scroll-margin-top` 避免被 fixed Header 遮挡。  
- **语义**：每区用 `<section aria-labelledby="...">`。

---

## 6. 分阶段任务清单（与 `docs/WORK_PLAN.md` 阶段 E 对应）

| 编号 | 内容 | 验收标准 |
|------|------|----------|
| **E1** | 文档与设计锚点 | 本文入仓；`WORK_PLAN` 阶段 E 建立 |
| **E2** | 路由级 Shell 区分 | `/` 营销顶栏；其它页原管理导航 |
| **E3** | Hero + CTA | 主副标题、双按钮、暗色可读 |
| **E4** | 对比区 | 2～3 卡片，文案定稿 |
| **E5** | 场景区 + Modal | 与 API 文档标签一致；可复制示例 |
| **E6** | 三步接入 | 静态步骤 + 外链说明占位 |
| **E7** | FAQ | `Collapse` ≥4 条 |
| **E8** | 页脚 + 状态区 | 折叠 `/api/status`；失败不崩 |
| **E9** | SEO 基础 | `index.html`：`lang=zh-CN`、`meta description`、加长 `title`（`og:image` 等归 E10） |
| **E10** | 打磨 | 文案审校、懒加载重块、Lighthouse 基础项 |

**依赖后端**：仅 E8 的 `/api/status`（已有）；其余均为静态或可配置文案。

### 6.1 实现同步（仓库当前）

- **代码**：`frontend/src/pages/landing/` + `Home.tsx` 聚合；`App.tsx` 在 `/` 切换营销导航；样式 `landing.css`；`index.html` 已含中文 `description`。  
- **任务勾选**：以 `docs/WORK_PLAN.md` **阶段 E** 为准；E10 仍为待办。

---

_文档版本：v1 · 与实现同步时请更新本页「已实现」勾选项（可在 WORK_PLAN 阶段 E 打 `[x]`）。_
