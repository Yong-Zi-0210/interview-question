class scheduler {
  constructor(max) {
    this.max = max;
    this.count = 0;
    this.queue = [];
  }

  async add(promiseCreator) {
    if (this.max === this.count) {
      await new Promise((resolve) => this.queue.push(resolve));
    }
    this.count++;
    const res = await promiseCreator();
    this.count--;
    if (this.queue.length) {
      this.queue.shift()();
    }
    return res;
  }
}

class scheduler {
  constructor(max) {
    this.max = max; // 最大数
    this.queue = []; // 等待执行的东西
    this.count = 0; // 当前执行的个数
  }
  async add(promiseCreator) {
    if (this.max === this.count) {
      await new Promise((resolve) => this.queue.push(resolve));
    }
    this.count++;
    const res = await promiseCreator();
    this.count--;
    if (this.queue.length) {
      this.queue.shift()();
    }
    return res;
  }
}
