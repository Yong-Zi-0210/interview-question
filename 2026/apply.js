function apply(conotext, args = []) {
  if (typeof this !== "function") {
    throw new TypeError(`${this}.apply is not a function`);
  }
  const fnSymbol = Symbol();
  context[fnSymbol] = this;
  const res = conotext[fnSymbol](...args);
  delete conotext[fnSymbol];
  return res;
}
