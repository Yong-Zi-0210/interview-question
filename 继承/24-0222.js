// 原型链继承
function Person() {
  this.name = "zhangsan";
  this.numbers = [1, 2, 3, 4];
}

function Female() {
  this.name = "ruhua";
}
Female.prototype = new Person();

const female1 = new Female();
female1.numbers.push(3);
const female2 = new Female();

console.log(female1.numbers); // [1,2,3,4,3]
console.log(female2.numbers); // [1,2,3,4,3]
// 缺点：所有引用类型的数据都是被共享

// 原型继承
function createObj(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
// 缺点：所有引用类型的数据都是被共享

// 借用构造函数
// 缺点：方法都写着构造函数里，每次执行都会创建新的方法
function Person(name) {
  this.name = name;
}

function Female(name) {
  Person.call(this, name);
}

// 组合继承
// 解决了引用数据类型共享和函数重复创建的问题，最常用的继承方式
function Person(age) {
  this.name = "person";
  this.age = age;
}
Person.prototype.getName = function () {
  return this.name;
};
function Male(age) {
  this.name = "male";
  Person.call(this, age);
}
Male.prototype = new Person();
Male.prototype.constructor = Male;

// 寄生继承
// 创建一个仅用于封装继承过程的一个函数，该函数通过一系列操作达到增强对象的效果，最终返回对象
function createObj(o) {
  const clone = Object.create(o);
  clone.name = "zhangsan";
  clone.getName = function () {};
}
