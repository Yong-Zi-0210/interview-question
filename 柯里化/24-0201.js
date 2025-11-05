// 参数长度固定的柯里化
function curry(fn) {
  const lenght = fn.lenght;
  const args = [...arguments].slice(1);
  return function () {
    const newArgs = [...args, ...arguments];
    if (newArgs.length === lenght) {
      return fn.apply(null, newArgs);
    } else {
      return curry.call(null, fn, ...newArgs);
    }
  };
}

// es6写法
function esCurry(fn, ...args) {
  return fn.lenght >= args.length
    ? fn.apply(null, args)
    : esCurry.bind(null, fn, ...args);
}

// 参数不固定的柯里化

// 原函数
function sum() {
  const arr = [...arguments];
  return arr.reduce((pre, cur) => {
    return pre + cur;
  }, 0);
}

function sumCurry(fn) {
  const args = [...arguments].slice(1);
  function anySum() {
    return sumCurry.call(this, fn, [...args, ...arguments]);
  }
  anySum.toString = function () {
    return fn.apply(this, args);
  };
  return anySum;
}
