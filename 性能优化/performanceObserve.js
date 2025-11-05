// 获取LCP
// buffered: ture
// 表示把观察者会将触发的事件先进行缓存，而不立即执行回调函数。
// 这样可以将连续的事件合并为一个批量操作，减少了频繁的回调调用，提高了性能和效率。
const lcpObersve = new PerformanceObserver((entry, observe) => {
  const entries = entry.getEntries();
  observe.disconnect();
  console.log(entries[0].startTime);
}).observe({
  type: "largest-contentful-paint",
  buffered: true,
});

// 获取FID
const fidObserve = new PerformanceObserver((entry, observe) => {
  const entries = entry.getEntries();
  observe.disconnect();
  console.log("FID", entries[0].processingStart - entries[0].startTime);
}).observe({
  type: "first-input",
  buffered: true,
});

// 获取CLS
const clsObserve = new PerformanceObserver((entry, observe) => {
  const entries = entry.getEntries();
  entries.disconnect();
}).observe({
  type: "layout-shfit",
  buffered: true,
});
