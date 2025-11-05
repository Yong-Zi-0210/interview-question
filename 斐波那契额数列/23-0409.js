const cache = {};
function fabonacci(n) {
  if (n === 1 || n === 2) {
    return 1;
  }
  if (cache[n]) {
    return cache[n];
  } else {
    cache[n] = fabonacci(n - 1) + fabonacci(n - 2);
    return cache[n];
  }
}
