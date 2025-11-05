/**
 * 深拷贝：对一个对象进行完整的拷贝，并新建新的引用地址，也就是在内存中开辟一个新的空间来存储
 * 不会影响原来的对象
 * @param {any} obj
 * @param {WeakMap} wm
 * @returns
 */

function deepClone(obj, wm = new WeakMap()) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

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
