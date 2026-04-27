/**
 * AI 聊天后端服务器
 *
 * 支持两种模式：
 * 1. 模拟模式（USE_MOCK=true）：本地模拟，不消耗 API 额度
 * 2. 真实模式（USE_MOCK=false）：调用 Anthropic Claude API
 *
 * 运行方式：node server/index.js
 */

import "dotenv/config"; // 加载 .env 环境变量
import http from "http";
import Anthropic from "@anthropic-ai/sdk";

const PORT = 3002;

// ==================== 配置 ====================

/**
 * 是否使用模拟模式
 * - true: 使用本地模拟响应（默认）
 * - false: 调用真实 Anthropic API
 */
const USE_MOCK = process.env.USE_MOCK !== "false";

/**
 * Anthropic 客户端配置
 *
 * 支持的环境变量：
 * - ANTHROPIC_API_KEY: API 密钥（必需）
 * - ANTHROPIC_BASE_URL: API 地址（可选，用于代理）
 * - ANTHROPIC_MODEL: 使用的模型（可选，默认 claude-sonnet-4-6）
 */
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
  baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
});

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

/**
 * 模拟 AI 回复
 * 根据用户输入返回预设的回复
 */
function generateResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  // 代码相关
  if (lowerMessage.includes("防抖") || lowerMessage.includes("debounce")) {
    return `好的，我来用 TypeScript 实现一个防抖函数：

\`\`\`typescript
/**
 * 防抖函数
 * 在事件被触发后延迟执行，如果在延迟期间再次触发，则重新计时
 * 
 * @param fn - 要执行的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null
  
  return function (this: any, ...args: Parameters<T>) {
    // 如果已有定时器，清除它
    if (timerId !== null) {
      clearTimeout(timerId)
    }
    
    // 设置新的定时器
    timerId = setTimeout(() => {
      fn.apply(this, args)
      timerId = null
    }, delay)
  }
}
\`\`\`

**使用示例：**

\`\`\`typescript
// 搜索框输入防抖
const handleSearch = debounce((keyword: string) => {
  console.log('搜索:', keyword)
  // 发起 API 请求...
}, 300)

input.addEventListener('input', (e) => {
  handleSearch((e.target as HTMLInputElement).value)
})
\`\`\`

**防抖的应用场景：**
1. 搜索框输入联想
2. 窗口 resize 事件
3. 按钮防重复点击
4. 表单验证`;
  }

  // Vue 响应式
  if (lowerMessage.includes("vue") && lowerMessage.includes("响应式")) {
    return `## Vue3 响应式原理

Vue3 的响应式系统基于 **Proxy** 实现：

\`\`\`typescript
function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key)  // 依赖收集
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)  // 触发更新
      return result
    }
  })
}
\`\`\`

核心流程：
1. **创建响应式对象**：使用 Proxy 包装原始对象
2. **依赖收集**：effect 执行时，访问响应式数据触发 get
3. **触发更新**：修改数据触发 set，执行所有收集的 effect`;
  }

  // 自我介绍
  if (
    lowerMessage.includes("介绍") ||
    lowerMessage.includes("你是谁") ||
    lowerMessage.includes("你好")
  ) {
    return `你好！👋 我是 **AI 智能客服助手**。

我可以帮助你：
- 💡 **回答问题** - 各种知识问答
- 💻 **编写代码** - 多种编程语言
- 📝 **写作辅助** - 文案、文档

有什么我可以帮助你的吗？`;
  }

  // 默认回复
  return `收到你的消息：「${userMessage}」

这是 **模拟模式** 的回复。在 \`.env\` 文件中设置 \`USE_MOCK=false\` 并填入 OpenAI API Key 即可接入真实 AI。`;
}

// ==================== 请求处理 ====================

// ==================== 请求处理 ====================

/**
 * 处理 CORS
 */
function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/**
 * 发送 SSE 数据块
 */
