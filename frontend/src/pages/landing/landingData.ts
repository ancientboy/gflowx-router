import type { SceneCard } from './types'

export const SCENE_CARDS: SceneCard[] = [
  { tag: 'code', title: '写代码', blurb: '补全、重构、Review，偏工程实现。', exampleUser: '把这段 Go 函数改成并发安全' },
  { tag: 'smart', title: '复杂推理', blurb: '多步推理与方案对比。', exampleUser: '对比 REST 与 gRPC 在本场景的取舍' },
  { tag: 'fast', title: '要快', blurb: '低延迟、高性价比默认路由。', exampleUser: '用三句话总结这篇文章要点' },
  { tag: 'cheap', title: '要省', blurb: '优先便宜模型，适合大批量。', exampleUser: '批量把标题翻译成英文' },
  { tag: 'write', title: '写作', blurb: '长文、邮件、产品说明。', exampleUser: '写一封给客户的延期说明邮件' },
  { tag: 'creative', title: '创意', blurb: '头脑风暴、命名、广告文案。', exampleUser: '给咖啡品牌起 10 个中文名' },
  { tag: 'vision', title: '看图', blurb: '图像理解、截图问答（视渠道能力）。', exampleUser: '描述截图里的错误信息可能原因' },
  { tag: 'translate', title: '翻译', blurb: '多语言互译与语气统一。', exampleUser: '把下面段落译成日语商务语气' },
]

export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: '场景标签和具体模型是什么关系？',
    a: '你在请求里把 `model` 写成场景名（如 `code`），网关会在转发前解析为当前策略下的具体上游模型名；也可继续传真实模型名走「高级模式」。详见 docs/ROUTER.md。',
  },
  {
    q: '可以关掉场景解析吗？',
    a: '可以。设置环境变量 `GFLOWX_SCENES_ENABLED=false`（默认开启）。详见 docs/ROUTER.md §7。',
  },
  {
    q: '「claude」「gpt4」这种别名怎么用？',
    a: '与场景类似，把 `model` 设为别名即可映射到预设模型；也可通过 `GFLOWX_ALIASES_FILE` 自定义。详见 docs/API.md 与 docs/ROUTER.md §8。',
  },
  {
    q: '这和 new-api 自带 Web 是什么关系？',
    a: '本仓库 `frontend/` 为独立管理端产品页 + 轻控制台；渠道、计费等深度配置仍可使用 new-api 官方界面，直到我们在 gflowx-router 内逐项补齐。',
  },
  {
    q: '许可证要注意什么？',
    a: '`backend/` 子模块继承 new-api 的 AGPL-3.0；本仓库自有代码以根目录 LICENSE 为准。分发镜像时请一并遵守 AGPL 义务。',
  },
]
