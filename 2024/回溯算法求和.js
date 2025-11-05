// 从原数组nums中取出n个数，和为m的组合有多少个
function numSum(nums, n, m) {
  if (!nums.length || nums.length < n) return []; // 判断数组长度
  const result = [];
  const stack = [];
  function backtrace(start) {
    if (stack.length === n - 1) {
      const end = nums.length - 1;
      const temp = stack.reduce((pre, next) => pre + next);
      while (start <= end) {
        if (temp + nums[start] === m) {
          result.push([...stack, nums[start]]);
        }
        if (temp + start[end] === m && start !== end) {
          result.push([...stack, nums[end]]);
        }
        start++;
        end--;
      }
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      stack.push(nums[i]);
      backtrace(i + 1);
      stack.pop();
    }
  }
  backtrace(0);
  return result;
}
