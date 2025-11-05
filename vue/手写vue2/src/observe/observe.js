import { newArrProto } from "./array";
export class Observer {
  constructor(data) {
    if (Array.isArray(data)) {
      data.__proto__ = newArrProto;
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }
  walk(data) {
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
  observeArray(data) {
    data.forEach((item) => observe(item));
  }
}

export function defineReactive(target, key, value) {
  observe(value);
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      value = newValue;
      observe(newValue);
    },
  });
}

export function proxy(vm, target, key) {
  Object.defineProperty(vm, target, {
    get() {
      return vm[target][key];
    },
    set(newValue) {
      vm[target][key] = newValue;
    },
  });
}

export function observe(data) {
  if (typeof data !== "object" || data == null) {
    return;
  }
  new Observer(data);
}
