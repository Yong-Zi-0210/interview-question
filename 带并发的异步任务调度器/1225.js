class Scheduler{
    constructor(max){
        this.max = max; // 最大同时运行的任务数量
        this.queue = []; // 等待队列
        this.count = 0 // 当前执行的数量
    }
    async add(promiseCreator){
        if(this.count === this.max){ //      this.count === this.max表示阻塞,把任务放到待执行队列中
            await new Promise((resolve,reject)=> this.queue.push(resolve))
        }
        this.count++;
        const res  = await promiseCreator()
        this.count --;
        if(this.queue.length){ // 如果队列有长度说明之前的阻塞的还未执行，从队首取出一个一个执行
            this.queue.shift()()
        }
       return res
    }
}


class Scheduler{
    constructor(max){
        this.max = max
        this.queue = []
        this.count = 0 // 当前正在进行的任务
    }

    async add(promiseCreator){
        if(this.count === this.max){
            new Promise(resolve => this.queue.push(resolve))
        }
        this.count++
        const res = await promiseCreator()
        this.count--
        if(this.queue.length){
            this.queue.shift()()
        }

        return res
    }
}