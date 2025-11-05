// es6写法

Function.prototype.myCall = function (ctx, ...args) {
  if (typeof ctx === "undefined" || ctx === null) {
    ctx = window;
  }
  const fnSymbol = Symbol();
  ctx[fnSymbol] = this;
  const res = ctx[fnSymbol](...args);
  delete ctx[fnSymbol];
  return res;
};

Function.prototype.myApply = function (ctx, arr = []) {
  if (typeof ctx === "undefined" || ctx === null) {
    ctx = window;
  }
  const fnSymbol = Symbol();
  ctx[fnSymbol] = this;
  const res = ctx[fnSymbol](...arr);
  delete ctx[fnSymbol];
  return res;
};

Function.prototype.myBind = function (ctx) {
  if (typeof ctx === "undefined" || ctx === null) {
    ctx = window;
  }
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function`);
  }
  const self = this;
  const args1 = [...arguments].slice(1);
  const fNOP = function () {};
  const fBound = function () {
    const args2 = [...arguments];
    self.apply(this instanceof fNOP ? this : ctx, args1.concat(args2));
  };
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
