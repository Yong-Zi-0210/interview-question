/**
 * 继承的六种类型
 * 1、原型链继承
 * 2、原型继承
 * 3、借用构造函数
 * 4、组合继承
 * 5、寄生继承
 *
 * 6、esnext使用新语法 extends
 */

/**
 * 原型链继承
 */

function Person() {
  this.name = "人类";
  this.classify = ["黄种人", "白人", "黑人"];
}

function Teacher(name) {
  this.name = name;
  this.hobiy = ["A", "B"];
}

Teacher.prototype = new Person(); // 会造成构造函数丢失
Teacher.prototype.constructor = Teacher; // 需要手动指定构造函数
const p = new Person();
const t1 = new Teacher("1");
const t2 = new Teacher("2");
t2.classify.push("其他");

// 缺点： 引用类型的数据d会被共享
console.log(p.classify); //  '黄种人', '白人', '黑人' ]
console.log(t1.classify); //  '黄种人', '白人', '黑人', '其他' ]
console.log(t2.classify); //  '黄种人', '白人', '黑人', '其他' ]

/**
 * 原型继承
 */
const obj = Object.create({
  name: "原型继承",
  hobiy: ["A", "B"],
});
function createObject(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}
const obj1 = createObject(obj);
const obj2 = createObject(obj);
obj1.hobiy.push("C");

// 缺点：与原型链一致，引用类型的数据被共享
console.log(obj.hobiy); // [ 'A', 'B', 'C' ]
console.log(obj1.hobiy); // [ 'A', 'B', 'C' ]
console.log(obj2.hobiy); // [ 'A', 'B', 'C' ]

/**
 * 借用构造函数
 */

function Student(name, age) {
  this.name = name;
  this.age = age;
  this.hobiy = ["篮球", "足球"];
}

function GoodStudent(name, age) {
  Student.call(this, name, age);
}

const g1 = new GoodStudent("张三", 18);
const g2 = new GoodStudent("李四", 18);
g2.hobiy.push("音乐");

// 解决了引用数据类型的共享
// 可以在Child中项Parent传参
// 缺点：只继承了构造函数的属性和方法，没有继承构造函数的原型，因此创建子类时每次都会调用构造函数，复制一次这个方法
console.log(g1.hobiy); // [ '篮球', '足球' ]
console.log(g2.hobiy); // [ '篮球', '足球', '音乐' ]

/**
 * 组合继承: 借用构造函数和原型链组合
 */

function Animal(name) {
  this.name = name;
  this.info = ["name", "height"];
}
Animal.run = function () {
  console.log("animal runing");
};

function Dog(name, age) {
  Animal.call(this, name);
  this.age = age;
}

Dog.prototype = new Animal();
Dog.prototype.constructor = Dog;

const a = new Animal("兔子");
const d1 = new Dog("萨摩耶");
const d2 = new Dog("边牧");
d1.info.push("color");

// 是以往最通用的继承方式，解决了其他继承的缺点

console.log(a.info); // ['name', 'height']
console.log(d1.info); // [ 'name', 'height', 'color' ]
console.log(d2.info); // [ 'name', 'height' ]

/**
 * 寄生继承
 * 创建⼀个仅⽤于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象
 */

function createObj(obj) {
  const cloneObj = Object.create(obj);
  cloneObj.fn = function () {
    console.log("一系列操作");
  };
  return cloneObj;
}

/**
 * extends
 */

class A {}

class B extends A {}
