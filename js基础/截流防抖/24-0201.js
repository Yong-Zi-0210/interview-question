// 防抖，等待一段时间后执行，如果在等着的时候触发了从新计时
function debounce(fn, time) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.call(this, ...arguments);
      timer = null;
    }, time);
  };
}

// 截流：一段时间内只执行一次，降低事件执行的频率
function throttle(fn, time) {
  let startTime = 0;
  return function () {
    const currentTime = Date.now();
    if (currentTime - startTime >= time) {
      startTime = currentTime;
      return fn.call(this, ...arguments);
    }
  };
}
