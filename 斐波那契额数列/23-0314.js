// 普通版
function fibonacci(n) {
  if (n === 0 || n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 缓存版
const cache = {};
function fabonacciCache(n) {
  if (n <= 1) {
    return 1;
  }
  if (cache[n]) {
    return cache[n];
  } else {
    cache[n] = fabonacciCache(n - 1) + fabonacciCache(n - 2);
    return cache[n];
  }
}
