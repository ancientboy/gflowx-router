import { ConfigProvider, Layout, Menu, Typography, theme, Button, Space } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import AuthBootstrap from './components/AuthBootstrap'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Keys from './pages/Keys'
import Login from './pages/Login'
import { useAuthStore } from './store/authStore'

const { Header, Content } = Layout

function Shell() {
  const loc = useLocation()
  const nav = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', paddingInline: 16 }}>
        <Typography.Text strong style={{ color: '#fff', marginRight: 24 }}>
          GFlowX
        </Typography.Text>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[loc.pathname === '/' ? '/' : loc.pathname]}
          style={{ flex: 1, minWidth: 0, borderBottom: 'none' }}
          items={[
            { key: '/', label: <Link to="/">首页</Link> },
            { key: '/dashboard', label: <Link to="/dashboard">仪表盘</Link> },
            { key: '/keys', label: <Link to="/keys">密钥</Link> },
            { key: '/login', label: <Link to="/login">登录</Link> },
          ]}
        />
        {user ? (
          <Space>
            <Typography.Text style={{ color: '#fff' }}>{user.username}</Typography.Text>
            <Button
              size="small"
              onClick={async () => {
                await logout()
                nav('/login')
              }}
            >
              退出
            </Button>
          </Space>
        ) : null}
      </Header>
      <Content style={{ padding: 24, background: '#f5f5f5' }}>
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
  return (
    <ConfigProvider locale={zhCN} theme={{ algorithm: theme.defaultAlgorithm }}>
      <BrowserRouter>
        <AuthBootstrap />
        <Shell />
      </BrowserRouter>
    </ConfigProvider>
  )
}
