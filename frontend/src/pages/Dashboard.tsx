import { Card, Descriptions, Spin, Alert } from 'antd'
import { useEffect, useState } from 'react'
import * as authApi from '../api/auth'
import type { UserSelf } from '../api/types'

export default function Dashboard() {
  const [user, setUser] = useState<UserSelf | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const u = await authApi.fetchSelf()
        if (!cancelled) setUser(u)
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

  if (loading) {
    return (
      <Card title="仪表盘">
        <Spin />
      </Card>
    )
  }

  if (err || !user) {
    return (
      <Card title="仪表盘">
        <Alert type="error" message={err || '无用户数据'} showIcon />
      </Card>
    )
  }

  const remain = user.quota - user.used_quota

  return (
    <Card title="仪表盘">
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
        <Descriptions.Item label="显示名">{user.display_name || '—'}</Descriptions.Item>
        <Descriptions.Item label="分组">{user.group || '—'}</Descriptions.Item>
        <Descriptions.Item label="角色">{user.role}</Descriptions.Item>
        <Descriptions.Item label="总额度">{user.quota}</Descriptions.Item>
        <Descriptions.Item label="已用额度">{user.used_quota}</Descriptions.Item>
        <Descriptions.Item label="剩余额度">{remain}</Descriptions.Item>
        <Descriptions.Item label="请求次数">{user.request_count}</Descriptions.Item>
      </Descriptions>
    </Card>
  )
}
