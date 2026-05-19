import { Button } from 'antd'
import { Link, Outlet, useNavigate } from 'react-router-dom'

import { logout } from '../api/session'
import { BRAND_NAME } from '../brand'
import { useAuthStore } from '../store/authStore'
import './console-shell.css'

export function ConsoleLayout() {
  const nav = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clear = useAuthStore((s) => s.clear)

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
          {user ? (
            <>
              <span className="console-user-name">{user.username}</span>
              <Button
                type="link"
                className="console-nav-btn"
                onClick={async () => {
                  try {
                    await logout()
                  } catch {
                    /* ignore */
                  }
                  clear()
                  nav('/login')
                }}
              >
                退出
              </Button>
            </>
          ) : (
            <Link to="/login">登录</Link>
          )}
        </nav>
      </header>
      <main className="console-main">
        <Outlet />
      </main>
    </div>
  )
}
