class PublishSubscribe {
  constructor() {
    this.event = {};
  }

  // 收集订阅
  on(eventName, callback) {
    if (this.event[eventName]) {
      this.event[eventName].push(callback);
    } else {
      this.event[eventName] = [callback];
    }
  }
  // 发布
  emit(eventName, ...args) {
    this.event[eventName] &&
      this.event[eventName].forEach((fn) => fn.apply(this, args));
  }
  // 取消订阅
  remove(eventName, callback) {
    if (this.event[eventName]) {
      // 注意！如果订阅的一次，但是不触发emit的话直接调用remove是取消不掉使用once订阅的事件
      // 因为过滤的条件是fn !== callback,所以需要修改为fn.cb && fn.cb !== callback
      this.event[eventName] = this.event[eventName].filter((fn) =>
        fn.cb ? fn.cb !== callback : fn !== callback
      );
    }
  }

  // 只订阅一次
  once(eventName, callback) {
    const fn = (...args) => {
      callback.apply(this, args);
      this.remove(eventName, fn);
    };
    fn.cb = callback;
    this.on(eventName, fn);
  }
}
