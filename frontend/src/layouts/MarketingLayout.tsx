import { Button, Space } from 'antd'
import { Link, Outlet } from 'react-router-dom'
import { BRAND_NAME } from '../brand'
import './marketing-shell.css'

export function MarketingLayout() {
  return (
    <div className="marketing-site">
      <header className="marketing-header">
        <Link to="/" className="marketing-brand">
          {BRAND_NAME}
        </Link>
        <span style={{ color: '#5b6f92', fontSize: 12, letterSpacing: '0.06em' }}>用户向首页</span>
        <nav className="marketing-nav" aria-label="页面内锚点">
          <a href="#m-hero">首屏</a>
          <a href="#m-scenes">场景</a>
          <a href="#m-mgmt">场景管理</a>
          <a href="#m-cta">接入</a>
        </nav>
        <Space className="marketing-nav-cta" size="small">
          <Link to="/login">
            <Button type="primary" size="middle">
              登录控制台
            </Button>
          </Link>
        </Space>
      </header>
      <div className="marketing-main">
        <Outlet />
      </div>
    </div>
  )
}
