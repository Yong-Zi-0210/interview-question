// 3、first input first output(先进先出)， 上限后按入栈顺序删除
class FIFOCache {
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
    if (this.map[key]) {
      return this.map[key];
    }
    return -1;
  }
}

const fifo = new FIFOCache(3);
fifo.set("a", 2);
fifo.set("b", 3);
fifo.set("c", 4);
fifo.set("d", 5);
console.log(fifo.get("a"));
fifo.set("c", 4);
console.log(fifo);
