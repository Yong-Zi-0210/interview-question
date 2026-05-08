class PublishSubscribe {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [callback];
    } else {
      this.events[eventName].push(callback);
    }
  }
  emit(eventName, args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => {
        fn.apply(this, args);
      });
    }
  }

  remove(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((fn) => {
        fn.cb ? fn.cb !== callback : fn !== callback;
      });
    }
  }

  once(eventName, callbak) {
    const fn = (args) => {
      callbak.apply(this, args);
      this.remove(eventName, fn);
    };

    fn.cb = callbak;
    this.on(eventName, fn);
  }
}
