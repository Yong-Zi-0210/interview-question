class Publisher{
    constructor(){
        this.event = {}
    }

    // 订阅
    on(eventName, callback){
        if(this.event[eventName]){
            this.event[eventName].push(callback)
        } else {
            this.event[eventName] = [callback]
        }
    }
    // 发布
    emit(eventName, ...args){
        this.event[eventName] && 
        this.event[eventName].forEach(fn => fn.call(this, ...args));
    }
    // 删除
    remove(eventName, callback){
        this.event[eventName] && 
       (this.event[eventName] = this.event[eventName].filter(fn => fn !== callback))
    }
    // 只订阅一次
    once(eventName, callback){
        const fn = (...args) => {
            callback.call(this, ...args)
            this.remove(eventName, fn)
        }
        this.on(eventName, fn)
    }
}