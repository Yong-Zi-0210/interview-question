// 1、利用拓展元算符递归
function flatten(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

// 2、利用reduce递归
function flatten(arr) {
  return arr.reduce((prev, next) => {
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}

// 3、for循环递归
function flatten(arr) {
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      res = res.concat(flatten(arr[i]));
    } else {
      res.push(arr[i]);
    }
  }
  return res;
}

// flat, 需要知道是几维数据，如n维数组flat(n)
function flatten(arr, n) {
  return arr.flat(n);
}
