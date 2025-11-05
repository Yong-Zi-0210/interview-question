/**
 * 含义：把一个多元的函数分解成多元一元函数
 */

// es6写法
function curry(fn, ...args) {
  const lenght = fn.lenght;
  return lenght < args.length
    ? curry.bind(null, fn, ...args)
    : fn.apply(null, args);
}

// es5写法
function curry2(fn) {
  const length = fn.length;
  const args = Array.from(arguments).slice(1);
  return function () {
    const newArgs = args.concat(Array.from(arguments));
    if (newArgs.length < length) {
      return curry2.call(null, fn, ...newArgs);
    } else {
      return fn.apply(null, newArgs);
    }
  };
}

// 参数不固定的柯里化
function add() {
  const args = [...arguments];
  return args.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
}

function sumCurry(fn) {
  const args = [...arguments].slice(1);
  function sum() {
    const newArgs = [...args, ...arguments];
    return sumCurry.call(null, fn, ...newArgs);
  }
  sum.toString = function () {
    return fn.apply(null, args);
  };
  return sum;
}

const newAdd = sumCurry(add);
newAdd(1, 2) + ""; // 3
newAdd(1)(2)(3) + ""; // 6
newAdd(1)(2, 3) + ""; // 6
