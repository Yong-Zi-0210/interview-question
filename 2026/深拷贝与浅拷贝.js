/**
 * 浅拷贝： 对一个对象进行完整的拷贝，如果这个对象是原始数据类型(存放在栈中)，那么与深拷贝是没区别的
 * 如果是引用数据类型(存放在堆中)，拷贝的则是原对象的引用地址，那么新的对象属性发变化时会影响原对象
 *
 * 深拷贝：对一个队对象进行完整的拷贝，会开辟一块新的存储空间存储新的对象，不会影响原对象
 */

function deepClone(obj, wm = new WeakMap()) {
  // 普通类型直接返回
  if (typeof obj !== "object" || typeof obj === null) {
    return obj;
  }

  // 如果已经存在直接返回，循环引用时会有这种情况
  if (wm.has(obj)) {
    return obj;
  }

  const newObj = Array.isArray(obj) ? [] : {};
  wm.set(obj, newObj);
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = deepClone(obj[key], wm);
    }
  }

  return newObj;
}
