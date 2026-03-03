/**
 * 1、会创建一个空对象
 * 2、新对象的原型指向构造函数的原型
 * 3、把创建出来的的对象最为上下文，执行构造函数返回类型是对象则返回，否则返回原始
 */

function createObject(constructor) {
  const obj = new Object();
  Object.setPrototypeOf(obj, constructor.prototype);
  const result = constructor.apply(obj, [...arguments].slice(1));
  return typeof result === "object" ? result : obj;
}
