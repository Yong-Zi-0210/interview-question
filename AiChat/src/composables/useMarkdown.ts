/**
 * Markdown 渲染 Hook
 *
 * 使用 markdown-it 将 Markdown 文本渲染为 HTML
 * 集成 highlight.js 实现代码高亮
 */

import { computed } from "vue";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

// 创建 markdown-it 实例
// 配置说明：
// - html: 是否允许 HTML 标签
// - linkify: 自动将 URL 转换为链接
// - typographer: 启用排版优化（引号、破折号等）
// - highlight: 代码高亮函数
const md = new MarkdownIt({
  html: false, // 禁用 HTML 标签（安全考虑）
  linkify: true, // 自动识别 URL
  typographer: true, // 排版优化

  /**
   * 代码高亮函数
   * @param str - 代码内容
   * @param lang - 语言标识（如 'javascript'、'python'）
   * @returns 高亮后的 HTML
   */
  highlight: function (str: string, lang: string): string {
    // 如果指定了语言且 highlight.js 支持该语言
    if (lang && hljs.getLanguage(lang)) {
      try {
        // 使用 highlight.js 进行高亮
        const result = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true, // 忽略非法语法
        });

        // 返回带有语言类名的 pre 标签
        // 这样可以应用对应语言的样式
        return `<pre class="hljs"><code class="language-${lang}">${result.value}</code></pre>`;
      } catch (e) {
        console.warn("代码高亮失败:", e);
      }
    }

    // 未指定语言或高亮失败，返回转义后的代码
    // md.utils.escapeHtml 用于转义 HTML 特殊字符
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

/**
 * 添加自定义渲染规则
 *
 * 这里为链接添加 target="_blank" 和 rel="noopener"
 * 使链接在新标签页打开，并防止安全问题
 */
const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // 添加 target="_blank"
  const targetIndex = tokens[idx].attrIndex("target");
  if (targetIndex < 0) {
    tokens[idx].attrPush(["target", "_blank"]);
  }

  // 添加 rel="noopener noreferrer"（安全措施）
  const relIndex = tokens[idx].attrIndex("rel");
  if (relIndex < 0) {
    tokens[idx].attrPush(["rel", "noopener noreferrer"]);
  }

  return defaultRender(tokens, idx, options, env, self);
};

/**
 * Markdown 渲染 Hook
 *
 * @param getText - 获取 Markdown 文本的函数或响应式引用
 * @returns 渲染后的 HTML（computed）
 *
 * @example
 * ```vue
 * <script setup>
 * const content = ref('# Hello\n```js\nconsole.log("hi")\n```')
 * const { renderedHtml } = useMarkdown(() => content.value)
 * </script>
 *
 * <template>
 *   <div v-html="renderedHtml" class="markdown-body"></div>
 * </template>
 * ```
 */
export function useMarkdown(getText: () => string) {
  // 使用 computed 实现响应式渲染
  // 当源文本变化时，自动重新渲染
  const renderedHtml = computed(() => {
    const text = getText();
    if (!text) return "";

    // 调用 markdown-it 的 render 方法
    return md.render(text);
  });

  return {
    renderedHtml,
    // 也导出 md 实例，方便扩展
    md,
  };
}

/**
 * 直接渲染 Markdown 文本（非响应式）
 */
export function renderMarkdown(text: string): string {
  return md.render(text);
}
