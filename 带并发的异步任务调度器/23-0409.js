class Scheduler {
  constructor(max) {
    this.count = 0; // 当前执行数
    this.max = max; // 最大执行数量
    this.queue = []; // 等待执行栈
  }
  // 添加异任务
  async add(promiseCreator) {
    // 达到上限就放入带执行队列中
    if (this.max === this.count) {
      await new Promise.resolve((resolve) => this.queue.push(resolve));
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
