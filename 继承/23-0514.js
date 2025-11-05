// 1、原型继承, 所有引用的数据类型都会被共享
function Perosn(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

// 2、原型链继承,所有引用类型的数据都会被共享
function Person(name) {
  this.name = name;
}
function Child(name) {
  this.name = name;
}
Child.prototype = new Perosn();
Child.prototype.constructor = Child;

// 3、借用构造函数, 解决了引用数据类型被共享的问题，但是每次实例化都会创建一次构造函数
function Perosn(name) {
  this.name = name;
}
function Child(name) {
  Person.call(this, name);
}

const child = new Child("张三");

// 4、组合继承,解决了数据共享和重复创建构造函数的问题
function Perosn(name) {
  this.name = name;
}

function Child(name) {
  Person.call(this, name);
}

Child.prototype = new Person();
Child.prototype.constructor = Child;

// 5、寄生继承
function objFactory(o) {
  const obj = new Object.create(o);
  obj.foo = function () {};
  return obj;
}
