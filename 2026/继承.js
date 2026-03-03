//1、 原型链继承
function Parent(name) {
  this.name = name;
  this.hobbies = ["吃饭", "睡觉"];
}

function Child(name) {
  this.name = name;
}

Child.prototype = new Parent("1");
Child.prototype.constructor = Child;

const child1 = new Child("老大");
const child2 = new Child("老二");
child1.hobbies.push("逛街");
console.log(child1.hobbies); // ["吃饭","睡觉","逛街"]
console.log(child2.hobbies); //  ["吃饭","睡觉","逛街"]
// 缺点：所有子类会共享父类的引用属性，且无法传参

// 2、原型继承
const obj = {
  name: "人",
  age: 30,
};
function createObject(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

// 缺点和原型链一致

// 3、构造函数继承
function Person(name, age) {
  this.name = name;
  this.age = age;
}

function Child(name, age) {
  Person.call(this, name, age);
}

const child3 = new Child("1", 14);
const child4 = new Child("2", 20);
console.log(child3, child4);

// 解决了父类共享属性被公用的问题，但是没有继承构造函数的原型，
// 因此创建子类时每次都会调用构造函数，复制一次这个方法

// 4、组合继承
function Animal(name) {
  this.name = name;
  this.types = [];
}

function Dog(name) {
  Animal.call(this, name);
}

Dog.prototype = new Animal("123");
Dog.prototype.constructor = Dog;

const dog1 = new Dog("黑");
const dog2 = new Dog("黄");
dog1.typs.push("中华田园");
console.log(dog1.types, dog2.types); // ["中华田园"], []

// 解决了父类引用属性共享问题和传参问题，已经每次复制构造函数的问题
