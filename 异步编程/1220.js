class MyPromise{
    constructor(excuter){
        this.initBind()
        this.initValue()
        try {
            excuter(this.resolve, this.reject)
        } catch (error) {
            this.reject(error)
        }
        
    }

    initBind(){
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    initValue(){
        this.PromiseStatus = 'pending'
        this.PromiseResult = undefined
        this.onFulfilledCallback = []
        this.onRejectedCallback = []
    }

    resolve(value){
        if(this.PromiseStatus !== 'pending') return
        this.PromiseResult = value
        this.PromiseStatus = 'fulfilled'
        while(this.onFulfilledCallback.length){
            this.onFulfilledCallback.shift()(this.PromiseResult)
        }
    }
    reject(value){
        if(this.PromiseStatus !== 'pending') return
        this.PromiseResult = value
        this.PromiseStatus = 'rejected'
        while(this.onRejectedCallback.length){
            this.onRejectedCallback.shift()(this.PromiseResult)
        }
    }
    then(onFulfilled, onRejected){
        onFulfilled = typeof onFulfilled !== 'function' ? value => value : onFulfilled
        onRejected = typeof onRejected !== 'function' ? reason => {throw reason}: onRejected
        const thenPromise = new MyPromise((resolve, reject) => {
            if(this.PromiseStatus === 'fulfilled'){
                executorPromise(onFulfilled)
            }else if(this.PromiseStatus === 'rejected'){
                executorPromise(onRejected)
            } else if(this.PromiseStatus === 'pending'){
                this.onFulfilledCallback.push(executorPromise.bind(this, onFulfilled))
                this.onRejectedCallback.push(executorPromise.bind(this, onRejected))
            }

            const executorPromise = callBack => {
                setTimeout(()=>{
                    try {
                        const res = callBack(this.PromiseResult)
                        // Promise规范不能返回自身,避免死循环
                        if(res === thenPromise){
                            throw new Error('Chaining cycle detected for promise')
                        }
                        if(res instanceof MyPromise){
                            res.then(resolve, reject)
                        } else {
                            resolve(res)
                        }
                    } catch (error) {
                        reject(error)
                        throw new Error(error)
                    }
                })
            }
        })
    }
}