# gflowx-router — API 接口文档

> 所有接口兼容 OpenAI 格式，现有工具无需改动即可接入

---

## 1. 接入配置

```
Base URL: https://api.gflowx-router.example/v1
API Key:  sk-gflowx-router-xxxxxxxxxxxx
```

## 2. 聊天补全

```
POST /v1/chat/completions
```

### 2.1 场景标签模式（推荐）

```json
{
  "model": "code",
  "messages": [
    {"role": "user", "content": "帮我写一个快速排序"}
  ]
}
```

可用标签：`smart` `fast` `cheap` `code` `write` `creative` `vision` `translate`

### 2.2 高级模式

```json
{
  "model": "claude-sonnet-4-20250514",
  "messages": [
    {"role": "user", "content": "Hello"}
  ]
}
```

### 2.3 别名模式

```json
{
  "model": "claude",
  "messages": [
    {"role": "user", "content": "Hello"}
  ]
}
```

别名映射：`claude` → Claude Sonnet, `gpt4` → GPT-4o, `deepseek` → DeepSeek V3

### 2.4 响应格式

完全兼容 OpenAI 格式：

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "model": "claude-sonnet-4-20250514",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 50,
    "total_tokens": 60
  }
}
```

> 注意：返回的 `model` 字段为实际路由到的模型名

### 2.5 场景池只读查询（控制台会话）

应用补丁且场景路由开启时，管理端可调用：

```
GET /api/gflowx/scene-pools
```

- **鉴权**：`UserAuth`（与 new-api 控制台 Cookie 会话一致）。  
- **响应** `data`：`{ "group": "<当前分组>", "source": "v2|v1|none|disabled", "scenes": { "code": ["模型A","模型B"], ... } }`  
  - `scenes`：各场景标签对应的 **候选模型有序列表**（与 `GFLOWX_SCENE_POOLS_FILE` 及 per-tag 环境变量覆盖一致）。  
- **配置**：v2 嵌套 JSON 见 `config/gflowx_scene_pools_by_group.example.json` 与 **`docs/GFLOWX_POOL_BY_GROUP_DESIGN.md`**。

## 3. 图片生成

```
POST /v1/images/generations
```

```json
{
  "model": "image",
  "prompt": "一只在月球上喝咖啡的猫",
  "n": 1,
  "size": "1024x1024"
}
```

## 4. 向量嵌入

```
POST /v1/embeddings
```

```json
{
  "model": "embed",
  "input": "Hello world"
}
```

## 5. 语音合成

```
POST /v1/audio/speech
```

```json
{
  "model": "tts",
  "input": "你好世界",
  "voice": "alloy"
}
```

## 6. 语音识别

```
POST /v1/audio/transcriptions
```

FormData: `file` + `model=tts`

## 7. 模型列表

```
GET /v1/models
```

返回所有可用的场景标签和模型：

```json
{
  "data": [
    {"id": "smart", "object": "model", "owned_by": "gflowx", "type": "category"},
    {"id": "code", "object": "model", "owned_by": "gflowx", "type": "category"},
    {"id": "fast", "object": "model", "owned_by": "gflowx", "type": "category"},
    {"id": "claude-sonnet-4-20250514", "object": "model", "owned_by": "anthropic", "type": "model"},
    {"id": "gpt-4o", "object": "model", "owned_by": "openai", "type": "model"}
  ]
}
```

---

_最后更新：2026-05-12_
