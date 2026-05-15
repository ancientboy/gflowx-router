import { Alert, Card, Col, Row, Space, Typography } from 'antd'
import { BRAND_NAME } from '../brand'
import './marketing-home.css'

const { Paragraph, Text, Title } = Typography

const TAGS: { tag: string; desc: string }[] = [
  { tag: 'code', desc: '工程实现、重构、Review' },
  { tag: 'smart', desc: '多步推理与方案对比' },
  { tag: 'fast', desc: '低延迟默认' },
  { tag: 'cheap', desc: '成本优先批量' },
  { tag: 'write', desc: '长文与邮件' },
  { tag: 'creative', desc: '命名与头脑风暴' },
  { tag: 'vision', desc: '图像理解（视渠道）' },
  { tag: 'translate', desc: '翻译' },
]

export function MarketingHome() {
  return (
    <div className="m-home">
      <section className="m-hero" id="m-hero" aria-labelledby="m-hero-title">
        <div className="m-inner">
          <Title level={1} id="m-hero-title" className="m-hero-title">
            不选模型，<span className="m-hero-accent">选场景</span>
          </Title>
          <Paragraph className="m-hero-lead">
            {BRAND_NAME} 兼容 OpenAI 式 API：把请求里的 <Text code>model</Text> 写成 <Text code>code</Text>、
            <Text code>smart</Text> 等标签，由网关解析为上游模型，并支持池内降级与健康跳过。
          </Paragraph>
          <Paragraph className="m-hero-lead" style={{ marginTop: 12 }}>
            本页为<strong>面向终端用户</strong>的独立首页与顶栏；渠道、额度等管理仍在 new-api 控制台（或本站的
            <Text code>/login</Text> 后轻量页）。
          </Paragraph>
          <Space wrap className="m-hero-pills">
            <span className="m-pill m-pill--accent">同一套 Base URL</span>
            <span className="m-pill">控制台可看池预览</span>
            <span className="m-pill">可选 v2 分组池</span>
          </Space>
        </div>
      </section>

      <section className="m-section" id="m-scenes" aria-labelledby="m-scenes-title">
        <div className="m-inner">
          <Title level={2} id="m-scenes-title" className="m-section-title">
            场景标签
          </Title>
          <Paragraph className="m-section-lead">
            在 <Text code>POST /v1/chat/completions</Text> 的 <Text code>model</Text> 字段直接使用下列标签（与{' '}
            <Text code>docs/API.md</Text> 一致）。
          </Paragraph>
          <Row gutter={[16, 16]}>
            {TAGS.map((t) => (
              <Col xs={24} sm={12} lg={6} key={t.tag}>
                <Card className="m-card" title={<Text code>{t.tag}</Text>}>
                  <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    {t.desc}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="m-section" id="m-mgmt" aria-labelledby="m-mgmt-title">
        <div className="m-inner">
          <Title level={2} id="m-mgmt-title" className="m-section-title">
            场景管理
          </Title>
          <Paragraph className="m-section-lead">
            部署 gflowx-router 后端补丁后，可在 <strong>new-api 默认 Web</strong> 侧栏打开「场景路由」（一般为{' '}
            <Text code>/gflowx-scenes</Text>）查看说明与当前账号下的<strong>模型池预览</strong>。
          </Paragraph>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card className="m-card" title="控制台 · 场景路由">
                <Paragraph type="secondary">
                  只读说明页 + 表格预览；实际池配置仍在网关环境变量与 <Text code>GFLOWX_SCENE_POOLS_FILE</Text> 等文件。
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="m-card" title="只读快照 API">
                <Paragraph type="secondary">
                  <Text code>GET /api/gflowx/scene-pools</Text>（需已登录控制台会话）返回 <Text code>group</Text>、
                  <Text code>source</Text> 与各场景标签的候选模型列表，与转发解析顺序一致。
                </Paragraph>
              </Card>
            </Col>
          </Row>
          <Alert
            style={{ marginTop: 20 }}
            type="info"
            showIcon
            message="与本页顶栏的关系"
            description="此处顶栏仅服务用户向首页；进入 /login 后的页面使用另一套浅色控制台顶栏，避免与 new-api 白底风格混淆。"
          />
        </div>
      </section>

      <section className="m-section m-section--cta" id="m-cta" aria-labelledby="m-cta-title">
        <div className="m-inner">
          <Title level={2} id="m-cta-title" className="m-section-title">
            接入示例
          </Title>
          <pre className="m-code">
            {`POST /v1/chat/completions
Authorization: Bearer <你的 API Key>
Content-Type: application/json

{
  "model": "code",
  "messages": [{ "role": "user", "content": "Hello" }]
}`}
          </pre>
          <Paragraph type="secondary" style={{ marginTop: 16 }}>
            完整说明见仓库 <Text code>docs/API.md</Text>、<Text code>docs/ROUTER.md</Text>。
          </Paragraph>
        </div>
      </section>
    </div>
  )
}
