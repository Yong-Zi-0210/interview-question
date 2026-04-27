/**
 * 消息角色类型
 * - user: 用户消息
 * - assistant: AI 助手消息
 * - system: 系统消息（用于设置 AI 行为）
 */
export type MessageRole = "user" | "assistant" | "system";

/**
 * 消息状态
 * - pending: 等待发送
 * - streaming: 正在流式接收
 * - done: 完成
 * - error: 出错
 */
export type MessageStatus = "pending" | "streaming" | "done" | "error";

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  id: string; // 消息唯一标识
  role: MessageRole; // 消息角色
  content: string; // 消息内容
  timestamp: number; // 时间戳
  status: MessageStatus; // 消息状态
  tokens?: number; // Token 数量（可选）
}

/**
 * 会话接口
 */
export interface Conversation {
  id: string; // 会话唯一标识
  title: string; // 会话标题
  messages: ChatMessage[]; // 消息列表
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
}

/**
 * SSE 流式响应数据块
 */
export interface SSEChunk {
  id: string; // 响应 ID
  content: string; // 内容片段
  done: boolean; // 是否完成
}

/**
 * API 请求参数
 */
export interface ChatRequest {
  messages: Array<{
    role: MessageRole;
    content: string;
  }>;
  stream?: boolean; // 是否流式输出
  temperature?: number; // 温度参数（0-2，越高越随机）
  maxTokens?: number; // 最大 Token 数
}

/**
 * API 响应
 */
export interface ChatResponse {
  id: string;
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
