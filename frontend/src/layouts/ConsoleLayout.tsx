import { Outlet, Link } from 'react-router-dom'
import { BRAND_NAME } from '../brand'
import './console-shell.css'

export function ConsoleLayout() {
  return (
    <div className="console-shell">
      <header className="console-header">
        <Link to="/" className="console-brand">
          {BRAND_NAME}
        </Link>
        <span style={{ color: '#9ca3af', fontSize: 12 }}>控制台</span>
        <nav className="console-nav" aria-label="控制台导航">
          <Link to="/dashboard">仪表盘</Link>
          <Link to="/keys">密钥</Link>
          <Link to="/login">登录</Link>
        </nav>
      </header>
      <main className="console-main">
        <Outlet />
      </main>
    </div>
  )
}
