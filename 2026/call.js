/**
 *
 * 可以传多个参数，会改变this指向,
 * 当不传入上下文的时候，this指向window，最好返回函数执行的结果
 */

function call(context, ...rest) {
  if (typeof this !== "function") {
    throw new TypeError(`${this}.call is not a function`);
  }
  const fnSymbol = Symbol();
  context[fnSymbol] = this;
  const res = context[fnSymbol](...rest);
  delete context[fnSymbol];
  return res;
}
