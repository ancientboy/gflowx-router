import { Alert, Button, Card, Form, Input, Typography, message } from 'antd'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { login } from '../api/session'
import { useAuthStore } from '../store/authStore'

const { Paragraph } = Typography

export default function Login() {
  const nav = useNavigate()
  const loc = useLocation()
  const from = (loc.state as { from?: string } | null)?.from || '/dashboard'
  const setUser = useAuthStore((s) => s.setUser)
  const [loading, setLoading] = useState(false)

  return (
    <Card title="登录">
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="与 new-api 共用账号"
        description="提交后请求本站的 /api/user/login（开发环境由 Vite 代理到 VITE_DEV_PROXY_TARGET，默认 http://127.0.0.1:3000）。请先在 new-api 完成安装向导或已存在用户；通过 trycloudflare 访问时，new-api 必须与 Vite 跑在同一台机器上代理才生效。"
      />
      <Paragraph type="secondary">
        还没有账号？在部署方开启注册时，可打开 new-api 控制台注册页，或使用仓库脚本 <Typography.Text code>./scripts/register-test-user.sh</Typography.Text> /{' '}
        <Typography.Text code>./scripts/insert-test-user-db.sh</Typography.Text>。
      </Paragraph>
      <Form
        layout="vertical"
        onFinish={async (v: { username: string; password: string }) => {
          setLoading(true)
          try {
            const r = await login(v.username, v.password)
            if (!r.success) {
              message.error(r.message || '登录失败')
              return
            }
            const d = r.data
            if (d && 'require_2fa' in d && d.require_2fa) {
              message.warning('该账号开启了两步验证，请改用 new-api 默认 Web 完成 2FA 登录。')
              return
            }
            if (d && typeof d.id === 'number') {
              setUser({
                id: d.id,
                username: d.username,
                display_name: d.display_name,
                role: d.role,
                status: d.status,
                group: d.group,
              })
              message.success('登录成功')
              nav(from, { replace: true })
            } else {
              message.error('响应异常')
            }
          } catch (e) {
            message.error(e instanceof Error ? e.message : '网络错误（请确认 new-api 已启动且代理可达）')
          } finally {
            setLoading(false)
          }
        }}
      >
        <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input autoComplete="username" />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          登录
        </Button>
      </Form>
      <Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
        <Link to="/">← 返回用户向首页</Link>
      </Paragraph>
    </Card>
  )
}
