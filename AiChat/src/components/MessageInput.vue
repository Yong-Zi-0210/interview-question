<!--
  消息输入组件
  
  功能：
  1. 文本输入框
  2. 发送按钮
  3. 停止生成按钮
  4. 快捷键支持（Enter 发送，Shift+Enter 换行）
-->

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  loading?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  send: [content: string];
  stop: [];
}>();

// 输入内容
const inputContent = ref("");

// 输入框引用
const textareaRef = ref<HTMLTextAreaElement>();

// 是否可以发送
const canSend = computed(() => {
  return inputContent.value.trim().length > 0 && !props.loading;
});

/**
 * 发送消息
 */
function handleSend() {
  if (!canSend.value) return;

  const content = inputContent.value.trim();
  inputContent.value = "";

  // 重置输入框高度
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
  }

  emit("send", content);
}

/**
 * 停止生成
 */
function handleStop() {
  emit("stop");
}

/**
 * 处理键盘事件
 * - Enter: 发送消息
 * - Shift + Enter: 换行
 */
function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
}

/**
 * 自动调整输入框高度
 */
function handleInput() {
  const textarea = textareaRef.value;
  if (!textarea) return;

  // 重置高度
  textarea.style.height = "auto";
  // 设置为内容高度
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
}

// 暴露方法
defineExpose({
  focus: () => textareaRef.value?.focus(),
});
</script>

<template>
  <div class="message-input">
    <div class="input-container">
      <!-- 文本输入框 -->
      <textarea
        ref="textareaRef"
        v-model="inputContent"
        :disabled="disabled"
        placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
        rows="1"
        @keydown="handleKeydown"
        @input="handleInput"
      ></textarea>

      <!-- 发送/停止按钮 -->
      <button
        v-if="loading"
        class="btn-stop"
        @click="handleStop"
        title="停止生成"
      >
        ⏹️ 停止
      </button>

      <button
        v-else
        class="btn-send"
        :disabled="!canSend"
        @click="handleSend"
        title="发送消息"
      >
        发送 ➤
      </button>
    </div>

    <!-- 提示信息 -->
    <div class="input-tips">
      <span>AI 可能会产生不准确的信息，请仔细甄别。</span>
    </div>
  </div>
</template>

<style scoped>
.message-input {
  padding: 16px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 12px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.input-container:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  line-height: 1.5;
  max-height: 200px;
  font-family: inherit;
}

textarea::placeholder {
  color: #9ca3af;
}

textarea:disabled {
  background: transparent;
  color: #9ca3af;
}

.btn-send,
.btn-stop {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-send {
  background: #3b82f6;
  color: white;
}

.btn-send:hover:not(:disabled) {
  background: #2563eb;
}

.btn-send:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.btn-stop {
  background: #ef4444;
  color: white;
}

.btn-stop:hover {
  background: #dc2626;
}

.input-tips {
  margin-top: 8px;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
}
</style>
