function objFactory(constructor) {
  const obj = new Object();
  const args = [...arguments].slice(1);
  obj.__proto__ = constructor.prototype;
  const res = constructor.apply(obj, args);
  return typeof res === "object" ? res : obj;
}
