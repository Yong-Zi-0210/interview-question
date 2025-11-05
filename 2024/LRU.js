// 1、LRU是Least Recently Used的缩写，即最近最少使用，是一种常用的页面置换算法，选择最近最久未使用的页面予以淘汰
class LRUCahce {
  constructor(max) {
    this.max = max;
    this.map = new Map();
  }
  set(key, value) {
    const size = this.map.size;
    if (this.map.has(key)) {
      this.map.delete(key);
      this.map.set(key, value); // 相同代码
    } else {
      if (this.max === size) {
        this.map.delete(this.map.keys().next().value);
        this.map.set(key, value); // 相同代码
      } else {
        this.map.set(key, vlaue); // 相同代码
      }
    }
  }
  get(key) {
    const value = this.map.get(key);
    // 存在值
    if (value) {
      this.map.delete(key);
      this.map.set(key, value);
      return value;
    }
    return -1; // 不存在
  }
}

// 优化代码
class LRUCache {
  constructor(max) {
    this.max = max;
    this.map = new Map();
  }
  set(key, value) {
    const size = this.map.size;
    if (this.map.has(key)) {
      // 存在则删除，后面直接设置新值
      this.map.delete(key);
    } else if (size === this.max) {
      // 不存在，且上限了，删除最久未使用的值
      this.map.delete(this.map.keys().next().value);
    }

    // 设置新的值 ｜ 不存在也没达到上限值直接设置
    this.map.set(key, value);
  }

  get(key) {
    const value = this.map.get(key);
    if (value) {
      this.map.delete(key);
      this.map.set(key, value);
      return value;
    }
    return -1;
  }
}

const lru = new LRUCache(3);
lru.set("a", 1);
lru.set("b", 2);
lru.set("c", 3);

lru.get("c");
lru.set("d", 4);

console.log(lru.get("a"));
console.log(lru);
