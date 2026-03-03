// 主要利用 Object.prototye.toString()

function getTypeMap(obj) {
  const typeMap = {};
  [
    "Number",
    "String",
    "Boolean",
    "Undefined",
    "Function",
    "Array",
    "Object",
    "Error",
    "Date",
    "ErgExp",
  ].forEach((item) => {
    typeMap[`object ${item}`] = item.toLowerCase();
  });
  if (obj === null) {
    return "null";
  }
  if (typeof obj === "object" || typeof obj === "function") {
    return typeMap[Object.prototype.toString.call(obj)] || "object";
  }
}
