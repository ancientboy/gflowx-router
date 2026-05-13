# gflowx-router — 按用户分组切换场景池（技术设计）

> 与产品档位的对应关系见 **[`SUBSCRIPTION_DESIGN.md`](SUBSCRIPTION_DESIGN.md)**（`free` / `pro` / `team` 与 `upgrade_group`）。  
> 本文约定：**订阅周期仍只跟档位走**；此处只解决 **「同一 `model=code`，不同分组解析到不同模型池」** 的配置与解析顺序。  
> **实施状态（补丁）**：**v2 `poolsByGroup` + `defaultGroup`、v1 平面 JSON 兼容、`GET /api/gflowx/scene-pools`、default 控制台池预览** 已合入 `patches/0001-...`；以下为设计原文与运维说明。

## 1. 现状（补丁前 / 文档历史）

- 环境变量 **`GFLOWX_SCENE_POOLS_FILE`** 指向 **单个 JSON 文件**。  
- **v1**：平面 `map[string][]string`，不区分用户分组。  

## 1.1 补丁后行为（当前）

- 支持 **v2**：根级 `poolsByGroup` + 可选 `defaultGroup`；按 **Gin Context 用户分组 / 令牌分组** 选池（见 `gflowxscene/pool.go`、`resolve.go`）。  
- **v1 平面 JSON** 仍支持；无 `poolsByGroup` 键时按原语义全局共用。  
- **`GET /api/gflowx/scene-pools`**：返回当前会话下的 `group`、`source`、`scenes` 映射。  
- **default 控制台** `/gflowx-scenes` 页拉取上述接口展示池预览。

---

| 输入 | 期望 |
|------|------|
| 用户分组 `UserGroup`（new-api 写入 Gin Context，键 `constant.ContextKeyUserGroup`；与 `RelayInfo.UserGroup` 一致） | 决定使用 **哪一档池配置**。 |
| 场景标签 `code` / `smart` / … | 在该档配置内取 **候选模型列表**，再走健康 / relay 降级（现有逻辑）。 |
| 未识别分组、缺配置 | **安全回退**（见 §4），避免解析失败导致 500。 |

**仅 API Key 鉴权**时：若 Context 中仅有 **令牌分组**（`ContextKeyTokenGroup`），设计为 **与 `UserGroup` 同一套键名解析**：优先 `UserGroup`，为空则用 `TokenGroup`（与 `relay/common/relay_info.go` 里分组来源顺序对齐，实施时在代码里写死优先级并单测）。

## 3. 配置文件形态（推荐：单文件、按分组分块）

**仍只使用一个 `GFLOWX_SCENE_POOLS_FILE`**，避免运维追多个路径；内容升级为 **嵌套对象**（向后兼容见 §5）。

### 3.1 推荐 JSON Schema（v2）

```json
{
  "poolsByGroup": {
    "free": {
      "code": ["gpt-4o-mini"],
      "smart": ["gpt-4o-mini"]
    },
    "pro": {
      "code": ["gpt-4o", "claude-sonnet-4-20250514"],
      "smart": ["gpt-4o", "o3-mini"]
    },
    "team": {
      "code": ["gpt-4o", "claude-sonnet-4-20250514", "deepseek-chat"],
      "smart": ["gpt-4o", "o3-mini"]
    }
  }
}
```

- **键名**：与 new-api 用户 **`group` 字符串完全一致**（大小写敏感；建议运维统一小写 `free`/`pro`/`team`）。  
- **值**：与现网相同，每个场景 tag 对应 **非空字符串数组**（有序，即池内优先级）。  
- **未列出的场景 tag**：该分组下可走 **每标签 env 覆盖**（`GFLOWX_SCENE_CODE` 等）→ 再 **内置默认**（与现逻辑一致）。

### 3.2 可选：全局默认块（减少重复）

```json
{
  "defaultGroup": "pro",
  "poolsByGroup": {
    "free": { "code": ["gpt-4o-mini"] },
    "pro": { "code": ["gpt-4o", "claude-sonnet-4-20250514"] }
  }
}
```

语义：**若当前用户分组在 `poolsByGroup` 中不存在**，则使用 `defaultGroup` 对应块（需校验 `defaultGroup` 必须存在于 `poolsByGroup`）。若未配置 `defaultGroup`，则回退 §4。

---

## 4. 解析优先级（单请求、单标签）

对场景标签 `tag`、当前分组 `g`（规范化：`strings.TrimSpace`，空视为 `"default"` 可选，见 §6）：

