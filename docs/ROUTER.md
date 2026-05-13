# gflowx-router — 智能路由引擎设计

> 这是 gflowx-router 的核心差异化模块

---

## 1. 设计目标

1. **零思考** — 用户传 `model="code"`，系统选最优代码模型
2. **高可用** — 模型挂了自动切到下一个，用户无感
3. **成本优化** — 优先用便宜的，只在必要时用贵的
4. **延迟优先** — 同级别选最快的

## 2. 核心流程

```
请求进入 → 解析 model 字段
           │
           ├── 场景标签（code/smart/...）
           │     → 查分类表 → 获取模型池 → 路由
           │
           ├── 别名（claude/gpt4/...）
           │     → 查别名表 → 映射到具体模型 → 路由
           │
           └── 具体模型名
                 → 直接路由（如果渠道可用）
```

## 3. 路由决策因子

| 因子 | 权重 | 说明 |
|------|------|------|
| Tier 优先级 | 40% | Tier1 > Tier2 > Tier3 |
| 渠道健康 | 30% | 不健康的直接跳过 |
| 延迟 | 15% | 同 Tier 选延迟低的 |
| 额度剩余 | 10% | 快用完的降权 |
| 负载均衡 | 5% | 同条件下轮询 |

## 4. 健康检查

```go
// 每个 channel 独立检查
// 方式：发一个轻量请求（如 models list）
// 周期：30 秒
// 超时：5 秒
// 恢复：60 秒后自动重试

状态：
  HEALTHY   → 正常使用
  DEGRADED  → 延迟高，降低权重
  UNHEALTHY → 跳过，等待恢复
```

## 5. 降级策略

```
请求 model="smart"
  │
  ├─ Tier1: Claude Opus → 健康检查失败 ❌
  ├─ Tier1: GPT-4o     → 额度不足 ❌
  ├─ Tier1: GLM-5      → 成功 ✅ ← 使用这个
  │
  （如果整个 Tier1 都不可用）
  │
  ├─ Tier2: DeepSeek V3 → 成功 ✅ ← 降级到这个
  │
  （如果 Tier2 也不可用）
  │
  └─ Tier3: GLM-4-Flash → 兜底（几乎不会挂）
```

## 6. 缓存策略

```
Redis 缓存层：
  ├── category:{id}          → 场景分类配置（TTL 5min）
  ├── pool:{category}        → 模型池（TTL 1min）
  ├── health:{channel_id}    → 健康状态（TTL 30s）
  ├── quota:{channel_id}     → 额度状态（TTL 10min）
  └── alias:{alias}          → 别名映射（TTL 5min）
```

---

## 7. 已实现：v0 场景标签 → 单模型（`gflowxscene`）

在 `backend/gflowxscene` 中实现 **一层映射**（通过仓库根目录 `./scripts/apply-gflowx-backend-patch.sh` 将补丁打进子模块后生效）：当请求体中的 `model` 为 `docs/API.md` 所列场景标签之一（`smart` / `fast` / `cheap` / `code` / `write` / `creative` / `vision` / `translate`）时，在 **`GenRelayInfo` 之前** 将 `model` **改写**为具体上游模型名，再走原有渠道选择与 relay。

- **关闭**：环境变量 `GFLOWX_SCENES_ENABLED=false`（默认开启）。  
- **按标签覆盖默认值**：`GFLOWX_SCENE_CODE`、`GFLOWX_SCENE_SMART` 等（大写标签，`translate` → `GFLOWX_SCENE_TRANSLATE`）。  
- **内置默认**（无 env 时）：`code` / `smart` / `write` / `creative` / `vision` → `gpt-4o`；`fast` / `cheap` / `translate` → `gpt-4o-mini`。管理员需在 new-api 中为这些模型配置可用渠道，或通过上述 env 改为本环境已有的模型 id。

后续版本可在此包上扩展 **模型池、Tier 降级、健康检查**，与本文第 2～5 节设计对齐。

## 8. 已实现：v1 模型池、健康跳过、别名（`gflowxscene`）

在 v0 单模型映射之上，补丁内 `gflowxscene` 现支持：

1. **别名（对齐 `docs/API.md`）**  
   - 内置：`claude` → `claude-sonnet-4-20250514`，`gpt4` → `gpt-4o`，`deepseek` → `deepseek-chat`。  
   - 关闭：`GFLOWX_ALIASES_ENABLED=false`。  
   - 可选 JSON 覆盖/扩展：`GFLOWX_ALIASES_FILE` 指向 `{ "别名": "具体模型名" }` 文件（示例见 `config/gflowx_aliases.example.json`）。  
   - 别名在场景标签之前解析；命中别名后会同步 `original_model` 为解析结果，避免 `InitChannelMeta` 把请求体模型改回标签字符串。

2. **模型池（文件配置）**  
   - 环境变量 `GFLOWX_SCENE_POOLS_FILE` 指向 JSON：`{ "code": ["gpt-4o","deepseek-chat"], ... }`（示例 `config/gflowx_scene_pools.example.json`）。  
   - 单标签 **环境变量覆盖**（如 `GFLOWX_SCENE_CODE`）仍为最高优先级；设置后忽略该标签的池文件。  
   - 池内顺序表示 **优先级**；首个通过「健康检查」的模型作为当前请求模型。

3. **健康标记（进程内，轻量）**  
   - 默认开启：`GFLOWX_SCENE_HEALTH_ENABLED=false` 可关。  
   - 当 relay 判定为 **渠道类错误**（`types.IsChannelError`）时，将当前 **已解析的具体模型名** 记入短期不健康表（默认 TTL 60s，可用 `GFLOWX_SCENE_HEALTH_TTL_SEC` 调整）。  
   - 后续同进程内场景解析会 **跳过** 仍处于 TTL 内的模型，优先使用池内下一个健康项。  
   - 说明：此为 v1 **单机内存**实现；多实例一致性与 Redis 持久化见后续迭代（对齐本文 §6）。

4. **Relay 池内降级**  
   - 在 `controller/relay` 重试循环中：若常规重试结束仍失败，且该请求在 `ApplyToRequest` 时挂上了多模型池，则 **推进池索引**、更新 `OriginModelName` 与请求体模型、清空 `ChannelMeta` 以重新选路（不额外消耗 `RetryTimes` 计数，通过 `ResetRetryNextTry`）。

---

_最后更新：2026-05-12_
