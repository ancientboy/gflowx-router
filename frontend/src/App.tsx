import {
  Button,
  ConfigProvider,
  Layout,
  Menu,
  Segmented,
  Space,
  Typography,
  theme,
} from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { trackPageView } from './analytics'
import './App.css'
import AuthBootstrap from './components/AuthBootstrap'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Keys from './pages/Keys'
import Login from './pages/Login'
import { BRAND_NAME } from './brand'
import { useAuthStore } from './store/authStore'
import { type ThemeMode, useThemeStore } from './store/themeStore'

const { Header, Content } = Layout

function Shell() {
  const loc = useLocation()
  const nav = useNavigate()
  const user = useAuthStore((s) => s.user)
  const ready = useAuthStore((s) => s.ready)
  const logout = useAuthStore((s) => s.logout)
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)

  const isDark = mode === 'dark'
  const isLanding = loc.pathname === '/'

  useEffect(() => {
    document.documentElement.dataset.theme = mode
  }, [mode])

  useEffect(() => {
    trackPageView(loc.pathname + loc.search)
  }, [loc.pathname, loc.search])

  const menuItems = isLanding
    ? [
        { key: '/', label: <Link to="/">首页</Link> },
        { key: 'scenes', label: <a href="#landing-scenes">场景与能力</a> },
        { key: 'how', label: <a href="#landing-how">如何使用</a> },
        { key: 'faq', label: <a href="#landing-faq">常见问题</a> },
        { key: 'pricing', label: <a href="#landing-pricing">套餐与开通</a> },
        ...(ready && user
          ? [
              { key: '/dashboard', label: <Link to="/dashboard">控制台</Link> },
              { key: '/keys', label: <Link to="/keys">密钥</Link> },
            ]
          : []),
        ...(ready && user ? [] : [{ key: '/login', label: <Link to="/login">登录</Link> }]),
      ]
    : [
        { key: '/', label: <Link to="/">首页</Link> },
        { key: '/dashboard', label: <Link to="/dashboard">仪表盘</Link> },
        { key: '/keys', label: <Link to="/keys">密钥</Link> },
        { key: '/login', label: <Link to="/login">登录</Link> },
      ]

  return (
    <Layout className="gflow-shell" style={{ minHeight: '100vh' }}>
      <a href="#main-content" className="skip-link">
        跳到主内容
      </a>
      <Header className="gflow-header">
        <Typography.Text strong className="gflow-brand" style={{ fontFamily: 'var(--mono, monospace)' }}>
          <Link to="/" style={{ color: 'inherit' }}>
            {BRAND_NAME}
          </Link>
        </Typography.Text>
        <Menu
          theme={isDark ? 'dark' : 'light'}
          mode="horizontal"
          selectedKeys={[loc.pathname]}
          className="gflow-nav"
          items={menuItems}
        />
        <Space size="middle" className="gflow-header-actions">
          <Segmented<ThemeMode>
            size="small"
            value={mode}
            onChange={setMode}
            options={[
              { label: '浅色', value: 'light' },
              { label: '深色', value: 'dark' },
            ]}
          />
          {user ? (
            <Space>
              <Typography.Text className="gflow-header-user">{user.username}</Typography.Text>
              <Button
                size="small"
                type="primary"
                onClick={async () => {
                  await logout()
                  nav('/login')
                }}
              >
                退出
              </Button>
            </Space>
          ) : null}
        </Space>
      </Header>
      <Content className={isLanding ? 'gflow-content gflow-content--landing' : 'gflow-content'}>
        <main id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/keys"
              element={
                <ProtectedRoute>
                  <Keys />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </Content>
    </Layout>
  )
}

export default function App() {
  const mode = useThemeStore((s) => s.mode)
  const algorithm = mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm,
        token: {
          colorPrimary: '#4F46E5',
          colorInfo: '#4F46E5',
          borderRadiusLG: 12,
          borderRadius: 8,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        },
      }}
    >
      <BrowserRouter>
        <AuthBootstrap />
        <Shell />
      </BrowserRouter>
    </ConfigProvider>
  )
}
