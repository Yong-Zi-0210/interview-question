<!--
  消息气泡组件
  
  功能：
  1. 根据角色显示不同样式（用户/AI）
  2. Markdown 渲染
  3. 代码高亮
  4. 打字机效果（流式输出时）
-->

<script setup lang="ts">
import { computed, watch, onMounted } from "vue";
import { useMarkdown, useTypewriter } from "@/composables";
import type { ChatMessage } from "@/types";

const props = defineProps<{
  message: ChatMessage;
}>();

// 打字机效果（仅用于流式输出的 AI 消息）
const { displayText, addText, flush } = useTypewriter({ delay: 20 });

// 是否是用户消息
const isUser = computed(() => props.message.role === "user");

// 是否正在流式输出
const isStreaming = computed(() => props.message.status === "streaming");

// 显示的文本内容
const displayContent = computed(() => {
  // 流式输出时使用打字机效果的文本
  if (isStreaming.value) {
    return displayText.value;
  }
  // 否则直接显示消息内容
  return props.message.content;
});

// Markdown 渲染
const { renderedHtml } = useMarkdown(() => displayContent.value);

// 监听消息内容变化（流式输出时）
let lastLength = 0;
watch(
  () => props.message.content,
  (newContent) => {
    if (isStreaming.value && newContent.length > lastLength) {
      // 添加新增的文本到打字机队列
      const newText = newContent.slice(lastLength);
      addText(newText);
      lastLength = newContent.length;
    }
  },
  { immediate: true },
);

// 状态变为完成时，立即显示所有内容
watch(
  () => props.message.status,
  (status) => {
    if (status === "done") {
      flush();
      lastLength = 0;
    }
  },
);

// 格式化时间
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div
    class="message-bubble"
    :class="{
      'message-user': isUser,
      'message-assistant': !isUser,
      'message-streaming': isStreaming,
    }"
  >
    <!-- 头像 -->
    <div class="message-avatar">
      <span v-if="isUser">👤</span>
      <span v-else>🤖</span>
    </div>

    <!-- 消息内容 -->
    <div class="message-content">
      <!-- 角色标签 -->
      <div class="message-header">
        <span class="message-role">{{ isUser ? "你" : "AI 助手" }}</span>
        <span class="message-time">{{ formatTime(message.timestamp) }}</span>
      </div>

      <!-- 消息正文（Markdown 渲染） -->
      <div class="message-body markdown-body" v-html="renderedHtml"></div>

      <!-- 流式输出指示器 -->
      <span v-if="isStreaming" class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </span>

      <!-- Token 统计 -->
      <div v-if="message.tokens" class="message-tokens">
        约 {{ message.tokens }} tokens
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-bubble {
  display: flex;
  gap: 12px;
  padding: 16px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.message-user .message-avatar {
  background: #3b82f6;
}

.message-content {
  max-width: 70%;
  min-width: 100px;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.message-user .message-header {
  flex-direction: row-reverse;
}

.message-role {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.message-time {
  font-size: 12px;
  color: #9ca3af;
}

.message-body {
  background: #f3f4f6;
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.6;
  word-break: break-word;
}

.message-user .message-body {
  background: #3b82f6;
  color: white;
}

.message-tokens {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  text-align: right;
}

/* 打字指示器动画 */
.typing-indicator {
  display: inline-flex;
  gap: 4px;
  margin-left: 8px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #9ca3af;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Markdown 样式 */
.markdown-body :deep(p) {
  margin: 0 0 8px;
}

.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(pre) {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 12px;
  overflow-x: auto;
  margin: 8px 0;
}

.markdown-body :deep(code) {
  font-family: "Fira Code", "Consolas", monospace;
  font-size: 14px;
}

.markdown-body :deep(pre code) {
  color: #d4d4d4;
}

.markdown-body :deep(:not(pre) > code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.message-user .markdown-body :deep(:not(pre) > code) {
  background: rgba(255, 255, 255, 0.2);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.markdown-body :deep(a) {
  color: #3b82f6;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.message-user .markdown-body :deep(a) {
  color: #bfdbfe;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid #d1d5db;
  margin: 8px 0;
  padding-left: 12px;
  color: #6b7280;
}
</style>
