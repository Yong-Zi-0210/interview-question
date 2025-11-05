class Scheduler{
    constructor(max){
        this.max = max; // 最大同时执行任务数量
        this.count = 0; // 当前执行任务数量
        this.queue = []; // 等待执行的任务队列
    }
    async add(promiseCreator){
        // 当前执行的任务数达到最大值时放到待执行队列, 使用await暂停add函数执行
        if(this.count === this.max){
            await new Promise(resolve=>this.queue.push(resolve))
        }

        // 如果没达到最大值，继续添加任务,并且执行
        this.count ++;
        const res = await promiseCreator();
        this.count --; // 等待任务执行完就减1

        // 待执行队列中有长度，说明之前都阻塞，需要处理阻塞的任务
        if(this.queue.length){
            this.queue.shift()() // 从队首取出任务执行，此时count数量已经小于最大值，唤醒add方法继续往里添加任务
        }

        return res
    }
}

function checkType(obj){
    let typeMap = {};

    "Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function(item, index) {
        typeMap["[object " + item + "]"] = item.toLowerCase();
    })

    return type(obj)
    function type(obj) {
        if (obj == null) {
            return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ?
            typeMap[Object.prototype.toString.call(obj)] || "object" :
            typeof obj;
    }
}