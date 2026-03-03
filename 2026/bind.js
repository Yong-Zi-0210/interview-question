// bind
function bind(context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError(`${this}.bind is not a function`);
  }
  if (context === null || typeof context === "undefined") {
    context = window;
  }
  const fn = this;
  const boundFunction = () => {
    const isNew = this instanceof fNop;
    fn.apply(isNew ? this : context, [...args, ...arguments]);
  };
  function fNop() {}
  fNop.prototype = fn.prototype;
  boundFunction.prototype = new fNop();
  return boundFunction();
}
