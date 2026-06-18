import { Alert, Card, Col, Row, Space, Tag, Typography } from 'antd'

const { Paragraph, Text, Title } = Typography

export function LandingSceneMgmt() {
  return (
    <section
      className="landing-section landing-scene-mgmt"
      id="landing-scene-mgmt"
      aria-labelledby="landing-scene-mgmt-title"
    >
      <div className="landing-inner">
        <Title level={2} id="landing-scene-mgmt-title" className="landing-section-title">
          场景管理：把路由讲清楚
        </Title>
        <Paragraph className="landing-section-lead">
          调用侧仍然只需要 OpenAI 兼容的 <Text code>POST /v1/chat/completions</Text>；下面两项帮助**终端用户或管理员**理解「当前账号会落到哪些模型候选」，无需改客户端代码。
        </Paragraph>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card className="gflow-card landing-mgmt-card" title="new-api 控制台 · 场景路由">
              <Paragraph type="secondary">
                应用 gflowx-router 后端补丁后，在 **new-api 默认 Web** 侧栏会出现「场景路由」入口，路由一般为{' '}
                <Text code>/gflowx-scenes</Text>：可查看角色/分组说明、常见场景标签，以及（已登录时）从接口拉取的**模型池预览表**。
              </Paragraph>
              <Space wrap size={[8, 8]}>
                <Tag color="cyan">侧栏入口</Tag>
                <Tag color="geekblue">只读说明 + 池预览</Tag>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="gflow-card landing-mgmt-card" title="只读快照接口">
              <Paragraph type="secondary">
                <Text code>GET /api/gflowx/scene-pools</Text>（需登录控制台会话 / <Text code>UserAuth</Text>
                ）返回当前分组下的 <Text code>group</Text>、<Text code>source</Text>（<Text code>v2</Text> /{' '}
                <Text code>v1</Text> 等）以及各场景标签对应的**候选模型有序列表**，与网关实际解析顺序一致（仍尊重单标签环境变量覆盖）。
              </Paragraph>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                分组池（<Text code>poolsByGroup</Text>）与 <Text code>defaultGroup</Text> 的配置约定见仓库{' '}
                <Text code>docs/GFLOWX_POOL_BY_GROUP_DESIGN.md</Text>。
              </Paragraph>
            </Card>
          </Col>
        </Row>
        <Alert
          className="landing-mgmt-alert"
          type="info"
          showIcon
          message="与本独立站的关系"
          description="此处为产品向说明页；深度渠道/计费配置仍在 new-api 管理后台。两套界面可并存：本页负责对外叙事与轻量入口，控制台负责运维与账号内场景可视化。"
        />
      </div>
    </section>
  )
}
