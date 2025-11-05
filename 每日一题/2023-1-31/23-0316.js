// 访问次数最多

class LFUCache{
    constructor(size){
        this.size = size
        this.map = {}
        this.freqMap = {}
    }

    update(key, obj){
        const freq = obj.freq
        const index = this.freqMap[freq].indexOf(key)
        this.freqMap[freq].splice(index, 1)
        if(this.freqMap[freq].length === 0) delete this.freqMap[freq]
        freq = obj.freq = obj.freq + 1
        if(!this.freqMap[freq]) this.freqMap[freq] = []
        this.freqMap[freq].push(key)
    }
    get(key){
        if(this.map[key]){
            this.update(key, this.map[key])
            return this.map[key].value
        } else {
            return -1
        }
    }
    set(key, value){
        if(this.map(key)){
            this.map[key].value = value
            this.update(key, this.map[key])
        }else {
            if(Object.keys(this.map).length === this.size){
                const minFreq = Object.keys(this.freqMap)[0]
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