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
  const logout = useAuthStore((s) => s.logout)
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)

  const isDark = mode === 'dark'

  useEffect(() => {
    document.documentElement.dataset.theme = mode
  }, [mode])

  return (
    <Layout className="gflow-shell" style={{ minHeight: '100vh' }}>
      <Header className="gflow-header">
        <Typography.Text strong className="gflow-brand" style={{ fontFamily: 'var(--mono, monospace)' }}>
          {BRAND_NAME}
        </Typography.Text>
        <Menu
          theme={isDark ? 'dark' : 'light'}
          mode="horizontal"
          selectedKeys={[loc.pathname === '/' ? '/' : loc.pathname]}
          className="gflow-nav"
          items={[
            { key: '/', label: <Link to="/">首页</Link> },
            { key: '/dashboard', label: <Link to="/dashboard">仪表盘</Link> },
            { key: '/keys', label: <Link to="/keys">密钥</Link> },
            { key: '/login', label: <Link to="/login">登录</Link> },
          ]}
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
      <Content className="gflow-content">
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
