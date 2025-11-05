/**
 * 1、创建一个空对象
 * 2、空对象的原型指向构造函数的原型
 * 3、把空对象作为构造函是的上下文并执行构造函数
 * 4、返回执行构造函是的结果，如果是object类型则返回执行结果，否则返回创建的对象
 */

function createObj() {
  const constructor = [...arguments].slice();
  const args = [...arguments].slice(1);
  const obj = new Object();
  obj.__proto__ = constructor.prototype;
  const res = constructor.apply(obj, args);
  return typeof res === "object" ? res : obj;
}
