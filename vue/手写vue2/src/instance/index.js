import { proxy, observe } from "../observe/observe";

function Vue(options) {
  this._init(options);
}

Vue.prototype._init = function (options) {
  const vm = this;
  vm.$options = options;
  initMixin(vm);
};

function initMixin(vm) {
  initState(vm);
}

function initState(vm) {
  initData(vm);
}

function initData(vm) {
  const data = vm.$options.data;
  vm._data = data;
  observe(data);
  for (const key in data) {
    proxy(vm, "_data", key);
  }
}
