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
      <div className="landing-inner">
        <Title level={1} id="landing-hero-title" className="landing-hero-title">
          不选模型，<span className="landing-accent">选场景</span>
        </Title>
        <Paragraph className="landing-hero-lead">
          {BRAND_NAME} 在兼容 OpenAI API 的前提下，让你把 <Text code>model</Text> 写成 <Text code>code</Text>、
          <Text code>smart</Text> 等场景标签，由网关解析为合适的上游模型，并支持池化降级与健康跳过。
        </Paragraph>
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
            查看场景
          </Button>
        </Space>
        <Paragraph type="secondary" className="landing-hero-note">
          已有 OpenAI 兼容客户端？只需把 Base URL 指到网关，无需改代码结构。
        </Paragraph>
      </div>
    </section>
  )
}
