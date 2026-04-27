/**
 * 打字机效果 Hook
 *
 * 实现 AI 回复的逐字显示效果，模拟打字机输入
 *
 * 原理：
 * 1. 将接收到的文本放入队列
 * 2. 使用定时器逐字取出并显示
 * 3. 队列清空后停止定时器
 */

import { ref, onUnmounted } from "vue";

export interface TypewriterOptions {
  /** 每个字符的延迟时间（毫秒） */
  delay?: number;
  /** 是否立即显示（不使用打字机效果） */
  instant?: boolean;
}

export function useTypewriter(options: TypewriterOptions = {}) {
  const { delay = 30, instant = false } = options;

  // 当前显示的文本
  const displayText = ref("");

  // 待显示的字符队列
  const queue: string[] = [];

  // 是否正在打字
  let isTyping = false;

  // 定时器 ID
  let timerId: number | null = null;

  /**
   * 添加文本到队列
   * 通常在收到 SSE 数据块时调用
   */
  function addText(text: string) {
    if (instant) {
      // 立即显示模式：直接追加文本
      displayText.value += text;
      return;
    }

    // 将文本拆分为字符数组，加入队列
    // 使用扩展运算符可以正确处理 emoji 等多字节字符
    queue.push(...[...text]);

    // 如果没有在打字，启动打字机
    if (!isTyping) {
      startTyping();
    }
  }

  /**
   * 启动打字机效果
   */
  function startTyping() {
    isTyping = true;

    // 使用 setInterval 逐字显示
    timerId = window.setInterval(() => {
      if (queue.length === 0) {
        // 队列清空，停止打字
        stopTyping();
        return;
      }

      // 从队列头部取出一个字符并显示
      displayText.value += queue.shift();
    }, delay);
  }

  /**
   * 停止打字机
   */
  function stopTyping() {
    isTyping = false;
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  /**
   * 立即显示所有剩余文本
   * 用于用户点击"跳过"或需要快速显示的场景
   */
  function flush() {
    displayText.value += queue.join("");
    queue.length = 0;
    stopTyping();
  }

  /**
   * 重置状态
   */
  function reset() {
    displayText.value = "";
    queue.length = 0;
    stopTyping();
  }

  /**
   * 检查是否有待显示的文本
   */
  function hasPending() {
    return queue.length > 0 || isTyping;
  }

  // 组件卸载时清理定时器
  onUnmounted(() => {
    stopTyping();
  });

  return {
    displayText,
    addText,
    flush,
    reset,
    hasPending,
    isTyping: () => isTyping,
  };
}
