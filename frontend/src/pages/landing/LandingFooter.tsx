import { startTransition, useEffect, useState } from 'react'
import { Collapse, Spin, Typography } from 'antd'
import { fetchPublicStatus } from '../../api/status'

const { Paragraph, Text, Title } = Typography

export function LandingFooter() {
  const [status, setStatus] = useState<unknown>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    startTransition(() => {
      if (!cancelled) setLoading(true)
    })
    fetchPublicStatus()
      .then((s) => {
        if (!cancelled) setStatus(s)
      })
      .catch((e: unknown) => {
        if (!cancelled) setErr(e instanceof Error ? e.message : '无法获取状态')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <footer className="landing-footer" id="landing-footer">
      <div className="landing-inner">
        <Paragraph>
          <Text type="secondary">文档：</Text>
          <a href="https://github.com/ancientboy/gflowx-router/blob/main/docs/API.md" target="_blank" rel="noreferrer">
            API 说明
          </a>
          <Text type="secondary"> · </Text>
          <a href="https://github.com/ancientboy/gflowx-router/blob/main/docs/ROUTER.md" target="_blank" rel="noreferrer">
            路由引擎
          </a>
          <Text type="secondary"> · </Text>
          <a href="https://github.com/ancientboy/gflowx-router/blob/main/docs/LANDING_PAGE.md" target="_blank" rel="noreferrer">
            落地页规划
          </a>
        </Paragraph>
        <Collapse ghost className="landing-status-collapse">
          <Collapse.Panel header="公开服务状态（GET /api/status）" key="status" id="landing-status">
            {loading ? <Spin /> : null}
            {err ? <Paragraph type="warning">{err}</Paragraph> : null}
            {!loading && !err && status != null ? (
              <pre className="landing-code-block landing-code-block--small">{JSON.stringify(status, null, 2)}</pre>
            ) : null}
          </Collapse.Panel>
        </Collapse>
        <Title level={5} type="secondary" className="landing-footer-copy">
          gflowx-router — 场景化 AI 网关
        </Title>
      </div>
    </footer>
  )
}
