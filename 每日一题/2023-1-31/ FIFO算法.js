// first input first output(先进先出)

class FIFOCache{
    constructor(limit){
        this.limit = limit
        this.map = {}
        this.keys = []
    }
    set(key, value){
        let i = this.keys.indexOf(key)
        // 先判断存不存在， 存在就先把key删除，在判断有没有上限，上限则需要把key删除，同时还要把map中的数据删除
        if(this.map[key]){
            this.keys.splice(i, 1)
        } else {
            if(this.keys.length === this.max){
                delete this.map[this.keys.shift()]
            }
        }
        this.keys.push(key)
        this.map[key] = value
    }
    get(key){
        return this.map[key]
    }
}
//最大上限limit
//
class FIFOCache{
    constructor(max){
        this.max = max
        this.map = {}
        this.keys = []
    }

    set(key, value){
        if(this.map[key]){
            this.keys.splice(this.keys.indexOf(key), 1)
        }else {
            if(this.max === this.keys.length){
                delete this.map[this.keys.shift()]
            }
        }
        this.keys.push(key)
        this.map[key] = value
    }

    get(key){
        return this.map[key]
    }
}