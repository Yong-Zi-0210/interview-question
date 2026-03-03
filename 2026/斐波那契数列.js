// 最普通的递归方式
function fib(n) {
  if (n <= 1) return 1;
  return fib(n - 1) + fib(n - 2);
}

// 动态规划方式
function fibDP(n) {
  if (n <= 1) return n;
  let dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// 优化空间复杂度的动态规划
function fibDP2(n) {
  if (n <= 1) return n;
  let prev = 0;
  let curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}
