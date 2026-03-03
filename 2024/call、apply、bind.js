Function.prototype.myCall = function (ctx, ...rest) {
  if (typeof ctx === "undefined" || ctx === null) {
    ctx = window;
  }
  ctx.fn = this;
  const res = ctx.fn(...rest);
  delete ctx.fn;
  return res;
};

// apply与call只是传参不一样，其余一样
Function.prototype.myApply = function (ctx, args = []) {
  if (typeof ctx === "undefined" || ctx === null) {
    ctx = window;
  }
  ctx.fn = this;
  const res = ctx.fn(...args);
  delete ctx.fn;
  return res;
};

// bind
Function.mybind = function (ctx, ...rest) {
  const fn = this;
  if (typeof fn !== "function") {
    throw new Error(`${this}.bind is not a function`);
  }
  if (typeof ctx === "undefined" || ctx === null) {
    ctx = window;
  }
  function fNop() {}
  function fBound() {
    fn.apply(this instanceof fNop ? this : ctx, [...rest, ...arguments]);
  }
  fNop.prototype = this.prototype;
  fBound.prototype = new fNop();
  return fBound;
};
