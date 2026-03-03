function getType(obj) {
  const typeMap = {};
  const types = [
    "Number",
    "Boolean",
    "String",
    "Undefined",
    "Function",
    "Object",
    "Array",
    "Date",
    "RrgExp",
    "Error",
  ];
  types.map((item) => {
    typeMap[`[object ${item}]`] = item.toLowerCase();
  });

  if (obj === null) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function"
    ? typeMap[Object.prototype.toString.call(obj)] || "object"
    : typeof obj;
}

// 利用 Object.prototype.toString 方法
console.log(Object.prototype.toString.call({})); // [object Object]
console.log(Object.prototype.toString.call([])); // [object Array]
console.log(Object.prototype.toString.call(() => {})); // [object Function]
