import { Collapse, Typography } from 'antd'
import { FAQ_ITEMS } from './landingData'

const { Title } = Typography

export function LandingFaq() {
  return (
    <section className="landing-section" id="landing-faq" aria-labelledby="landing-faq-title">
      <div className="landing-inner">
        <Title level={2} id="landing-faq-title" className="landing-section-title">
          常见问题
        </Title>
        <Collapse
          bordered={false}
          className="landing-faq"
          items={FAQ_ITEMS.map((item, i) => ({
            key: String(i),
            label: item.q,
            children: <p className="landing-faq-answer">{item.a}</p>,
          }))}
        />
      </div>
    </section>
  )
}
