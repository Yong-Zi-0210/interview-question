import { isObject } from "packages/shared/src";

export function reactive(target) {
  if (!isObject(target)) {
    return target;
  }
  // TODO: 后续实现 Proxy 响应式
  return target;
}
