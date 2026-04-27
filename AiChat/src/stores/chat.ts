/**
 * 聊天状态管理 Store
 *
 * 使用 Pinia 管理全局聊天状态：
 * - 会话列表
 * - 当前会话
 * - 消息发送/接收
 * - Token 统计
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import { streamChat } from "@/api";
import type { ChatMessage, Conversation, MessageRole, SSEChunk } from "@/types";

/**
 * 估算 Token 数量
 *
 * Token 是 LLM 处理文本的基本单位
 * 粗略估计规则：
 * - 中文：1 个字 ≈ 2 tokens
 * - 英文：1 个词 ≈ 1 token
 * - 标点符号：1 个 ≈ 1 token
 */
function estimateTokens(text: string): number {
  if (!text) return 0;

  // 简化估算：字符数 * 1.5
  // 实际生产中应该使用 tiktoken 等库精确计算
  return Math.ceil(text.length * 1.5);
}

/**
 * 上下文截断
 *
 * 当对话历史过长时，需要截断以避免超出 Token 限制
 * 策略：保留系统消息 + 最近的 N 条消息
 *
 * @param messages - 消息列表
 * @param maxTokens - 最大 Token 数（默认 4000）
 */
function truncateContext(
  messages: ChatMessage[],
  maxTokens: number = 4000,
): ChatMessage[] {
  // 找出系统消息（如果有）
  const systemMsg = messages.find((m) => m.role === "system");

  // 过滤出对话消息
  const conversationMsgs = messages.filter((m) => m.role !== "system");

  // 计算系统消息的 Token 数
  let totalTokens = estimateTokens(systemMsg?.content || "");

  // 结果数组，系统消息放在最前面
  const result: ChatMessage[] = systemMsg ? [systemMsg] : [];

  // 从后往前遍历，保留最近的消息
  for (let i = conversationMsgs.length - 1; i >= 0; i--) {
    const msg = conversationMsgs[i];
    const msgTokens = estimateTokens(msg.content);

    // 如果加上这条消息会超出限制，停止
    if (totalTokens + msgTokens > maxTokens) {
      break;
    }

    // 将消息插入到结果数组的前面（保持顺序）
    result.splice(systemMsg ? 1 : 0, 0, msg);
    totalTokens += msgTokens;
  }

  return result;
}

