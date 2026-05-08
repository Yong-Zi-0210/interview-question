// bind
function bind(context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError(`${this}.bind is not a function`);
  }
  if (context === null || typeof context === "undefined") {
    context = window;
  }
  const originFn = this
  const boundFn = function(){
    const finalArgs = [...args, ...arguments]
    const finalContext = this instanceof boundFn ? this : context
    return originFn.apply(finalContext, finalArgs)
  }

  // 维护原型链
  if(originFn.prototype) {
    boundFn.prototype =  Object.create(originFn.prototype)
  }

  return boundFn
}
