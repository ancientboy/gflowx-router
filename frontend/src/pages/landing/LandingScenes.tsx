import { useState } from 'react'
import { Button, Card, Col, Modal, Row, Space, Typography } from 'antd'
import { SCENE_CARDS } from './landingData'

const { Paragraph, Text, Title } = Typography

function buildJsonBody(tag: string, user: string) {
  return JSON.stringify(
    {
      model: tag,
      messages: [{ role: 'user', content: user }],
    },
    null,
    2,
  )
}

export function LandingScenes() {
  const [open, setOpen] = useState(false)
  const [tag, setTag] = useState('code')
  const [userMsg, setUserMsg] = useState('')

  const jsonBody = buildJsonBody(tag, userMsg)

  return (
    <section className="landing-section" id="landing-scenes" aria-labelledby="landing-scenes-title">
      <div className="landing-inner">
        <Title level={2} id="landing-scenes-title" className="landing-section-title">
          场景与能力
        </Title>
        <Paragraph className="landing-section-lead">
          下列标签与 <Text code>docs/API.md</Text> 一致；在 <Text code>POST /v1/chat/completions</Text> 的 <Text code>model</Text>{' '}
          字段中直接使用。
        </Paragraph>
        <Row gutter={[16, 16]}>
          {SCENE_CARDS.map((s) => (
            <Col xs={24} sm={12} lg={6} key={s.tag}>
              <Card className="gflow-card landing-scene-card" title={<Text code>{s.tag}</Text>}>
                <Paragraph strong>{s.title}</Paragraph>
                <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                  {s.blurb}
                </Paragraph>
                <Button
                  type="link"
                  onClick={() => {
                    setTag(s.tag)
                    setUserMsg(s.exampleUser)
                    setOpen(true)
                  }}
                >
                  查看示例
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Modal title={`示例：model = "${tag}"`} open={open} onCancel={() => setOpen(false)} footer={null} width={640}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            请求体（JSON）
          </Paragraph>
          <pre className="landing-code-block">{jsonBody}</pre>
          <Button
            onClick={() => {
              void navigator.clipboard.writeText(jsonBody)
            }}
          >
            复制 JSON
          </Button>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            将网关 Base URL 指向你的部署地址；本地开发经 Vite 代理时，浏览器内请求可使用同源 <Text code>/v1</Text>。
          </Paragraph>
        </Space>
      </Modal>
    </section>
  )
}
