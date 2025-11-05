// 继承一般有
// 1、原型继承
const obj = {
  name: "张三",
  age: 18,
  hobis: ["吃饭", "睡觉"],
};

function createObj(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

const obj1 = createObj(obj);
const obj2 = createObj(obj);
obj2.hobis.push("打球");
console.log("obj1: ", obj1.hobis); // '吃饭', '睡觉', '打球']
console.log("obj2: ", obj2.hobis);
console.log("obj: ", obj.hobis);
// 缺点：引用类型的数据会被共用，

// 2、原型链继承
function Perosn() {
  this.name = "李四";
  this.numbs = [1, 2];
}
function Teacher() {
  this.name = "马老师";
}
// 使Teacher的原型只想Perosn实例
Teacher.prototype = new Perosn();
// 经过以上操作则会构成Teacher.prototype.constructor的值变成了Perosn，原本Teacher.prototype.constructor的值时Teacher,所以
// 需要把它改回来
Teacher.prototype.constructor = Teacher;
const t1 = new Teacher();
const t2 = new Teacher();
t1.numbs.push(3);
console.log("t1: ", t1.numbs); // [1,2,3]
console.log("t2: ", t2.numbs); // [1,2,3]

// 缺点：与原型继承一样，引用数据类型会被公用

// 3、构造函数继承

function Perosn(name) {
  this.name = name;
}

function Student(name, age) {
  Person.call(this, name);
  this.age = age;
}

const s = new Student("王五", 30);
console.log(s); // {age: 30, name: '王五'}
// 避免了引用数据类型的公用
// 缺点：只继承了构造函数的属性和方法，没有继承构造函数的原型，因此创建子类时每次都会调用构造函数，复制一次这个方法

// 4、寄生继承
// 函数在内部以某种形式来做增强对象，最后返回对象
function createObj(o) {
  const clone = Object.create(o);
  clone.foo = function () {};
  return clone;
}

// 5、组合继承, 原型链或原型与构造函数结合
function Perosn(name) {
  this.name = name;
}

function Student(name, age) {
  Person.call(this, name);
  this.age = age;
}

// Student.prototype = new Perosn();

// 以上代码避免了问题，还需优化Student.prototype = new Perosn()这个地方,副作用就是会调用两次构造函数，修改如下

// 组合寄生继承
Student.prototype = Object.create(Perosn.prototype);
Student.prototype.constructor = Student;
