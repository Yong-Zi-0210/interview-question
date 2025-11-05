// 原型继承
function createObj(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

// 原型链继承
function Person(name) {
  this.name = name;
}
function Child() {}
Child.prototype = new Person();

// 借用构造函数
function Person(name) {
  this.name = name;
}

function Child(name) {
  Person.call(this, name);
}
const child = new Child("张三");

// 组合继承
function Perosn(name) {
  this.name = name;
}
function Child(name) {
  Person.call(this, name);
}

Child.prototype = new Person();
Child.prototype.construtor = Child;

//寄生继承
function objFactory(obj) {
  const clone = Object.create(obj);
  clone.fn = function () {};
  return clone;
}

//原型继承和原型链继承的缺点都是引用数据的数据被所有实例共享
//借用构造函数的确定是每次创建实力都会新创建一个构造函数
// 组合继承避免了两者的缺陷
