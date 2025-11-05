class Publisher {
  constructor() {
    this.event = {};
  }

  // 订阅
  on(eventName, callback) {
    if (this.event[eventName]) {
      this.event[eventName].push(callback);
    } else {
      this.event[eventName] = [callback];
    }
  }
  // 发布
  eimt(eventName, ...rest) {
    if (this.event[eventName]) {
      this.event[eventName] = this.event[eventName].forEach((callback) =>
        callback.call(this, ...rest)
      );
    }
  }
  // 取消订阅
  remove(eventName, callback) {
    if (this.event[eventName]) {
      this.event[eventName].filter((item) =>
        item.callback ? item.callback !== callback : item !== callback
      );
    }
  }
  // 一次
  once(eventName, callback) {
    const executor = (...rest) => {
      callback.call(this, ...rest);
      this.remove(eventName, executor);
    };
    executor.callback = callback;
    this.on(eventName, executor);
  }
}