function sendSSEChunk(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

/**
 * 模拟流式输出
 */
async function handleMockChat(res, userMessage) {
  const response = generateMockResponse(userMessage);
  const chars = [...response];
  let index = 0;

  return new Promise((resolve) => {
    const sendChunk = () => {
      if (index < chars.length) {
        const chunkSize = Math.floor(Math.random() * 3) + 1;
        const chunk = chars.slice(index, index + chunkSize).join("");

        sendSSEChunk(res, {
          id: `chunk-${index}`,
          content: chunk,
          done: false,
        });

        index += chunkSize;
        setTimeout(sendChunk, Math.random() * 40 + 20);
      } else {
        res.write("data: [DONE]\n\n");
        res.end();
        resolve();
      }
    };
    sendChunk();
  });
}

/**
 * 调用真实 Anthropic Claude API（流式输出）
 *
 * ⭐ 这是接入 Claude 的核心代码！
 *
 * 流程：
 * 1. 创建流式请求（stream: true）
 * 2. 监听事件，逐块发送给客户端
 * 3. 流结束时发送 [DONE] 标记
 */
async function handleClaudeChat(res, messages) {
  try {
    console.log(`\n📤 调用 Anthropic API (${MODEL})...`);

    // 提取系统消息和对话消息
    const systemMessage =
      messages.find((m) => m.role === "system")?.content || "";
    const chatMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

    /**
     * 创建流式消息请求
     *
     * Anthropic API 与 OpenAI 的区别：
     * - system 消息单独作为参数传入
     * - max_tokens 是必需参数
     * - 使用 .stream() 方法
     */
    const stream = await anthropic.messages.stream({
      model: MODEL,
      max_tokens: 4096,
      system: systemMessage,
      messages: chatMessages,
    });

    /**
     * 监听流式事件
     *
     * Anthropic 流式响应的事件类型：
     * - content_block_delta: 增量内容
     * - message_stop: 消息结束
     */
    for await (const event of stream) {
      // 提取增量内容
      if (event.type === "content_block_delta") {
        const content = event.delta?.text || "";

        if (content) {
          sendSSEChunk(res, {
            id: `chunk-${Date.now()}`,
            content: content,
            done: false,
          });
        }
      }

      // 检查是否结束
      if (event.type === "message_stop") {
        console.log("✅ Claude 响应完成");
      }
    }

    // 发送结束标记
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("❌ Anthropic API 错误:", error.message);

    // 发送错误信息
    sendSSEChunk(res, {
      id: "error",
      content: `\n\n❌ API 错误: ${error.message}`,
      done: false,
    });

    res.write("data: [DONE]\n\n");
    res.end();
  }
}

/**
 * 处理聊天请求
 */
async function handleChat(req, res) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
  }

  const { messages, stream = true } = JSON.parse(body);
  const lastUserMessage =
    messages.filter((m) => m.role === "user").pop()?.content || "";

  console.log(`\n💬 收到消息: ${lastUserMessage.slice(0, 50)}...`);
  console.log(`   模式: ${USE_MOCK ? "🎭 模拟" : "🤖 OpenAI"}`);

  if (stream) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    if (USE_MOCK) {
      await handleMockChat(res, lastUserMessage);
    } else {
      // ⭐ 调用真实 Anthropic Claude API
      await handleClaudeChat(res, messages);
    }
  } else {
    res.setHeader("Content-Type", "application/json");

    if (USE_MOCK) {
      const response = generateMockResponse(lastUserMessage);
      res.end(JSON.stringify({ id: "mock-1", content: response }));
    } else {
      // 非流式 Claude API
      const systemMessage =
        messages.find((m) => m.role === "system")?.content || "";
      const chatMessages = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        }));

      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 4096,
        system: systemMessage,
        messages: chatMessages,
      });

      res.end(
        JSON.stringify({
          id: response.id,
          content: response.content[0].text,
        }),
      );
    }
  }
}

// ==================== 服务器 ====================

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.url === "/api/chat" && req.method === "POST") {
    await handleChat(req, res);
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`
🚀 AI 服务器已启动！

   地址: http://localhost:${PORT}
   模式: ${USE_MOCK ? "🎭 模拟模式" : "🤖 Anthropic Claude API"}
   ${!USE_MOCK ? `模型: ${MODEL}` : ""}

   ${
     USE_MOCK
       ? "💡 提示: 在 .env 中设置 USE_MOCK=false 可切换到真实 API"
       : "💡 提示: 确保已在 .env 中配置 ANTHROPIC_API_KEY"
   }
  `);
});
