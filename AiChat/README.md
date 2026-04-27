# AI 智能客服对话系统

一个基于 Vue3 + TypeScript 的 AI 聊天应用，实现了 SSE 流式输出、Markdown 渲染、代码高亮等功能。

## 技术栈

- **Vue3** - 前端框架
- **TypeScript** - 类型安全
- **Pinia** - 状态管理
- **SSE** (Server-Sent Events) - 流式输出
- **markdown-it** - Markdown 渲染
- **highlight.js** - 代码高亮

## 功能特性

- ✅ SSE 流式输出 + 打字机效果
- ✅ Markdown 渲染 + 代码高亮
- ✅ 多会话管理
- ✅ Token 统计
- ✅ 上下文截断策略
- ✅ 消息重新生成
- ✅ 对话历史存储

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动模拟后端服务器（用于本地测试）
pnpm server

# 启动前端开发服务器（新开一个终端）
pnpm dev

# 访问 http://localhost:3000
```

## 项目结构

```
src/
├── api/
│   └── chat.ts          # SSE 流式请求封装
├── components/
│   ├── MessageBubble.vue   # 消息气泡组件
│   ├── MessageInput.vue    # 消息输入组件
│   ├── ConversationList.vue # 会话列表组件
│   └── ChatPanel.vue       # 聊天面板组件
├── composables/
│   ├── useTypewriter.ts    # 打字机效果 Hook
│   └── useMarkdown.ts      # Markdown 渲染 Hook
├── stores/
│   └── chat.ts          # 聊天状态管理
├── types/
│   └── index.ts         # 类型定义
├── styles/
│   └── index.css        # 全局样式
├── App.vue              # 根组件
└── main.ts              # 入口文件

server/
└── index.js             # 模拟后端服务器
```

## 核心代码讲解

### 1. SSE 流式请求

```typescript
// src/api/chat.ts
export function streamChat(
  request: ChatRequest,
  onChunk: (chunk: SSEChunk) => void,
  onError: (error: Error) => void,
  onComplete: () => void,
): AbortController {
  const controller = new AbortController();

  (async () => {
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ ...request, stream: true }),
      signal: controller.signal,
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      // 解析 SSE 格式: data: {"content": "xxx"}\n\n
      // ...处理数据
    }
  })();

  return controller;
}
```

### 2. 打字机效果

```typescript
// src/composables/useTypewriter.ts
export function useTypewriter() {
  const displayText = ref("");
  const queue: string[] = [];

  function addText(text: string) {
    queue.push(...[...text]);
    if (!isTyping) startTyping();
  }

  function startTyping() {
    setInterval(() => {
      if (queue.length === 0) return;
      displayText.value += queue.shift();
    }, 30);
  }

  return { displayText, addText };
}
```

### 3. 上下文截断

```typescript
// src/stores/chat.ts
function truncateContext(messages: ChatMessage[], maxTokens: number) {
  // 保留系统提示 + 从后往前添加消息
  // 直到达到 Token 上限
}
```

## 面试要点

1. **SSE vs WebSocket**
   - SSE：单向通信，基于 HTTP，自动重连
   - WebSocket：双向通信，独立协议
2. **流式输出原理**
   - 使用 `fetch` + `ReadableStream` 读取数据
   - `TextDecoder` 解码二进制数据
   - 解析 `data:` 前缀的 SSE 格式
3. **Token 优化策略**
   - 上下文截断
   - 对话摘要
   - 滑动窗口

## 扩展功能（可选实现）

- [ ] 对接真实 AI API（OpenAI/Claude）
- [ ] RAG 知识库检索
- [ ] 语音输入/输出
- [ ] 图片生成
- [ ] 多模态对话
