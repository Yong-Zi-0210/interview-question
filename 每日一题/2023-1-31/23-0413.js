// 先进先出
class FIFO {
  constructor(max) {
    this.max = max;
    this.map = {};
    this.keys = [];
  }
  set(key, value) {
    if (this.map[key]) {
      this.keys.splice(this.keys.indexOf(key), 1);
    } else {
      if (this.max === this.keys.length) {
        delete this.map[this.keys.shift()];
      }
    }
    this.keys.push(key);
    this.map[key] = value;
  }
  get(key) {
    return this.map[key] ? this.map[key] : -1;
  }
}

// LRU算法 最近访问
class LRUCache {
  constructor(max) {
    this.max = max;
    this.map = new Map();
  }
  set(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size === this.map) {
      this.map.delete(this.map.keys().next().value);
    }
    this.map.set(key, value);
  }
  get(key) {
    if (this.map.has(key)) {
      const value = this.map.get(key);
      this.map.delete(key);
      this.map.set(key, value);
      return value;
    } else {
      return -1;
    }
  }
}

// LFU算法， 最多访问次数

class FLUCache {
  constructor(max) {
    this.max = max;
    this.freqMap = {};
    this.map = {};
  }
  set(key, value) {
    // 存在
    if (this.map[key]) {
      this.update(key);
      this.map[key].value = value;
    } else {
      // 上限
      if (Object.keys(this.map) === this.max) {
        // 获取最小频率的key数组
        const freqs = Object.keys(this.freqMap)[0];
        // 删除最小频率数据
        delete this.map[this.freqMap[freqs].shift()];
        if (!this.freqMap[freqs].length) delete this.freqMap[freqs];
        // 判断有没有频率是1的数组
      }
      // 没上限
      if (!this.freqMap[1]) this.freqMap[1] = [];
      this.freqMapp[1].push(key);
      this.map[key] = {
        freq: 1,
        value,
      };
    }
  }
  update(key) {
    // 获取原有频率
    let freq = this.map[key].freq;
    const index = this.freqMap[freq].indexOf(key);
    // 删除原有
    this.freqMap[freq].splice(index, 1);

    // 如果原频率数据不存在了就删除
    if (!this.freqMap[freq].length) delete this.freqMap[freq];
    // 更新频率
    freq = this.map[key].freq += 1;
    // 有没有原频率加一的对应数据
    if (!this.freqMap[freq]) this.freqMap[freq] = [];

    // 把信频率存起来
    this.freqMap[freq].push(key);
  }
}
