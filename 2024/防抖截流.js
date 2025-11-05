// 截流函数，频繁执行函数会按照固定的频率执行，起到稀释的作用
// 鼠标滚动事件
function throttle(fn, dealzy) {
  const startTime = 0;
  return function (...rest) {
    const currentTime = Date.now();
    if (currentTime - startTime >= dealzy) {
      startTime = currentTime;
      return fn.apply(this, rest);
    }
  };
}

// 防抖函数，一段时间内多次执行只会触发最后一次
function debounce(fn, dealzy) {
  let timer = null;
  return function (...rest) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, rest);
      timer = null;
    }, dealzy);
  };
}

// 优化首次点击不触发
function debounce(fn, dealzy) {
  let timer = null;
  return function (...rest) {
    const firstClick = !timer;
    if (timer) {
      clearTimeout(timer);
    }
    if (firstClick) {
      fn.apply(this, rest);
    }
    timer = setTimeout(() => {
      timer = null;
    }, dealzy);
  };
}
