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

function throttle(fn, dealzy) {
  let startTime = 0;
  return function () {
    let currentTime = Date.now();
    if (currentTime - startTime >= dealzy) {
      fn.apply(this, arguments);
      startTime = currentTime;
    }
  };
}
