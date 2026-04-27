/**
 * SSE (Server-Sent Events) 流式请求工具
 *
 * SSE 是一种服务器向客户端推送数据的技术，基于 HTTP 协议
 * 与 WebSocket 的区别：
 * - SSE 是单向的（服务器 → 客户端），WebSocket 是双向的
 * - SSE 基于 HTTP，更简单，自动重连
 * - SSE 适合流式输出场景（如 AI 对话）
 */

import type { ChatRequest, SSEChunk } from "@/types";

/**
 * 流式聊天请求
 *
 * @param request - 聊天请求参数
 * @param onChunk - 收到数据块时的回调
 * @param onError - 发生错误时的回调
 * @param onComplete - 完成时的回调
 * @returns AbortController 用于取消请求
 *
 * @example
 * ```ts
 * const controller = streamChat(
 *   { messages: [{ role: 'user', content: 'Hello' }] },
 *   (chunk) => console.log(chunk.content),
 *   (error) => console.error(error),
 *   () => console.log('完成')
 * )
 *
 * // 取消请求
 * controller.abort()
 * ```
 */
export function streamChat(
  request: ChatRequest,
  onChunk: (chunk: SSEChunk) => void,
  onError: (error: Error) => void,
  onComplete: () => void,
): AbortController {
  // AbortController 用于取消 fetch 请求
  const controller = new AbortController();

  // 立即执行异步函数
  (async () => {
    try {
      // 发起 POST 请求，获取流式响应
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...request,
          stream: true, // 启用流式输出
        }),
        signal: controller.signal, // 传入 signal 以支持取消
      });

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 获取响应体的 ReadableStream
      // response.body 是一个 ReadableStream<Uint8Array>
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("无法获取响应流");
      }

      // TextDecoder 用于将 Uint8Array 解码为字符串
      const decoder = new TextDecoder();

      // 用于存储不完整的数据行
      let buffer = "";

      // 循环读取数据流
      while (true) {
        // read() 返回 { done, value }
        // done: 是否读取完成
        // value: Uint8Array 数据块
        const { done, value } = await reader.read();

        // 流读取完成
        if (done) {
          onComplete();
          break;
        }

        // 将二进制数据解码为字符串
        // stream: true 表示这是流的一部分，可能包含不完整的多字节字符
        buffer += decoder.decode(value, { stream: true });

        // SSE 格式：每行数据以 "data: " 开头，以 "\n\n" 结尾
        // 例如: "data: {"content": "Hello"}\n\n"
        const lines = buffer.split("\n");

        // 保留最后一个可能不完整的行
        buffer = lines.pop() || "";

        // 处理每一行数据
        for (const line of lines) {
          // 跳过空行和非数据行
          if (!line.startsWith("data:")) continue;

          // 提取 JSON 数据（去掉 "data: " 前缀）
          const jsonStr = line.slice(5).trim();

          // 跳过空数据
          if (!jsonStr) continue;

          // [DONE] 表示流结束（OpenAI 的约定）
          if (jsonStr === "[DONE]") {
            onComplete();
            return;
          }

          try {
            // 解析 JSON 数据
            const chunk: SSEChunk = JSON.parse(jsonStr);
            onChunk(chunk);
          } catch (e) {
            // JSON 解析失败，可能是数据不完整
            console.warn("JSON 解析失败:", jsonStr);
          }
        }
      }
    } catch (error) {
      // 如果是手动取消，不触发错误回调
      if ((error as Error).name === "AbortError") {
        console.log("请求已取消");
        return;
      }
      onError(error as Error);
    }
  })();

  return controller;
}

/**
 * 非流式聊天请求（一次性返回完整响应）
 */
export async function chat(request: ChatRequest) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...request,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
