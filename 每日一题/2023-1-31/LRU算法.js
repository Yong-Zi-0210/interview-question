// 最近访问过的变量，被访问的几率越高，放在最后，则把访问几率越低的放在前面，当存储上限时从首位删除几率低的变量
class LRUCahce{
    constructor(limit){
        this.limit = limit
        this.map = new Map()
    }
    set(key, value){
        let size = this.map.size
        if(this.map.has(key)){
            this.map.delete(key)
        } else if(size === this.limit) {
            this.map.delete(this.map.keys().next().value)
        }
        this.map.set(key, value)
    }
    get(key){
        const value =  this.map.get(key)
        if(value) {
            this.map.delete(key) // 先删除，再添加到队尾，保证最近访问
            this.map.set(key, value)
            return value
        }
         else {
            return -1 // 用来表示访问的变量不存在
         }
    }
}


class LRUCache{
    constructor(max){
        this.max = amx
        this.map = new Map()
    }

    set(key, value){
        if(this.map.has(key)){
            this.map.delete(key)
        } else if(this.max === this.map.size){
            this.map.delete(this.map.keys().next().value)
        }
        this.map.set(key, value)
    }

    get(key){
        if(this.map.has(key)){
            const value = this.map.get(key)
            this.map.delete(key)
            this.map.set(key, vlaue)
            return value
        }else{
            return -1
        }
    }
}