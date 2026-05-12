# GFlowX Router — 前端设计规范

> 极简、现代、直觉

---

## 1. 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18 | UI 框架 |
| Vite | 6 | 构建工具 |
| Ant Design | 5 | UI 组件库 |
| Tailwind CSS | 4 | 原子样式 |
| Recharts | 2 | 图表 |
| Zustand | 5 | 状态管理 |
| React Router | 7 | 路由 |
| Axios | 1 | HTTP 客户端 |

## 2. 页面列表

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 落地页 | 选身份 → 推荐套餐 → 注册 |
| `/dashboard` | 仪表盘 | 用量/费用/统计 |
| `/keys` | Key 管理 | 创建/管理 API Key |
| `/docs` | 接入文档 | 如何使用（可选） |

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

---

_最后更新：2026-05-12_
