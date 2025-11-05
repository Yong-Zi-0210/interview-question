// 2、LFU算法的全称是Least Frequently Used，即最近最不常使用算法
//  当存储空间上限时，删除访问次数最低的数据，如果访问次数都一样，则删除最先添加的数据
class LFUCache {
  constructor(max) {
    this.max = max;
    this.map = {}; // { key: { value: "", freq: ''} }
    this.freqMap = {}; // { 1[freq]: [key1, key2, ...], 2: [key3, key4, ...] }
  }
  set(key, value) {
    // 存在直接更新
    if (this.map[key]) {
      this.map[key].value = value;
      this.update(key, this.map[key]);
    } else {
      // 不能存在
      // 上限

      if (Object.keys(this.map).length === this.max) {
        const minFreq = Object.keys(this.freqMap)[0]; // 找到频率最小值
        const minKey = this.freqMap[minFreq][0]; // 最小频率的第一个key
        this.freqMap[minFreq].splice(0, 1);
        delete this.map[minKey];
        if (this.freqMap[minFreq].length === 0) delete this.freqMap[minFreq];
      }
      // 未上限
      if (!this.freqMap[1]) this.freqMap[1] = [];
      this.freqMap[1].push(key);
      this.map[key] = {
        value,
        freq: 1,
      };
    }
  }
  get(key) {
    if (this.map[key]) {
      const value = this.map[key].value;
      this.update(key, this.map[key]);
      return value;
    }
    return -1;
  }

  // 更新被访问的频率
  update(key, obj) {
    let freq = obj.freq; // 原访问频率
    const index = this.freqMap[freq].indexOf(key);
    this.freqMap[freq].splice(index, 1); // 从原有频率数据中删除当前访问的变量
    if (this.freqMap[freq].length === 0) delete this.freqMap[freq];
    freq = obj.freq = obj.freq + 1;
    if (!this.freqMap[freq]) this.freqMap[freq] = [];
    this.freqMap[freq].push(key);
  }
}

const lfu = new LFUCache(3);
lfu.set("a", 5);
lfu.set("b", 4);
lfu.set("c", 3);
lfu.get("c");
lfu.set("d", 1);
lfu.set("a", 11);
console.log(lfu);

class LFUCache {
  constructor(max) {
    this.max = max;
    this.map = {};
    this.freqMap = {};
  }

  set(key, value) {
    // 存在
    if (this.map[key]) {
      this.map[key].value = value;
      this.update(key, this.map[key]);
      // 不存在
    } else if (this.max === Object.keys(this.map).length) {
      const minFreq = Object.keys(this.freqMap)[0]; // 获取最先频率的数组
      delete this.map[this.freqMap[minFreq].shift()]; // 删除map中对应的数据和原频率的数据
      if (this.freqMap[minFreq].length === 0) delete this.freqMap[minFreq]; // 原频率数组是否还有长度
      if (!this.freqMap[1]) this.freqMap[1] = [];
      this.freqMap[1].push(key);
      this.map[key] = {
        value,
        freq: 1,
      };
    }
  }
  get(key) {
    if (this.map[key]) {
      this.update(key, this.map[key]);
      return this.map[key].value;
    }
    return -1;
  }

  // 更新访问此事
  update(key, obj) {
    let freq = obj.freq;
    const index = this.freqMap[freq].indexOf(key);
    this.freqMap[freq].splice(index, 1);
    if (this.freqMap[freq].length === 0) delete this.freqMap[freq];
    freq = obj.freq += 1;
    if (!this.freqMap[freq]) this.freqMap[freq] = [];
    this.freqMap[freq].push(key);
  }
}
