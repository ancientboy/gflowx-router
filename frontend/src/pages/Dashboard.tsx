import { Link } from 'react-router-dom'
import { Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function Dashboard() {
  return (
    <>
      <Title level={2} style={{ marginTop: 0 }}>
        仪表盘
      </Title>
      <Paragraph type="secondary">
        占位页：后续可接 new-api 的用量与订阅接口。返回 <Link to="/">用户向首页</Link> 使用另一套顶栏。
      </Paragraph>
    </>
  )
}
