import { Button, Space, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { BRAND_NAME } from '../../brand'
import { useAuthStore } from '../../store/authStore'

const { Title, Paragraph, Text } = Typography

export function LandingHero() {
  const user = useAuthStore((s) => s.user)
  const ready = useAuthStore((s) => s.ready)

  const scrollScenes = () => {
    document.querySelector('#landing-scenes')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="landing-hero" id="landing-hero" aria-labelledby="landing-hero-title">
      <div className="landing-inner landing-hero-grid">
        <Title level={1} id="landing-hero-title" className="landing-hero-title">
          不选模型，<span className="landing-accent">选场景</span>
        </Title>
        <Paragraph className="landing-hero-lead">
          {BRAND_NAME} 在兼容 OpenAI API 的前提下，让你把 <Text code>model</Text> 写成 <Text code>code</Text>、
          <Text code>smart</Text> 等场景标签，由网关解析为合适的上游模型，并支持池化降级与健康跳过。
        </Paragraph>
        <Paragraph className="landing-hero-lead" style={{ marginTop: 12, marginBottom: 0 }}>
          部署补丁后，还可在 <strong>new-api 控制台「场景路由」</strong>与本页下方的「场景管理」区块，了解当前账号下的<strong>模型池预览</strong>与分组策略（无需换接入路径）。
        </Paragraph>
        <div className="landing-hero-pills" aria-hidden>
          <span className="landing-hero-pill landing-hero-pill--accent">OpenAI 兼容 Base URL</span>
          <span className="landing-hero-pill">控制台 / 只读池快照</span>
          <span className="landing-hero-pill">v2 分组池可选</span>
        </div>
        <Space wrap size="middle" className="landing-hero-cta">
          {ready && user ? (
            <Link to="/dashboard">
              <Button type="primary" size="large">
                进入控制台
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button type="primary" size="large">
                登录控制台
              </Button>
            </Link>
          )}
          <Button size="large" onClick={scrollScenes}>
            场景标签
          </Button>
        </Space>
        <Paragraph type="secondary" className="landing-hero-note">
          已有 OpenAI 兼容客户端？只需把 Base URL 指到网关，无需改代码结构。
        </Paragraph>
      </div>
    </section>
  )
}
