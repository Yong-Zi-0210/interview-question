/**
 * call
 * 特点：
 * 1、改变this的指向，foo.call(obj),执行foo时this指向obj
 * 2、执行调用他的方法 foo.call() 就会执行foo
 * 3、可以传多参数,foo.call(obj,params1,params2,...)
 * 4、传入的对象为空或者不传时，this的指向window
 * 5、如果执行的函数有返回结果则返回执行结果
 */

var obj = {
  value: 1,
  name: "zhangsan",
};
function foo(name) {
  console.log(this.value);
  return {
    value: this.value,
    name,
  };
}
foo.call(obj, "lisi");

// 手写call
Function.prototyp.mycall = function (ctx) {
  ctx = ctx || window;
  ctx.fn = this;

  // Arguments对象 {
  //   0: obj,
  //   1: pramas1,
  //   2: params2
  // }
  let args = [...arguments].slice(1); // 取出后面的参数放到新的数组
  const res = ctx.fn(...args);
  delete ctx.fn;
  return res;
};

// 纯es6写法
Function.prototype.call2 = function (context, ...args) {
  if (typeof context === "undefined" || context === null) {
    context = window;
  }
  let fnSymbol = Symbol(); // 存在意义就是防止污染
  context[fnSymbol] = this;
  const res = context[fnSymbol](...args);
  delete context[fnSymbol];
  return res;
};

/**
 * apply
 *
 * 与call相比除了传递的第二参数不一样，只有两个参数，第一个是this指向的对象，第二个是数组，给个默认值，不给的话不传第二个参数会报错
 */

Function.prototype.apply1 = function (context, arr) {
  context = context || window;
  context.fn = this;
  let res;
  if (!arr) {
    res = context.fn();
  } else {
    res = context.fn(...arr);
  }
  delete context.fn;
  return res;
};

Function.prototype.apply2 = function (context, arr = []) {
  if (typeof context === "undefined" || context === null) {
    context = window;
  }
  const fnSymbol = Symbol();
  context[fnSymbol] = this;
  const res = context[fnSymbol](...arr);
  delete context[fnSymbol];
  return res;
};

/**
 * bind
 * 1、返回一个新的函数
 * 2、改变this指向
 * 3、返回的新函数可以继续传参，并且与绑定时的参数合并传到调用他的函数里
 * 4、绑定时传的参数不定
 * 5、返回的新函数作为构造函数使用时this指向失效(既不是全局的window也不是传入的对象context)
 * 6、作为构造函数生成的实例可以访问绑定函数的原型
 */
var value = 2;

var obj = {
  value: 1,
};

function bar(name, age) {
  console.log(this.value);
  console.log(name);
  console.log(age);
}

bar.prototype.name = "哈哈哈";

const fn = bar.bind(obj, "张三", 18);
var newObj = new fn();
// undefined 说明this既不是window也不是传入的对象
// 张三
// 18
console.log(newObj.name);
// 哈哈哈  说明newObj instanceof bar

Function.prototype.bind1 = function (context) {
  //  先获取原先的this,即调用bind的函数即bar
  const self = this;
  const args1 = [...arguments].slice(1);
  return function () {
    const args2 = Array.prototyp.slice.call(arguments, 1);
    return self.apply(context, args1.concat(args2));
  };
};

// 完整版
Function.prototype.bind2 = function (context) {
  context = context || window;
  const self = this; // bar
  const args1 = [...arguments].slice(1); //获取第一次传入的剩余参数
  const fNOP = function () {}; // 创建一个空函数作为中间桥梁
  const fBound = function () {
    const args2 = [...arguments];
    //如果fBound作为构造函数使用，那么在fBound中的this其实就newObj（ var newObj = new fBound() ）,即this instanceof fBound
    return self.apply(
      this instanceof fNOP ? this : context,
      args1.concat(args2)
    );
  };
  // 因为作为构造函数使用生成的实例可以访问到bar的属性,所以让fBound的原型指向bar,
  // fBound.prototype = this.prototype ,这样写的话如果修改了fBound的原型就会修改原来的bar的原型，所以中间使用一个桥梁转换
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP(); // fBound 的原型是通过fNOP实例化生成的,原型链表示： fBound.prototype->new fNOP().__proto__ === fNOP.protoype ->bar.prototype
  return fBound;
};

Function.prototype.bind3 = function (context) {
  context = context || window;
  const self = this;
  const args1 = [...arguments].slice(1);
  const fNOP = function () {};
  const fBound = function (...args2) {
    return self.apply(
      this instanceof fNOP ? this : context,
      args1.concat(args2)
    );
  };
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
