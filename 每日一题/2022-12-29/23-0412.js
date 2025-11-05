// es6写法
const curry = (fn, ...args) => {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
};

// es5写法
function curry(fn) {
  const length = fn.length;
  const arr = [...arguments].slice(1);
  return function () {
    const newArr = [...arr, ...arguments];
    if (newArr.length >= length) {
      fn.apply(this, newArr);
    } else {
      return curry.call(this, fn, ...newArr);
    }
  };
}

// 参数长度不定
function curry(fn){
    const arr = [...arguments].slice(1)
    const sum = function(){
        const newArr = [...arr, ...arguments]
        return curry.call(this, fn, ...newArr)
    }
    sum.toString = function(){
        return fn.apply(this, arr)
    }
    return sum
}