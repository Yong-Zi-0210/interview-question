class Scheduler {
  constructor(max) {
    this.max = max;
    this.quque = [];
    this.current = 0;
  }
  async add(asyncTask) {
    if (this.current === this.max) {
      await new Promise((resolve) => this.quque.push(resolve));
    }
    this.current++;
    const res = await asyncTask();
    this.current--;
    if (this.quque.length) {
      this.quque.shift()();
    }
    return res;
  }
}

class Scheduler {
  constructor(max) {
    this.max = max;
    this.count = 0;
    this.quque = [];
  }
  async add(asyncTask) {
    if (this.count === this.max) {
      await new Promise((resolve) => this.quque.push(resolve));
    }
    this.count++;
    const res = await asyncTask();
    this.count--;
    if (this.quque.length) {
      this.quque.shift()();
    }
    return res;
  }
}
