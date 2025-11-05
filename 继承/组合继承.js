function Parent(name){
    this.name = name
    this.colors = ['red']
}


function Child(name,age){
    Parent.call(this, name)
    this.age = age
}
Child.prototype = new Parent()
Child.prototype.constructor = Child

//优点：融合原型链和构造函数的优点，最常用的继承方法
