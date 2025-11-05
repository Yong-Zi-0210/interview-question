/**
 * 创建一个空对象
 * 把空对象的原型指向构造函数的原型
 * 把空对象作为上限，放入到构造函数中执行
 * 如果执行结果是对象则返回执行结果，否则返回新创建的对象
 */

function objFactory(constructor) {
  const obj = new Object();
  Object.setPrototypeOf(obj, constructor.prototype);
  const res = constructor.call(obj, [...arguments].slice(1));
  return typeof res === "object" ? res : obj;
}
