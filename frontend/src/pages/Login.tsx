import { Alert, Button, Card, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const login = useAuthStore((s) => s.login)
  const user = useAuthStore((s) => s.user)
  const ready = useAuthStore((s) => s.ready)
  const error = useAuthStore((s) => s.error)
  const clearError = useAuthStore((s) => s.clearError)
  const [submitting, setSubmitting] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()
  const from = (loc.state as { from?: string } | null)?.from || '/dashboard'

  if (ready && user) {
    return <Navigate to={from} replace />
  }

  return (
    <div style={{ maxWidth: 400, margin: '64px auto' }}>
      <Card
        className="gflow-card"
        title={<Typography.Title level={4} className="gflow-page-title">登录 GFlowX 控制台</Typography.Title>}
      >
        <Typography.Paragraph type="secondary">
          使用与 new-api 相同的账号密码（会话 Cookie 经 Vite 代理写入当前域名）。
        </Typography.Paragraph>
        {error ? (
          <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} closable onClose={clearError} />
        ) : null}
        <Form
          layout="vertical"
          onFinish={async (v: { username: string; password: string }) => {
            setSubmitting(true)
            clearError()
            try {
              const r = await login(v.username, v.password)
              if (!r.require2fa) {
                nav(from, { replace: true })
              }
            } finally {
              setSubmitting(false)
            }
          }}
        >
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            登录
          </Button>
        </Form>
        <Typography.Paragraph style={{ marginTop: 16 }}>
          <Link to="/">返回首页</Link>
        </Typography.Paragraph>
      </Card>
    </div>
  )
}
