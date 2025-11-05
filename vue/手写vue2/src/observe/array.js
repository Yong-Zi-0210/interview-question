const oldArrProto = Array.prototype;
export const newArrProto = Object.create(oldArrProto);
const methods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "sort",
  "reverse",
  "splice",
];

methods.forEach((method) => {
  newArrProto[method] = function (...args) {
    const res = oldArrProto[method].call(this, ...args);
    return res;
  };
});
