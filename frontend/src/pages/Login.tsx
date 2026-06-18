import { Alert, Button, Card, Form, Input, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { BRAND_NAME } from '../brand'
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

  const landingHint = useMemo(() => {
    const q = new URLSearchParams(loc.search)
    if (q.get('from') !== 'landing') return null
    const plan = q.get('plan')
    const labels: Record<string, string> = {
      solo: '个人体验',
      team: '团队协作',
      enterprise: '企业定制',
    }
    const name = plan && labels[plan] ? labels[plan] : '套餐与开通'
    return `你来自落地页「${name}」。账号通常由部署方在 new-api 后台创建；若已开放自助注册，请使用部署方提供的注册入口。`
  }, [loc.search])

  if (ready && user) {
    return <Navigate to={from} replace />
  }

  return (
    <div style={{ maxWidth: 400, margin: '64px auto' }}>
      <Card
        className="gflow-card"
        title={
          <Typography.Title level={4} className="gflow-page-title">
            登录 {BRAND_NAME}
          </Typography.Title>
        }
      >
        <Typography.Paragraph type="secondary">
          使用与 new-api 相同的账号密码（会话 Cookie 经 Vite 代理写入当前域名）。
        </Typography.Paragraph>
        {landingHint ? (
          <Alert type="info" message={landingHint} showIcon style={{ marginBottom: 16 }} />
        ) : null}
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
