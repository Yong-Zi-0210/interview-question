class PublisherSubscribe {
  constructor() {
    this.events = {};
  }
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [callback];
    } else {
      this.events[event].push(callback);
    }
  }
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((fn) => fn.apply(this, args));
    }
  }
  remove(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((fn) =>
        fn.cb ? fn.cb !== callback : fn !== callback
      );
    }
  }
  once(event, callback) {
    const fn = (...args) => {
      callback.apply(this, args);
      this.remove(event, fn);
    };
    fn.cb = callback;
    this.on(event, fn);
  }
}
