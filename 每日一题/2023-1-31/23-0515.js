// LRU缓存算法，最近访问优先
class LURCache {
  constructor(max) {
    this.size = max;
    this.map = new Map();
  }
  set(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.size === this.map.size) {
      this.map.delete(this.map.keys().next().value);
    }
    this.map.set(key, value);
  }
  get(key) {
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }
}

// FIFO缓存算法，先进先出
class FIFOCache {
  constructor(max) {
    this.size = max;
    this.map = {};
    this.keys = [];
  }
  set(key, value) {
    if (this.map[key]) {
      const index = this.keys.indexOf(key);
      this.keys.splice(index, 1);
    } else if (this.size === this.keys.length) {
      delete this.map[this.keys.shift()];
    }
    this.map[key] = value;
    this.keys.push(key);
  }
  get(key) {
    return this.map[key];
  }
}

//LFU 访问次数最多
class LFUCache {
  constructor(max) {
    this.size = max;
    this.map = {}; // key: {value: 1, freq: 1}
    this.freqMap = {}; // 1(ferq): ['a','b','key']
  }
  set(key, value) {
    if (this.map[key]) {
      this.update(this.map[key], key);
      this.map[key].value = value;
    } else {
      if (this.size === Object.keys(this.map).length) {
        const freq = Object.keys(this.freqMap)[0];
        delete this.map[this.freqMap[freq].shift()];
        if (this.freqMap[freq].length === 0) delete this.freqMap[freq];
      }
      if (!this.freqMap[1]) this.freqMap[1] = [];
      this.freqMap[1].push(key);
      this.map[key] = {
        freq: 1,
        value,
      };
    }
  }
  get(key) {
    if (this.map[key]) {
      this.update(this.map[key], key);
      return this.map[key].value;
    } else {
      return -1;
    }
  }
  update(obj, key) {
    const freq = obj.freq; // 原有频率
    const index = this.freqMap[freq].indexOf(key);
    this.freqMap[freq].splice(index, 1); // 移除原有数据
    if (this.freqMap[freq].length === 0) delete this.freqMap[freq];
    freq = obj.freq = freq + 1;
    if (!this.freqMap[freq]) this.freqMap[freq] = [];
    this.freqMap[freq].push(key);
  }
}
