function curry(fn, args) {
  const length = fn.length;
  const args = args || [];
  return function () {
    const newArguments = [...args, ...arguments];
    if (newArguments.length === length) {
      return fn.apply(null, newArguments);
    } else {
      return curry.call(null, fn, ...newArguments);
    }
  };
}

// es6写法
function curry(fn, ...args) {
  return fn.length > args.length
    ? curry.bind(null, fn, ...args)
    : fn.apply(null, args);
}

// 参数长度不定
function curry(fn) {
  const args = [...arguments].slice(1);
  const sum = function () {
    const newArgs = [...args, ...arguments];
    return curry.call(null, fn, ...newArgs);
  };
  sum.toString = function () {
    return fn.apply(null, args);
  };
  return sum;
}
