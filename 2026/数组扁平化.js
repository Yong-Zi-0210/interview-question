// 1、利用扩展运算符
function flatten(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

// 2、利用reduce
function flatten(arr) {
  arr.reduce((prev, curr) => {
    prev.concat(Array.isArray(curr) ? flatten(curr) : curr);
  }, []);

  return arr;
}

// 3、for循环
function flatten3(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten3(arr(i)));
    }
    result.push(arr[i]);
  }
  return arr;
}

// 明确数组层级情况
function flatten4(arr, n) {
  return arr.flat(n);
}
