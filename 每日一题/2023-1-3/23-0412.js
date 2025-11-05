function checkType(obj) {
  const typeMap = {};
  const typeStr =
    "Boolean Number String Array Function Object Date Error RegExp";
  typeStr.split(" ").map((item) => {
    typeMap[`[object ${item}]`] = item.toLowerCase();
  });
  function check(obj) {
    if (obj === null) {
      return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function"
      ? typeMap[Object.prototype.toString.call(obj)] || "object"
      : typeof obj;
  }
  return check(obj);
}
