/**
 *
 * @param {String} max 最大执行数
 * queue 等待执行队列
 * count 当前执行数
 */

// 实现思路：
// 当前执行的数量等于最大执行数时，需要把任务放到待执行队列里等待执行，
// 每次添加任务当前的执行数加一(即this.count++)
// 执行完当前的任务后，当前执行数减一（即this.count--）
//
class Scheduler {
  constructor(max) {
    this.max = max;
    this.queue = [];
    this.count = 0;
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
