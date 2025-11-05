// 创建⼀个仅⽤于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象

function createObj(o) {
  let clone = Object.create(o);
  clone.sayName = function () {
    console.log("hi");
  };
  return clone;
}
