import { Button, Card, Form, Input, Typography } from 'antd'
import { Link } from 'react-router-dom'

const { Paragraph } = Typography

export default function Login() {
  return (
    <Card title="登录">
      <Paragraph type="secondary">
        占位：请接入部署方提供的 new-api 登录接口。完成后可跳转 <Link to="/dashboard">仪表盘</Link>。
      </Paragraph>
      <Form layout="vertical" onFinish={() => Promise.resolve()}>
        <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
          <Input autoComplete="username" />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true }]}>
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block disabled>
          登录（待接入）
        </Button>
      </Form>
      <Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
        <Link to="/">← 返回用户向首页</Link>
      </Paragraph>
    </Card>
  )
}
