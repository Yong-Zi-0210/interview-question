function throttle(fn, delazy) {
  let startTime = 0; // 初始时间
  return function () {
    const currentTime = Date.now();
    if (currentTime - startTime >= delazy) {
      startTime = currentTime;
      return fn.call(this, ...arguments);
    }
  };
}

// 一段时间内多次触发的事件只执行最后一次

function throttle(fn, dealzy) {
  let startTime = 0;
  return function () {
    let currentTime = Date.now();
    if (currentTime - startTime >= dealzy) {
      startTime = currentTime;
      return fn.apply(this, arguments);
    }
  };
}
