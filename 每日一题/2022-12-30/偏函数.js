// 含义：将一个
function add(a, b) {
  return a + b;
}

function partial(fn) {
  let args = [...arguments].slice(1);
  return function () {
    let newArgs = [...args, ...arguments];
    return fn.apply(this, newArgs);
  };
}

// 测试

const pAdd = partial(fn, 1);
console.log(pAdd(2)); // 3
