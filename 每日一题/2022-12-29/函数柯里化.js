// 基础版本
function curry(fn) {
  // 获取参数
  const args = [].slice.call(arguments, 1);
  return function () {
    let newArgs = args.concat([].slice.call(arguments));
    return fn.apply(this, newArgs);
  };
}

function add(a, b) {
  console.log(a + b);
  return a + b;
}
// 第一种方式
const curryAdd = curry(add);
curryAdd(1, 2); // 3

// 第二种方式
const curryAdd2 = curry(add, 1);
curryAdd2(2); // 3

// 第三种方式
const curryAdd3 = curry(add, 1, 2);
curryAdd3(); // 3

// 基础版本不能多次调用方法，进化版本：
// es5写法
const curry2 = function (fn, args) {
  let length = fn.length;
  args = args || [];
  return function () {
    let newArgs = [...args, ...arguments];
    if (newArgs.length >= length) {
      return fn.apply(this, newArgs);
    } else {
      return curry2.call(this, fn, ...newArgs);
    }
  };
};

// es6写法
const curry3 = function (fn, ...args) {
  return fn.length <= args.length
    ? fn(...args)
    : curry3.bind(null, fn, ...args);
};

function f(a, b, c) {
  return [a, b, c];
}

// 测试1
let fn1 = curry2(f, "a");
let fn2 = curry2(fn1, "b");
let fn3 = curry2(fn2, "c");
console.log(fn3); // [a,b,c]

//测试2
let fn = curry2(f);
fn("a", "b", "c"); // ["a", "b", "c"]
fn("a", "b")("c"); // ["a", "b", "c"]
fn("a")("b")("c"); // ["a", "b", "c"]
fn("a")("b", "c"); // ["a", "b", "c"]

// 参数长度不确定的柯里化
function addRes() {
  let arr = [...arguments];
  return arr.reduce((a, b) => {
    return a + b;
  }, 0);
}

function sum_curry(fn) {
  let args = [...arguments].slice(1);
  function sum() {
    const newArgs = [...args, ...arguments];
    return sum_curry.call(null, fn, ...newArgs);
  }
  //重写 函数的toString方法
  sum.toString = function () {
    return fn.apply(null, args);
  };
  // 返回的函数类型是字符串类型，js内部隐士调用toString,所以重现toString方法就可以实现返回值的修改
  return sum;
}

// 测试1
const fnAdd = sum_curry(addRes);
console.log(fnAdd(1, 2) + ""); // 3 这里必须的让返回的结果调用toString才能得到最终结果
console.log(fnAdd(1, 2)(3) + ""); // 6
console.log(fnAdd(1, 2)(3)(4) + ""); // 10

function sumCurry(fn) {
  let args = [...arguments].slice(1);
  const sum = function () {
    let newArgs = args.slice(0);
    let args2 = [...arguments, ...newArgs];
    return sumCurry.call(this, fn, ...args2);
  };
  sum.toString = function () {
    return fn.apply(null, args);
  };
}
