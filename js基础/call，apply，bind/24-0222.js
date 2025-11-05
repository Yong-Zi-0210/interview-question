/**
 * 1、改变上下文，即this的指向，如果传入的是null,则上下文是window
 * 2、把自身作为对象的属性，然后执行
 * 3、把这个函数从原对象上删除
 * 4、返回执行的结果
 */

// call
Function.prototype.call2 = function (context) {
  if (typeof context === "undefined" || context === null) {
    context = window;
  }
  const args = [...arguments].slice(1);
  const fnSymbol = Symbol();
  context[fnSymbol] = this;
  const result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};

/**
 * apply与call作用相同，只是传参不一样，apply的第二参数是数组
 */
Function.prototype.apply2 = function (context, args = []) {
  if (typeof context === "undefined" || context === null) {
    context = window;
  }
  const fnSybmol = Symbol();
  context[fnSybmol] = this;
  const result = context[fnSybmol](...args);
  delete context[fnSybmol];
  return result;
};

/**
 * bind
 * 1、传参方式和call一样
 * 2、返回一个新的函数
 * 3、返回函数的原型指向原函数的原型（调用bind的函数）
 * 4、返回的函数可以作为构造函数使用，但此时this是undefined
 *
 */
Function.prototype.bind2 = function (context) {
  if (context === null || typeof context === "undefined") {
    context = window;
  }
  const self = this;
  const args = [...arguments].slice(1);
  function fBound() {
    const newArgs = args.concat([...arguments]);
    return self(this instanceof fNop ? this : context, newArgs);
  }
  function fNop() {}
  fNop.prototype = this.prototype;
  fBound.prototype = new fNop();
  return fBound;
};
