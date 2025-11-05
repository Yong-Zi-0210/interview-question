/**
 * call
 * 参数不定
 */

function call(ctx, ...args) {
  if (ctx === null || typeof ctx === "undefined") {
    ctx = window;
  }
  const symbol = Symbol();
  ctx[symbol] = this;
  const res = ctx[symbol](...args);
  delete ctx[symbol];
  return res;
}

// apply
function apply(ctx, args = []) {
  if (typeof ctx === "undefined" || ctx === null) {
    ctx = window;
  }
  const fnSymbol = Symbol();
  ctx[fnSymbol] = this;
  const res = ctx[fnSymbol](...args);
  delete ctx[fnSymbol];
  return res;
}

function bind(ctx) {
  if (ctx === null || typeof ctx === "undefined") {
    ctx = window;
  }
  const self = this;
  const args = [...arguments].slice(1);
  const fBound = function () {
    const newArgs = [...args, ...arguments];
    self.apply(this instanceof fNop ? this : ctx, newArgs);
  };
  function fNop() {}
  fNop.prototype = this.prototype;
  fBound.prototype = new fNop();
  return fBound;
}
