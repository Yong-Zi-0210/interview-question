<script setup lang="ts">
import { onMounted } from "vue";
import { useChatStore } from "@/stores";
import { ConversationList, ChatPanel } from "@/components";

const chatStore = useChatStore();

// 初始化时创建一个默认会话
onMounted(() => {
  if (chatStore.conversations.length === 0) {
    chatStore.createConversation("新对话");
  }
});
</script>

<template>
  <div class="app-container">
    <!-- 侧边栏：会话列表 -->
    <ConversationList />

    <!-- 主区域：聊天面板 -->
    <ChatPanel />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
