const timer = (t)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(t)
        },t)
    })
}
const task = [{time:1000},{time:2000},{time:3000}]
async function *gen(task){
    for(let i=0;i<task.length;i++){
        yield timer(task[i].time)
    }

}

function getAsyncTaskList(){
    let g = gen(task);
    const asyncList = []
    for(let i=0;i<=task.length;i++){
        asyncList.push(g.next())
    }
    return asyncList
}
async function test() {
    const asyncList = getAsyncTaskList()
    for await(let item of asyncList){
        console.log(item)
    }
}


test()