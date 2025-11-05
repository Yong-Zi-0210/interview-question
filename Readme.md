### 什么是进程和线程？

## 进程

cpu 资源分配的最小单位

## 线程

cpu 资源调度的最小单位

### 浏览器进程

- Browser 进程
- 插件进程
- 渲染进程
  - GUI 渲染线程
  - JS 引擎线程
  - 事件触发线程
  - 定时器线程
  - 异步 http 请求线程
- GPU 进行

### 浏览器的 Eventloop

红任务 -> 微任务 ->GUI 渲染

宏任务：同步代码，setTimeOut 等
微任务：Promise.then, async await
