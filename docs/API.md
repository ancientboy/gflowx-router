# GFlowX Router — API 接口文档

> 所有接口兼容 OpenAI 格式，现有工具无需改动即可接入

---

## 1. 接入配置

```
Base URL: https://api.gflowx.com/v1
API Key:  sk-gflowx-xxxxxxxxxxxx
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
