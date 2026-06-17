import { Typography } from 'antd'
import { Link } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'

const { Title, Paragraph } = Typography

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)

  return (
    <>
      <Title level={2} style={{ marginTop: 0 }}>
        仪表盘
      </Title>
      {user ? (
        <Paragraph>
          已登录：<strong>{user.username}</strong>（角色 {user.role}，分组 {user.group}）
        </Paragraph>
      ) : null}
      <Paragraph type="secondary">
        用量与订阅等可继续对接 <Typography.Text code>/api/user/self</Typography.Text>、<Typography.Text code>/api/data/self</Typography.Text> 等接口。返回{' '}
        <Link to="/">用户向首页</Link>。
      </Paragraph>
    </>
  )
}
