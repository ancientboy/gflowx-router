import { Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function Keys() {
  return (
    <>
      <Title level={2} style={{ marginTop: 0 }}>
        API 密钥
      </Title>
      <Paragraph type="secondary">占位页：后续可接 new-api Token 列表接口。</Paragraph>
    </>
  )
}
