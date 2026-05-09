// 参数长度固定的柯里化
function curry(fn) {
  return function curried(...args) {
    // 参数够了，直接执行
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // 参数不够，返回新函数继续收集
    return function(...args2) {
      return curried.apply(this, args.concat(args2));
    };
  };
}


// es6写法
function esCurry(fn, ...args) {
  return fn.length <= args.length
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
