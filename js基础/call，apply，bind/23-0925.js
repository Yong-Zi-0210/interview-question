// call、apply、bind改变this指针
// call 与 aplly的区别：
// 传递的参数形式不一样，call可以传多个参数， aplly最多只能传两个参数，
// 第二个参数是数组，数组长度不定，多个元素表示参数个数

// call
function call(ctx, ...args) {
  if (ctx === null || typeof ctx === "undefined") {
    ctx = window;
  }
  // 唯一性
  const symbol = Symbol();
  ctx[symbol] = this;
  const res = ctx[symbol](...args);
  delete ctx[symbol];
  return res;
}

// aplly
function apply(ctx, args = []) {
  if (ctx === null || typeof ctx === "undefined") {
    ctx = window;
  }
  const symbol = Symbol();
  ctx[symbol] = this;
  const res = ctx[symbol](...args);
  delete ctx[symbol];
  return res;
}

// call、 apply 与 bind 的区别：
// call 和 apply 改变this指向的同时会执行函数并返回函数的执行结果
// bind 改变this指向返回新的函数，返回的新函数可以作为构造函数使用

// bind
// 传参与call一样
//
function bind(ctx, ...args) {
  if (ctx === null || typeof ctx === "undefined") {
    ctx = window;
  }
  const self = this;
  const fBound = function () {
    const newArgs = [...args, ...arguments];
    return self.apply(this instanceof fBound ? this : ctx, newArgs);
  };
  // 因为作为构造函数创建出来的实例可以访问到self身上的属性，
  // 所以必须要fBound.prototype = self.prototype,
  // 但是这样直接写的话如果修改了fBound的原型的话就会影响到原来self的原型
  // 所以创建一个空的函数桥接
  function fNop() {}
  fNop.prototype = self.prototype;
  fBound.prototype = new fNop();
  return fBound;
}

function bind(ctx, ...agrs) {
  if (ctx === null || typeof ctx === "undefined") {
    ctx = window;
  }
  const self = this;
  const fBound = function () {
    const newArgs = [...agrs, ...arguments];
    return self.apply(this instanceof fBound ? this : ctx, newArgs);
  };
  function fNop() {}
  fNop.prototype = self.prototype;
  fBound.prototype = new fNop();
  return fBound;
}
