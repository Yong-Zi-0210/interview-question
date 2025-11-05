function Person(name, age) {
  this.list = [1, 2, 3];
}

function Child() {}

Child.prototype = new Person();

const c1 = new Child();
const c2 = new Child();
c1.list.push("4");
console.log(c1.list); // 1,2,3,'4'
console.log(c2.list); // 1,2,3,'4'

/**
 * 缺点：所有引用类型的数据都会被共享
 */
