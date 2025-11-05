class myPromise{
    constructor(executor){
        initValue()
        initBind()
        try {
            executor(this.resolve, this.reject)
        } catch (error) {
            this.reject(error)
        }
        
    }
    initValue(){
        this.PromiseState = 'pending'
        this.PromiseResult = undefined
        this.onFulfilledCallBacks = []
        this.onRejectedCallBacks = []
    }

    initBind(){
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    resolve(value){
        if(this.PromiseState !== 'pending') return
        this.PromiseResult =  value
        this.PromiseState = 'fulfilled'
        while(this.onFulfilledCallBacks.length){
            this.onFulfilledCallBacks.shift()(this.PromiseResult)
        }
    }
    reject(reason){
        if(this.PromiseState !== 'pending') return
        this.PromiseResult = reason
        this.PromiseState = 'rejected'
        while(this.onRejectedCallBacks.length){
            this.onRejectedCallBacks.shift()(this.PromiseResult)
        }
    }
    then(onFulfilled, onRejected){
        onFulfilled = typeof onFulfilled !== 'function' ? value => value : onFulfilled
        onRejected = typeof onRejected !== 'function' ? reason => {throw reason} : onRejected
        const thenPromise = new myPromise((resolve, reject)=>{
            if(this.PromiseState === 'fulfilled'){
                excutorCurrentPromise(onFulfilled)
            }else if(this.PromiseState === 'rejected'){
                excutorCurrentPromise(onRejected)
            }else if(this.PromiseState === 'pending'){
                this.onFulfilledCallBacks.push(excutorCurrentPromise.bind(this, onFulfilled))
                this.onRejectedCallBacks.push(excutorCurrentPromise.bind(this, onRejected))
            }
        })
        const excutorCurrentPromise = callBack => {
            setTimeout(()=>{
                try {
                    const res = callBack(this.PromiseResult)
                    if(res === thenPromise && res){
                        throw new Error('不能返回自身')
                    }
                    if(res instanceof myPromise){
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
        return thenPromise
    }
    static all(promiseList){
        return new myPromise((resolve, reject)=>{
            const res = []
            const addRes = (value,index)=>{
                res[index] = value
                if(res.length === promiseList.length)(
                    resolve(res)
                )
            }
            promiseList.forEach((promise, index) => {
                if(promise instanceof myPromise){
                    promise.then(value=>{
                        addRes(value, index)
                    },reason => {
                        reject(reason)
                    })
                } else{
                    addRes(value, index)
                }
            });
        })
    }

    static allSettled(promiseList){
        return new myPromise((resolve, reject)=>{
            const res = []
            const addRes = (value,index, state)=>{
                res[index] = {
                    value,
                    state
                }
                if(res.length === promiseList.length){
                    resolve(res)
                }
            }
            promiseList.forEach((promise, index)=>{
                if(promise instanceof myPromise){
                    promise.then(value => {
                        addRes(value, index, 'fulfilled')
                    }, reason => {
                        addRes(reason, index, 'rejected')
                    })
                } else {
                    addRes(promise, index, 'fulfilled')
                }
            })
        })
    }
    static race(promiseList){
        return new myPromise((resolve, reject)=>{
            promiseList.forEach(promise => {
                if(promise instanceof myPromise){
                    promise.then(value => {
                        resolve(value)
                    }, reason => {
                        reject(reason)
                    })
                } else {
                    resolve(promise)
                }
            })
        })
    }
    static any(promiseList){
        return new myPromise((resovle, reject)=>{
            const res = []
            let count = 0
            promiseList.forEach((promise, index)=>{
                if(promise instanceof myPromise){
                    promise.then(value => {
                        resovle(value)
                    }, reason => {
                        count++
                        if(count === promiseList.length){
                            reject(new AggregateError('All Promise were rejected'))
                        }
                    })
                } else {
                    resovle(promise)
                }
            })
        })
    }
    static catch(onRejected){
       return this.then(undefined, onRejected)
    }
}
