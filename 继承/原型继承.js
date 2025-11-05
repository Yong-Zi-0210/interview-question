//通过原型的方式让实例继承属性
function createObj(o){
    function F(){}
    F.prototype = o
    return new F()
}

const Parent = {
    name: '张三',
    age: 23,
    friends: ['xiaoming', 'awei'],
    jump(){
        console.log(this.name)
    }
}

const child = createObj(Parent)
const child2 = createObj(Parent)

child.name = '哈哈哈'

console.log(child2.name) // 张三

child.friends.push('cuihua')
console.log(child2.friends) // ['xiaoming', 'awei', 'cuihua']


//缺点： 引用类型的属性值都会被共享，与原型链继承一样


