function myBind() {
  const context = [...arguments][0];
  const args = [...arguments].slice(1);
  const fn = this;
  function fNOP() {}
  const boundFn = function () {
    const newArgs = [...arguments, ...args];
    return fn.apply(this instanceof fNOP ? this : context, newArgs);
  };

  fNOP.prototype = this.prototype;
  boundFn.prototype = new fNOP();

  return boundFn;
}
