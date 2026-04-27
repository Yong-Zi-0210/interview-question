<!--
  会话列表组件
  
  功能：
  1. 显示所有会话
  2. 创建新会话
  3. 切换会话
  4. 删除会话
-->

<script setup lang="ts">
import { useChatStore } from "@/stores";
import type { Conversation } from "@/types";

const chatStore = useChatStore();

/**
 * 创建新会话
 */
function handleCreate() {
  chatStore.createConversation();
}

/**
 * 切换会话
 */
function handleSelect(conversation: Conversation) {
  chatStore.switchConversation(conversation.id);
}

/**
 * 删除会话
 */
function handleDelete(event: Event, conversation: Conversation) {
  event.stopPropagation();

  if (confirm(`确定要删除会话 "${conversation.title}" 吗？`)) {
    chatStore.deleteConversation(conversation.id);
  }
}

/**
 * 格式化时间
 */
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  // 今天的消息只显示时间
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // 其他日期显示完整日期
  return date.toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  });
}
</script>

<template>
  <div class="conversation-list">
    <!-- 标题和新建按钮 -->
    <div class="list-header">
      <h2>对话列表</h2>
      <button class="btn-new" @click="handleCreate" title="新建对话">➕</button>
    </div>

    <!-- 会话列表 -->
    <div class="list-content">
      <div
        v-for="conversation in chatStore.conversations"
        :key="conversation.id"
        class="conversation-item"
        :class="{ active: conversation.id === chatStore.currentConversationId }"
        @click="handleSelect(conversation)"
      >
        <div class="item-icon">💬</div>
        <div class="item-content">
          <div class="item-title">{{ conversation.title }}</div>
          <div class="item-time">{{ formatTime(conversation.updatedAt) }}</div>
        </div>
        <button
          class="btn-delete"
          @click="(e) => handleDelete(e, conversation)"
          title="删除对话"
        >
          🗑️
        </button>
      </div>

      <!-- 空状态 -->
      <div v-if="chatStore.conversations.length === 0" class="empty-state">
        <p>暂无对话</p>
        <button class="btn-create" @click="handleCreate">开始新对话</button>
      </div>
    </div>

    <!-- Token 统计 -->
    <div v-if="chatStore.currentConversation" class="token-stats">
      <span>Token: {{ chatStore.tokenStats.total }} / 4000</span>
      <div class="token-bar">
        <div
          class="token-progress"
          :style="{
            width:
              Math.min((chatStore.tokenStats.total / 4000) * 100, 100) + '%',
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.conversation-list {
  width: 280px;
  height: 100%;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.list-header h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.btn-new {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-new:hover {
  background: #2563eb;
}

.list-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.conversation-item:hover {
  background: #e5e7eb;
}

.conversation-item.active {
  background: #dbeafe;
}

.item-icon {
  font-size: 20px;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-time {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.btn-delete {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  opacity: 0;
  transition: all 0.2s;
}

.conversation-item:hover .btn-delete {
  opacity: 1;
}

.btn-delete:hover {
  background: #fee2e2;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.btn-create {
  margin-top: 12px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-create:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.token-stats {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  font-size: 12px;
  color: #6b7280;
}

.token-bar {
  margin-top: 8px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.token-progress {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s;
}
</style>
