import { Button, Card, Col, Row, Typography } from 'antd'
import { Link } from 'react-router-dom'

const { Paragraph, Title, Text } = Typography

const tiers = [
  {
    key: 'solo',
    name: '个人体验',
    price: '自建网关',
    desc: '适合本地或团队内网验证；按 new-api 官方方式配置渠道与额度。',
    cta: '登录控制台',
    highlight: false,
  },
  {
    key: 'team',
    name: '团队协作',
    price: '按部署规模',
    desc: '多 Key、分组与额度由 new-api 管理；gflowx-router 侧重场景解析与池化降级。',
    cta: '开通使用',
    highlight: true,
  },
  {
    key: 'enterprise',
    name: '企业定制',
    price: '商务洽谈',
    desc: '多租户、审计、专属模型池与 SLA 等需单独评估与二开排期。',
    cta: '联系部署方',
    highlight: false,
  },
]

export function LandingPricing() {
  return (
    <section className="landing-section" id="landing-pricing" aria-labelledby="landing-pricing-title">
      <div className="landing-inner">
        <Title level={2} id="landing-pricing-title" className="landing-section-title">
          套餐与开通
        </Title>
        <Paragraph className="landing-section-lead">
          <strong>注册策略</strong>：账号与额度由<strong>部署方</strong>在 new-api 管理后台创建；若你方已开启自助注册，请直接使用下方「登录/注册」入口（与官方 Web 策略一致）。
        </Paragraph>
        <Row gutter={[16, 16]}>
          {tiers.map((t) => (
            <Col xs={24} md={8} key={t.key}>
              <Card
                className={`gflow-card landing-pricing-card${t.highlight ? ' landing-pricing-card--highlight' : ''}`}
                title={t.name}
              >
                <Title level={3} className="landing-pricing-price">
                  {t.price}
                </Title>
                <Paragraph type="secondary">{t.desc}</Paragraph>
                <Link to={`/login?from=landing&plan=${encodeURIComponent(t.key)}`}>
                  <Button type={t.highlight ? 'primary' : 'default'} block>
                    {t.cta}
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
        <Paragraph type="secondary" style={{ marginTop: 16, marginBottom: 0 }}>
          产品路线与里程碑见 <Text code>docs/WORK_PLAN.md</Text>；完整注册/支付闭环属后续迭代（见 <Text code>docs/DEVELOPMENT.md</Text> 路线图）。
        </Paragraph>
      </div>
    </section>
  )
}
