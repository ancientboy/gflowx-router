import { Card, Col, Row, Typography } from 'antd'

const { Paragraph, Title, Text } = Typography

export function LandingCompare() {
  return (
    <section className="landing-section" id="landing-compare" aria-labelledby="landing-compare-title">
      <div className="landing-inner">
        <Title level={2} id="landing-compare-title" className="landing-section-title">
          为什么用场景
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card className="gflow-card landing-compare-card" title="传统方式">
              <Paragraph type="secondary">
                面对几十上百个模型 ID，要自行试误、维护映射表；切换供应商时客户端改动面大。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="gflow-card landing-compare-card landing-compare-card--accent" title="gflowx-router">
              <Paragraph>
                用少量<strong>场景标签</strong>表达意图，由网关结合<strong>池配置与健康状态</strong>选择具体模型，失败自动尝试池内下一项。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="gflow-card landing-compare-card" title="仍要精细控制？">
              <Paragraph type="secondary">
                支持直接传真实模型名与别名（如 <Text code>claude</Text>）；与场景模式可并存，详见仓库{' '}
                <Text code>docs/API.md</Text>。
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  )
}
