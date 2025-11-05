// LRU最近访问算法

class LRUCache{
    constructor(max){
        this.max = max
        this.cache = new Map()
    }
    set(key, value){
        if(this.cache.has(key)){
            this.cache.delete(key)
        } else if(this.cache.size === this.max){
            const value = this.cache.keys().next().value
            this.cache.delete(value)
        }
        this.cache.set(key,value)
    }
    get(key){
        if(this.cache.has(key)){
            const value = this.cache.get(key)
            this.cache.delete(key)
            this.cache.set(key, value)
            return value
        } else {
            return -1
        }
    }
}

// FIFO 先进先出算法
class FIFOCache{
    constructor(max){
        this.max = max
        this.map = {}
        this.keys = []
    }

    get(key){
        if(this.map[key]){
            return this.map[key]
        } else {
            return -1
        }
    }
    set(key, value){
        const index = this.keys.indexOf(key)
        if(index > -1){
            this.keys.splice(index, 1)
        } else if(this.map === this.keys.length) {
            delete this.map[this.keys.shift()]
        }
        this.keys.push(key)
        this.map[key] = value
    }
}

// LFU 最大访问次数
class LFUCache{
    constructor(size){
        this.size = size
        this.map = {} // key: {freq: 1, value: 'value'}
        this.freqMap = {} // 1: []
    }
    updata(obj, key){
        let freq = obj.freq
        const index =  this.freqMap[freq].indexOf(key)
        // 删除原因频率数据
        this.freqMap[freq].splice(index, 1)
        // 清空无该频率的key
        if(this.freqMap[freq].length === 0) delete this.freqMap[freq]
        freq = obj.freq = obj.freq + 1
        if(!this.freqMap[freq]) this.freqMap[freq] = []
        this.freqMap[freq].push(key)
    }
    get(key){
        if(this.map[key]){
            const value = this.map[key].value
            updata(this.map[key],key)
            return value
        } else {
            return -1
        }
    }
    set(key, value){
        if(this.map[key]){
            this.map[key].value = value
            this.updata(key, this.map[key])
        } else {
            if (this.map.keys().length === this.size){
                const freqKeys = this.freqMap.keys()
                const minFreq = freqKeys[0]
                const key = this.freqMap[minFreq].shift()
                delete this.map[key]
                if(this.freqMap[minFreq].length === 0) delete this.freqMap[minFreq]
            }
            if(!this.freqMap[1]) this.freqMap[1] = []
            this.freqMap[1].push(key)
            this.map[key] = {
                value,
                freq: 1
            }
        }
    }
 
}