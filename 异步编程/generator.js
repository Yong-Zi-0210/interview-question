function *gen(){
    yield 1;
    yield 2;
    yield 3;
}

const g = gen()

console.log(g.next()) // {value: 1, done: false}
console.log(g.next()) // {value: 2, done: false}
console.log(g.next()) // {value: 3, done: false}
console.log(g.next()) // {value: undefined, done: true}


// 如果generator有返回值则最终返回该值，done：true

function *gen(){
    yield 1;
    yield 2;
    yield 3;
    return 3;
}

const g2 = gen()

console.log(g2.next()) // {value: 1, done: false}
console.log(g2.next()) // {value: 2, done: false}
console.log(g2.next()) // {value: 3, done: false}
console.log(g2.next()) // {value: 3, done: true}

// 手写async/await
/**
 * async返回的是promise
 */
function generatorToAsync(generatorFn){
    return new Promise((resolve, reject)=>{
        const g = generatorFn()
        function go(key, arg){
            let res;
            try {
                 res = g[key](arg)
            } catch (error) {
                return reject(error)
            }
            const {value, done} = res
            if(done){
                return resolve(value)
            } else{
                // value 的值可能是常量、Promise，如果是Promise有可能成功或者失败
                return Promise.resolve(value).then(val=> go('next',val), err=> go('throw', err))
            }
        }
        go('next') // 第一次执行
    })
}