export const useChatStore = defineStore("chat", () => {
  // ==================== State ====================

  /** 会话列表 */
  const conversations = ref<Conversation[]>([]);

  /** 当前会话 ID */
  const currentConversationId = ref<string | null>(null);

  /** 是否正在加载（等待 AI 响应） */
  const isLoading = ref(false);

  /** 当前请求的 AbortController（用于取消请求） */
  let abortController: AbortController | null = null;

  /** 系统提示词 */
  const systemPrompt = ref(`你是一个友好的 AI 助手。请用中文回答用户的问题。
如果用户的问题涉及代码，请提供清晰的代码示例和解释。`);

  // ==================== Getters ====================

  /** 当前会话 */
  const currentConversation = computed(() => {
    return conversations.value.find(
      (c) => c.id === currentConversationId.value,
    );
  });

  /** 当前会话的消息列表 */
  const currentMessages = computed(() => {
    return currentConversation.value?.messages || [];
  });

  /** Token 统计 */
  const tokenStats = computed(() => {
    const messages = currentMessages.value;
    const total = messages.reduce(
      (sum, msg) => sum + estimateTokens(msg.content),
      0,
    );
    return {
      total,
      remaining: 4000 - total, // 假设上下文限制为 4000
    };
  });

  // ==================== Actions ====================

  /**
   * 创建新会话
   */
  function createConversation(title?: string): string {
    const id = uuidv4();
    const now = Date.now();

    const conversation: Conversation = {
      id,
      title: title || `新对话 ${conversations.value.length + 1}`,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    conversations.value.push(conversation);
    currentConversationId.value = id;

    return id;
  }

  /**
   * 切换会话
   */
  function switchConversation(id: string) {
    const conversation = conversations.value.find((c) => c.id === id);
    if (conversation) {
      currentConversationId.value = id;
    }
  }

  /**
   * 删除会话
   */
  function deleteConversation(id: string) {
    const index = conversations.value.findIndex((c) => c.id === id);
    if (index > -1) {
      conversations.value.splice(index, 1);

      // 如果删除的是当前会话，切换到第一个会话
      if (currentConversationId.value === id) {
        currentConversationId.value = conversations.value[0]?.id || null;
      }
    }
  }

  /**
   * 添加消息到当前会话
   */
  function addMessage(
    role: MessageRole,
    content: string,
    status: ChatMessage["status"] = "done",
  ): ChatMessage {
    if (!currentConversation.value) {
      createConversation();
    }

    const message: ChatMessage = {
      id: uuidv4(),
      role,
      content,
      timestamp: Date.now(),
      status,
      tokens: estimateTokens(content),
    };

    currentConversation.value!.messages.push(message);
    currentConversation.value!.updatedAt = Date.now();

    return message;
  }

  /**
   * 更新消息内容
   */
  function updateMessage(messageId: string, updates: Partial<ChatMessage>) {
    const message = currentMessages.value.find((m) => m.id === messageId);
    if (message) {
      Object.assign(message, updates);
      if (updates.content) {
        message.tokens = estimateTokens(updates.content);
      }
    }
  }

  /**
   * 发送消息并获取 AI 回复
   *
   * 这是核心功能，实现流式对话：
   * 1. 添加用户消息
   * 2. 创建空的 AI 消息占位
   * 3. 发起 SSE 请求
   * 4. 逐块更新 AI 消息内容
   */
  async function sendMessage(content: string): Promise<void> {
    // 确保有当前会话
    if (!currentConversation.value) {
      createConversation();
    }

    // 添加用户消息
    addMessage("user", content);

    // 创建 AI 消息占位符
    const aiMessage = addMessage("assistant", "", "streaming");

    // 设置加载状态
    isLoading.value = true;

    // 准备请求消息（包含上下文截断）
    const contextMessages = truncateContext(currentMessages.value);

    // 添加系统提示词
    const requestMessages = [
      { role: "system" as const, content: systemPrompt.value },
      ...contextMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // 发起流式请求
    abortController = streamChat(
      { messages: requestMessages },

      // onChunk: 收到数据块时更新消息
      (chunk: SSEChunk) => {
        const currentContent = aiMessage.content + chunk.content;
        updateMessage(aiMessage.id, { content: currentContent });
      },

      // onError: 发生错误时更新状态
      (error: Error) => {
        console.error("Chat error:", error);
        updateMessage(aiMessage.id, {
          status: "error",
          content: aiMessage.content || `发生错误: ${error.message}`,
        });
        isLoading.value = false;
        abortController = null;
      },

      // onComplete: 完成时更新状态
      () => {
        updateMessage(aiMessage.id, { status: "done" });
        isLoading.value = false;
        abortController = null;

        // 更新会话标题（使用第一条消息）
        if (currentConversation.value!.messages.length === 2) {
          currentConversation.value!.title =
            content.slice(0, 20) + (content.length > 20 ? "..." : "");
        }
      },
    );
  }

  /**
   * 停止生成
   */
  function stopGeneration() {
    if (abortController) {
      abortController.abort();
      abortController = null;
      isLoading.value = false;

      // 更新最后一条消息的状态
      const lastMessage =
        currentMessages.value[currentMessages.value.length - 1];
      if (lastMessage && lastMessage.status === "streaming") {
        updateMessage(lastMessage.id, { status: "done" });
      }
    }
  }

  /**
   * 重新生成最后一条 AI 回复
   */
  async function regenerateLastResponse() {
    const messages = currentMessages.value;
    if (messages.length < 2) return;

    // 找到最后一条用户消息
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");
    if (!lastUserMessage) return;

    // 删除最后一条 AI 消息
    const lastAiMessageIndex = messages.length - 1;
    if (messages[lastAiMessageIndex].role === "assistant") {
      currentConversation.value!.messages.pop();
    }

    // 重新发送
    await sendMessage(lastUserMessage.content);
  }

  /**
   * 清空当前会话消息
   */
  function clearCurrentMessages() {
    if (currentConversation.value) {
      currentConversation.value.messages = [];
      currentConversation.value.updatedAt = Date.now();
    }
  }

  return {
    // State
    conversations,
    currentConversationId,
    isLoading,
    systemPrompt,

    // Getters
    currentConversation,
    currentMessages,
    tokenStats,

    // Actions
    createConversation,
    switchConversation,
    deleteConversation,
    addMessage,
    updateMessage,
    sendMessage,
    stopGeneration,
    regenerateLastResponse,
    clearCurrentMessages,
  };
});
