/**
 * 1、创建一个控对象
 * 2、把控对象的原型指到构造函数的原型
 * 3、把对象作为构造函数的上下文，执行构造函数
 * 4、执行的结果是一个对象则返回执行结果，否则返回创建的对象
 */

function newFn() {
  const constructor = [...arguments].slice(0);
  const args = [...arguments].slice(1);
  const obj = new Object();
  obj.__proto__ = constructor.prototype;
  const res = constructor.apply(obj, args);
  return typeof res === "object" ? res : obj;
}
