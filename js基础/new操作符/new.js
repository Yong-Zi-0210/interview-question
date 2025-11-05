/**
 * new 操作符的特点
 * 1、如果构造函数的返回结果是一个对象那个则返回构造函数的执行结果，如果不是则该返回该对象
 * 2、生成的实例能够访问构造函数原型上的属性，也能访问构造函数上的属性
 */

function objectFactory() {
  const Constructor = [].shift.call(arguments);
  // 1、创建空对象
  const obj = new Object();
  // 把空对象的原型指向构造函数的原型
  obj.__proto__ = Constructor.prototype;
  // 执行构造函数，把创建出来的对象作为构造函数的上下文
  const res = Constructor.apply(obj, arguments);
  // 如果是则返回执行结果，如果不是返回创建出来的对象
  return typeof res === "object" ? res : obj;
}