1. **每标签环境变量** `GFLOWX_SCENE_<TAG_UPPER>`（已有）— 若存在且非空 → **单模型列表** `[该值]`，结束。  
2. **v2 文件**：`poolsByGroup[g][tag]` 有非空数组 → 使用该列表。  
3. **v2 文件**：`poolsByGroup[defaultGroup][tag]`（若配置了 `defaultGroup`）→ 非空则使用。  
4. **v1 兼容**（§5）：平面 `map[tag][]string` → 使用（等同「全用户共享一套池」）。  
5. **内置默认** `builtinDefault(tag)`（已有）。

**健康跳过 / `TryAdvancePool`**：不改变；仍在 **当前已选定的候选列表** 上工作。

---

## 5. 向后兼容（现有平面 JSON）

若解析 JSON 后 **根上存在任意 tag 键且值为数组**（且不存在 `poolsByGroup` 键），则视为 **v1 平面格式**，行为与现网完全一致：**忽略分组**，全体用户共用该 map。

检测逻辑示例（实施时）：

- 若 `json` 含 `"poolsByGroup"` 且为 object → **v2**。  
- 否则若顶层键均为场景 tag（或可放宽为：存在至少一个已知 `sceneTags` 键）→ **v1 平面**。  
- 否则 → 记录警告日志，回退内置默认。

---

## 6. 分组名与订阅档位对齐

| `SubscriptionPlan.upgrade_group` | `poolsByGroup` 中建议键 |
|----------------------------------|-------------------------|
| `free` | `free` |
| `pro` | `pro` |
| `team` | `team` |

若历史数据为 `default`、`vip` 等，**运维在 JSON 中使用同名键即可**，无需改 new-api；产品与 **`SUBSCRIPTION_DESIGN.md`** 中「建议分组名」保持一致即可。

**空分组**：若 Context 中分组为空字符串，建议实现为 **`default`** 键（若文件无 `default`，则走 §4 链）。

---

## 7. 缓存与热更新

- 仍以 **文件 mtime** 为粒度整文件重读（与现 `pool.go` 一致）。  
- v2 下 **单缓存结构**：`map[group]map[tag][]string` 或解析后扁平索引，**一次读文件填充**。  
- 并发：保留 `sync.Mutex` 与现有一致。

---

## 8. 给用户「看见自己的池」（只读 API，建议另起补丁）

| 项 | 建议 |
|----|------|
| **路径** | `GET /api/gflowx/scene-pools`（`UserAuth`） |
| **响应** | 仅返回 **当前用户分组** 下的 `poolsByGroup[g]`（或 v1 时返回共享池）；**禁止**返回其它分组。 |
| **未登录** | 401；**未配置文件** | 返回 `{ "source": "builtin", "tags": { "code": ["gpt-4o"], ... } }` 可选，避免前端空白（产品定）。 |

与 default Web **`/gflowx-scenes`** 对接时，用该接口渲染表格即可。

---

## 9. 风险与约束

| 风险 | 缓解 |
|------|------|
| 分组名拼写与 JSON 不一致 | 启动时 **校验**：`poolsByGroup` 的键应覆盖 `SUBSCRIPTION_DESIGN` 列出的分组；告警日志。 |
| 池内模型不在该用户渠道可用 | 仍依赖 new-api **分组 × 渠道**；池只解决「候选名」，选路失败仍走现有 relay 错误与降级。 |
| 文件过大 | 单文件建议 < 256KB；再大拆多文件属运维策略（非本设计必选）。 |

---

## 10. 实施顺序（建议）

1. 扩展 `pool.go` 解析 v1/v2 + 缓存结构；单元测试（v1 兼容、v2 多组、缺键回退）。  
2. `resolve.go` / `apply.go`：`sceneCandidateModels(c *gin.Context, tag)` 从 Context 读分组并走 §4 链（**relay 中调用点已有 `*gin.Context`**）。  
3. 更新 **`docs/ROUTER.md`** §8 示例 JSON。  
4. （可选）`GET /api/gflowx/scene-pools` + 控制台拉表展示。  

---

## 11. 相关文档

- [`SUBSCRIPTION_DESIGN.md`](SUBSCRIPTION_DESIGN.md) — 三档产品与分组命名。  
- [`ROUTER.md`](ROUTER.md) — 场景与健康、relay 降级。  
- [`API.md`](API.md) — 场景标签列表。  

---

_版本：v1 · 技术设计稿；落地代码以 `patches/` 与 `gflowxscene` 实际变更为准。_
