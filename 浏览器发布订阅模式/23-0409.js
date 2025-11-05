class EventEmiter {
  constructor() {
    this.eventList = {};
  }
  on(eventName, callback) {
    if (this.eventList[eventName]) {
      this.eventList[eventName].push(callback);
    } else {
      this.eventList[eventName] = [callback];
    }
  }
  emit(eventName, ...rest) {
    if (this.eventList[eventName]) {
      this.eventList[eventName].forEach((fn) => {
        fn.call(this, ...rest);
      });
    }
  }
  remove(eventName, callback) {
    if (this.eventList[eventName]) {
      this.eventList[eventName] = this.eventList[eventName].filter((fn) =>
        fn.cb ? fn.cb !== callback : fn !== callback
      );
    }
  }
  once(eventName, callback) {
    const fn = (...rest) => {
      callback.call(this, ...rest);
      this.remove(eventName, fn);
    };
    fn.cb = callback;
    this.on(eventName, fn);
  }
}
