import { Card, Typography, Alert, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPublicStatus } from '../api/status'
import { useAuthStore } from '../store/authStore'

export default function Home() {
  const user = useAuthStore((s) => s.user)
  const ready = useAuthStore((s) => s.ready)
  const [status, setStatus] = useState<unknown>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const s = await fetchPublicStatus()
        if (!cancelled) setStatus(s)
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : '加载失败')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Card title="GFlowX Router">
      <Typography.Paragraph>
        全新管理端（与 new-api 自带 Web 分离）。开发命令：{' '}
        <Typography.Text code>cd frontend && npm run dev</Typography.Text>；接口经 Vite 代理到{' '}
        <Typography.Text code>127.0.0.1:3000</Typography.Text>。
      </Typography.Paragraph>
      <Typography.Paragraph>
        场景标签路由见仓库 <Typography.Text code>docs/ROUTER.md</Typography.Text> §7 与{' '}
        <Typography.Text code>docs/WORK_PLAN.md</Typography.Text>。
      </Typography.Paragraph>
      {ready && user ? (
        <Typography.Paragraph>
          已登录为 <Typography.Text strong>{user.username}</Typography.Text>，可进入{' '}
          <Link to="/dashboard">仪表盘</Link> 或 <Link to="/keys">密钥</Link>。
        </Typography.Paragraph>
      ) : ready ? (
        <Typography.Paragraph>
          未检测到会话，请先 <Link to="/login">登录</Link>。
        </Typography.Paragraph>
      ) : null}
      <Typography.Title level={5}>服务状态（公开）</Typography.Title>
      {loading ? <Spin /> : null}
      {err ? <Alert type="warning" message={err} showIcon style={{ marginTop: 8 }} /> : null}
      {!loading && !err && status != null ? (
        <pre style={{ background: '#fff', padding: 12, borderRadius: 8, maxHeight: 320, overflow: 'auto' }}>
          {JSON.stringify(status, null, 2)}
        </pre>
      ) : null}
    </Card>
  )
}
