// 防抖
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}
// 优化第一次点击不触发计时
function firstDebounce(fn, delay) {
  let timer = null;
  return function () {
    const firstClick = !timer;
    if (timer) {
      clearTimeout(timer);
    }
    if (firstClick) {
      fn.apply(this, arguments);
    }

    timer = setTimeout(() => {
      tiemr = null;
    }, delay);
  };
}

// 节流，定义一个开始时间为0，执行时的当执行函数时的时间减去开始时间大于所设置的延迟时执行原函数
function throttle(fn, delay) {
  let startTime = 0;
  return function () {
    const currentTime = Date.now();
    if (currentTime - startTime >= delay) {
      fn.apply(this, arguments);
      startTime = currentTime;
    }
  };
}
