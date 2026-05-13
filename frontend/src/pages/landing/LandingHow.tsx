import { Card, Steps, Typography } from 'antd'

const { Paragraph, Text, Title } = Typography

export function LandingHow() {
  return (
    <section className="landing-section" id="landing-how" aria-labelledby="landing-how-title">
      <div className="landing-inner">
        <Title level={2} id="landing-how-title" className="landing-section-title">
          三步接入
        </Title>
        <Card className="gflow-card">
          <Steps
            direction="vertical"
            current={-1}
            items={[
              {
                title: '准备网关与渠道',
                description:
                  '部署 new-api 底座并配置上游渠道与模型映射（可使用官方管理端或 Docker Compose，见仓库 README）。',
              },
              {
                title: '创建 API Key',
                description: '在控制台创建令牌并选择分组；将 Key 配置到客户端环境变量。',
              },
              {
                title: '客户端指向网关',
                description: 'Base URL 指向网关 /v1；将 model 设为场景标签或真实模型名即可发请求。',
              },
            ]}
          />
          <Paragraph type="secondary" style={{ marginTop: 16, marginBottom: 0 }}>
            更细的字段说明见仓库内 <Text code>docs/API.md</Text> 与 <Text code>docs/ROUTER.md</Text>。
          </Paragraph>
        </Card>
      </div>
    </section>
  )
}
