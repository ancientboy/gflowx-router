import { Card, Typography } from 'antd'

export default function Home() {
  return (
    <Card title="GFlowX Router 前端脚手架">
      <Typography.Paragraph>
        本目录为全新管理端起点（与 new-api 自带 Web 分离）。开发时使用{' '}
        <Typography.Text code>npm run dev</Typography.Text>，Vite 已将{' '}
        <Typography.Text code>/api</Typography.Text> 与{' '}
        <Typography.Text code>/v1</Typography.Text> 代理到{' '}
        <Typography.Text code>http://127.0.0.1:3000</Typography.Text>（见{' '}
        <Typography.Text code>vite.config.ts</Typography.Text>）。
      </Typography.Paragraph>
      <Typography.Paragraph>
        后端场景标签（如 <Typography.Text code>model: &quot;code&quot;</Typography.Text>
        ）已在子模块 <Typography.Text code>gflowxscene</Typography.Text> 中解析为具体模型，详见{' '}
        <Typography.Text code>docs/ROUTER.md</Typography.Text> 第 7 节。
      </Typography.Paragraph>
    </Card>
  )
}
