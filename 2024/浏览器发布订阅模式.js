class PublishSubscribe {
  constructor() {
    this.events = {};
  }

  // 订阅
  subscribe(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [callback];
    } else {
      this.events[eventName].push(callback);
    }
  }

  // 发布
  publish(eventName, ...rest) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => {
        fn.call(this, ...rest);
      });
    }
  }
  // 订阅一次
  once(eventName, callback) {
    const fn = (...rest) => {
      callback.call(this, ...rest);
      this.remove(eventName, fn);
    };
    fn.cb = callback;
    this.subscribe(eventName, fn);
  }
  // 移除订阅
  remove(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName].fliter((fn) =>
        fn.cb ? fn.cb !== callback : fn !== callback
      );
    }
  }
}
