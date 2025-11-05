/**
 * 浅拷贝：对一个对象进行完整的拷贝，新的对象包含所有原对象的所有属性，
 * 如果是基本类型，拷贝就是基本类型，此时与深拷贝没什么区别。如果是引用类型，
 * 拷贝的则是原对象的引用地址，也就是说，新对象的属性发生变化会影响到原对象
 */

// 深拷贝：对一个对象进行完整的拷贝，并新建新的引用地址，也就是在内存中开辟一个新的空间来存储
// 不会影响原来的对象

function deepClone(obj, wm = new WeakMap()) {
  // 1、判断是不是引用类型
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (wm.has(obj)) {
    return obj;
  }
  // 2、判断是数组还是对象
  const res = Array.isArray(obj) ? [] : {};
  wm.set(obj, res);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      res[key] = deepClone(obj[key], wm);
    }
  }
  return res;
}
