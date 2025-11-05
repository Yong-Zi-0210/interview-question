function add(a, b, c) {
  return a + b + c;
}

function partial(fn) {
  const args = [...arguments].slice(1);
  return function () {
    const newArgs = [...args, ...arguments];
    return fn.apply(null, newArgs);
  };
}

const add1 = partial(add, 1);
const add2 = partial(add, 2, 3);

console.log(add1(2, 3)); // 6
console.log(add2(2)); // 7
