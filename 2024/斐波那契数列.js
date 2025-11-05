// 普通版
function fabonacci() {
  if (n <= 1) return 1;
  return fabonacci(n - 1) + fabonacci(n - 2);
}

// 优化版，利用缓存
const cache = {};
function fabonacciCache(n) {
  if (n <= 1) return 1;
  if (cache[n]) {
    return cache[n];
  } else {
    cache[n] = fabonacciCache(n - 1) + fabonacciCache(n - 2);
    return cache[n];
  }
}
