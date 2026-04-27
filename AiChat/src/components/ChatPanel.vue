<!--
  聊天面板组件
  
  功能：
  1. 显示消息列表
  2. 自动滚动到底部
  3. 消息输入
  4. 空状态提示
-->

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import { useChatStore } from "@/stores";
import MessageBubble from "./MessageBubble.vue";
import MessageInput from "./MessageInput.vue";

const chatStore = useChatStore();

// 消息列表容器引用
const messagesRef = ref<HTMLElement>();

// 输入框引用
const inputRef = ref<InstanceType<typeof MessageInput>>();

/**
 * 滚动到底部
 */
function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
  });
}

/**
 * 发送消息
 */
async function handleSend(content: string) {
  await chatStore.sendMessage(content);
  scrollToBottom();
}

/**
 * 停止生成
 */
function handleStop() {
  chatStore.stopGeneration();
}

// 监听消息变化，自动滚动
watch(
  () => chatStore.currentMessages.length,
  () => {
    scrollToBottom();
  },
);

// 监听最后一条消息内容变化（流式输出时滚动）
watch(
  () => {
    const messages = chatStore.currentMessages;
    return messages[messages.length - 1]?.content;
  },
  () => {
    scrollToBottom();
  },
);

// 初始化时滚动到底部
onMounted(() => {
  scrollToBottom();
  inputRef.value?.focus();
});
</script>

<template>
  <div class="chat-panel">
    <!-- 消息列表 -->
    <div ref="messagesRef" class="messages-container">
      <!-- 有消息时显示消息列表 -->
      <template v-if="chatStore.currentMessages.length > 0">
        <MessageBubble
          v-for="message in chatStore.currentMessages"
          :key="message.id"
          :message="message"
        />
      </template>

      <!-- 无消息时显示欢迎信息 -->
      <div v-else class="welcome-message">
        <div class="welcome-icon">🤖</div>
        <h2>欢迎使用 AI 智能客服</h2>
        <p>我可以帮助你：</p>
        <ul>
          <li>💡 回答各种问题</li>
          <li>📝 撰写文案和文档</li>
          <li>💻 编写和解释代码</li>
          <li>🎨 提供创意灵感</li>
        </ul>
        <div class="quick-actions">
          <button @click="handleSend('你好，请介绍一下你自己')">
            👋 打个招呼
          </button>
          <button @click="handleSend('用 TypeScript 写一个防抖函数')">
            💻 写段代码
          </button>
          <button @click="handleSend('解释一下 Vue3 的响应式原理')">
            📚 技术问题
          </button>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <MessageInput
      ref="inputRef"
      :loading="chatStore.isLoading"
      @send="handleSend"
      @stop="handleStop"
    />
  </div>
</template>

<style scoped>
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  text-align: center;
  color: #374151;
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.welcome-message h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px;
}

.welcome-message p {
  color: #6b7280;
  margin: 0 0 16px;
}

.welcome-message ul {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  text-align: left;
}

.welcome-message li {
  padding: 8px 0;
  font-size: 15px;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.quick-actions button {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-actions button:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}
</style>
