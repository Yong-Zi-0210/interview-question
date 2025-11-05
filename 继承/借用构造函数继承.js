function Parent() {
  this.name = ["张三", "李四"];
}

function Child() {
  Parent.call(this);
}

const c1 = new Child();
const c2 = new Child();

c1.name.push("呵呵");

//可以避免引用类型的属性被所有实例共享
//可以在Child中项Parent传参
//缺点：只继承了构造函数的属性和方法，没有继承构造函数的原型，因此创建子类时每次都会调用构造函数，复制一次这个方法
