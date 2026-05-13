import { ConfigProvider, Layout, Menu, Typography, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Keys from './pages/Keys'

const { Header, Content } = Layout

function Shell() {
  const loc = useLocation()
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
          ]}
        />
      </Header>
      <Content style={{ padding: 24, background: '#f5f5f5' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/keys" element={<Keys />} />
        </Routes>
      </Content>
    </Layout>
  )
}

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={{ algorithm: theme.defaultAlgorithm }}>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </ConfigProvider>
  )
}
