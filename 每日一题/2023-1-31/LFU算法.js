// 当存储空间上限时，删除访问次数最低的数据，如果访问次数都一样，则删除最先添加的数据

class LFUCache {
  constructor(limit) {
    this.limit = limit;
    this.map = {}; // key: {value: '', freq:1}, 存在的形式
    this.freqMap = {}; // 储存频率的map 1(freq): [key1, key2, ...]
  }
  get(key) {
    if (this.map[key]) {
      const o = this.map[key];
      this.update(key, o);
      return o.value;
    } else {
      return -1;
    }
  }
  update(key, obj) {
    let freq = obj.freq;
    let arr = this.freqMap[freq];
    // 删除原有频率中的数据
    this.freqMap[freq].splice(arr.indexOf(key), 1);
    // 如果当前频率没有对应的数据，则清空当前频率
    if (this.freqMap[freq].length === 0) delete this.freqMap[freq];
    // 更新频率
    freq = obj.freq = obj.freq + 1;
    // 判断有没有当前频率的数据，没有则初始化为[]
    if (!this.freqMap[freq]) this.freqMap[freq] = [];

    this.freqMap[freq].push(key);
  }
  set(key, value) {
    // 不存在原数据中
    if (!this.map[key]) {
      // 内存上限时
      if (Object.keys(this.map).length === this.limit) {
        let fkeys = Object.keys(this.freqMap); // Object.keys如果key 是number类型则返回顺序的数组['1','2','3'],
        let freq = fkeys[0]; // 所以取第一个就能确保是频率最低的
        let keys = Object.keys(this.freqMap[freq]);
        // 删除map中对应的数据
        delete this.map[keys.shift()];
        // 清理数据
        if (!this.freqMap[freq]) delete this.freqMap[freq];
      }
      // 如果没有记录, 初始化记录
      if (!this.freqMap[1]) this.freqMap[1] = [];
      // 插入新值
      this.freqMap[1].push(key);
      // 插入新的数据
      this.map[key] = {
        value,
        freq: 1,
      };
    } else {
      // 如果已存在数据，则直接修改
      this.map[key].value = value;
      this.update(key, this.map[key]);
    }
  }
}

class LFUCache {
  constructor(max) {
    this.max = max;
    this.map = {}; // {value: '', freq: ''}
    this.freqMap = {}; // {1: [key1, key2, ...], 2: [key3, ...]}
  }

  get(key) {
    if (this.map[key]) {
      const value = this.map[key].value;
      update(key, this.map[key]);
      return value;
    } else {
      return -1;
    }
  }
  set(key, value) {
    if (!this.map[key]) {
      if (this.max === Object.keys(this.map).length) {
        // 上限的话需要找到最先频率的数据然后删除第一个
        const freq = Object.keys(this.freqMap)[0];
        const keys = Object.keys(this.freqMap[freq]);
        this.freqMap[freq].splice(0, 1);
        delete this.map[keys[0]];
        if (this.freqMap[freq].length === 0) delete this.freqMap[freq];
      }

      // 没上限就初始化频率
      if (!this.freqMap[1]) this.freqMap[1] = [];
      this.freqMap[1].push(key);
      this.map[key] = {
        value,
        freq: 1,
      };
    } else {
      // 存在的话直接更新就行
      this.update(key, this.map[key]);
      this.map[key].value = value;
    }
  }

  update(key, obj) {
    const freq = obj.freq;
    const index = this.freqMap[freq].indexOf(key);
    this.freqMap[freq].splice(index, 1);
    if (this.freqMap[freq].length === 0) delete this.freqMap[freq];
    freq = obj.freq = freq + 1;
    if (!this.freqMap[freq]) this.freqMap[freq] = [];

    this.freqMap[freq].push(key);
  }
}
