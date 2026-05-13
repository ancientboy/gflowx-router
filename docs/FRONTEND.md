# gflowx-router — 前端设计规范

> 极简、现代、直觉

---

## 1. 技术栈

| 技术 | 版本（以 `frontend/package.json` 为准） | 用途 |
|------|------|------|
| React | 19 | UI 框架 |
| Vite | 8 | 构建工具 |
| Ant Design | 6 | UI 组件库 |
| Tailwind CSS | 4 | 原子样式（规范内；**工程尚未接入**，后续可加） |
| Recharts | 2 | 图表（规范内；**尚未接入**） |
| Zustand | 5 | 状态管理 |
| React Router | 7 | 路由 |
| Axios | 1 | HTTP 客户端 |

## 2. 页面列表

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 产品落地页 | Hero、对比、场景卡+示例 Modal、三步接入、FAQ、页脚与折叠状态（**尚未**：选身份→套餐→注册 营销闭环，见 `docs/LANDING_PAGE.md`） |
| `/login` | 登录 | `POST /api/user/login`，Cookie 会话 |
| `/dashboard` | 仪表盘 | `GET /api/user/self`：用户名、分组、额度等 |
| `/keys` | 密钥列表 | `GET /api/token/` 分页表格 |
| `/docs` | 接入文档 | **未实现**（路由未挂载） |

## 3. 设计风格

### 参考对象

- **Vercel** — 整体布局、暗色主题、卡片风格
- **Linear** — 极简交互、流畅动效
- **Stripe** — 数据展示、统计卡片

### 配色

```css
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-card: #FFFFFF;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --border: #E5E7EB;
  --accent: #4F46E5;       /* 靛蓝 */
  --accent-hover: #4338CA;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
}

[data-theme="dark"] {
  --bg-primary: #0A0A0A;
  --bg-secondary: #111111;
  --bg-card: #1A1A1A;
  --text-primary: #F9FAFB;
  --text-secondary: #9CA3AF;
  --border: #262626;
}
```

### 字体

```
标题：Inter / -apple-system
正文：Inter / -apple-system
代码：JetBrains Mono
```

### 间距

```
页面边距：24px（移动端 16px）
卡片间距：16px
卡片圆角：12px
按钮圆角：8px
```

## 4. 组件规范

### 卡片

```
白底 / 暗色模式下 #1A1A1A
12px 圆角
1px 边框 #E5E7EB / #262626
16px 内边距
hover 时轻微阴影
```

### 按钮

```
主要按钮：靛蓝底 #4F46E5 + 白字
次要按钮：透明底 + 靛蓝边框
危险按钮：红底 #EF4444 + 白字
高度：36px（默认）/ 40px（大号）
圆角：8px
```

### 数据展示

```
数字：大号加粗（32px/700）
标签：小号大写（12px/600）
趋势：绿色 ↑ / 红色 ↓
```

## 5. 响应式

```
桌面：≥ 1024px（3 列布局）
平板：≥ 768px（2 列布局）
手机：< 768px（单列布局）
```

## 6. 管理端（`frontend/`）已实现清单（相对本规范）

**按需求扩展管理后台**时，以 **[`ADMIN_SPEC.md`](ADMIN_SPEC.md)** 为产品规格与 **new-api 接口映射** 主文档，并以 **`docs/WORK_PLAN.md` 阶段 F** 为任务勾选来源（F1 起逐项实现）。

以下为 **当前代码已实现** 的能力，便于与 §2 设计稿对照；未列项表示仍为规划或 P1。

| 类别 | 已实现 |
|------|--------|
| **品牌** | 对外展示名 **`gflowx-router`**（`src/brand.ts`）；顶栏、首页/登录标题、浏览器 `<title>` 一致 |
| **布局** | 顶栏导航 + 内容区；响应式边距（见 `App.css` / `index.css`） |
| **路由** | `/`、`/login`、`/dashboard`、`/keys`；`/dashboard` 与 `/keys` 需登录（`ProtectedRoute`） |
| **鉴权** | 应用启动 `AuthBootstrap` 拉取会话；`POST /api/user/login`、`/api/user/logout`；Zustand `authStore` |
| **HTTP** | Axios 实例 `withCredentials: true`；`VITE_API_BASE_URL`；Vite 开发代理 `/api`、`/v1` → new-api |
| **SEO / 分享** | `index.html` 含 `og:*` / `twitter:*`；`VITE_SITE_URL` 存在时 `og:image` 为该源下的 `/og-image.svg`；否则构建期回退到 `raw.githubusercontent.com` 上的仓库内 SVG |
| **埋点** | 可选 `VITE_GA_MEASUREMENT_ID`（GA4）；`src/analytics.ts` + 路由变更 `page_view` |
| **主题** | 浅色 / 深色切换（`themeStore` + `ConfigProvider` algorithm）；CSS 变量对齐 §3 配色与圆角；Ant Design `token`（主色 `#4F46E5`、圆角等） |
| **组件** | 首页 / 登录 / 仪表盘 / 密钥页使用统一 **`gflow-card`** 卡片样式（§4 卡片规范的部分落地） |
| **数据** | 落地页页脚折叠 `GET /api/status`；仪表盘 `Descriptions`；密钥 `Table` 分页 |
| **落地页** | 见 `docs/LANDING_PAGE.md` 与 `frontend/src/pages/landing/*`（阶段 E 含 E10：套餐 CTA、懒加载、主内容 `<main>`、跳过链接、社交 meta、可选 GA4） |

**尚未实现（相对 §2 / §4）**：见 **`ADMIN_SPEC.md`** 分期 **F1–F5**（含密钥新建/编辑、订阅与模型列表、用量日志、Admin 分区、gflowx 配置面等）；另含 `/docs` 路由、Recharts 图表、Tailwind 原子类工程化、独立 Logo 资产等工程项。

---

_最后更新：2026-05-12_
