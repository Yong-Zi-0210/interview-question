// packages/shared/src/index.ts
function isObject(value) {
  return value !== null && typeof value === "object";
}

// packages/reactivity/src/reactive.ts
function reactive(target) {
  if (!isObject(target)) {
    return target;
  }
  return target;
}
export {
  reactive
};
//# sourceMappingURL=reactivity.esm-bundler.js.map
