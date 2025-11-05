/**
 * number 原数组
 * n 取出的数量
 * m n数之和
 */

// n = 0 []
// n = 1 0;   n = 2  0,1; n = 3 0,1,2

const arr = [1, 2, 3, 4, 6, 7, 5, 8];
console.log(numSum(arr, 2, 9));

function numSum(nums, n, m) {
  if (!nums.length || nums.length < n) return [];
  const result = [];
  const stack = [];

  const backtrace = (start) => {
    if (stack.length === n - 1) {
      let end = nums.length - 1;
      while (start <= end) {
        const temp = stack.reduce((acc, cur) => acc + cur);
        if (temp + nums[start] === m) {
          result.push([...stack, nums[start]]);
        }
        if (start !== end && temp + nums[end] === m) {
          result.push([...stack, nums[end]]);
        }
        start++;
        end--;
      }
      return;
    }

    for (let i = start; i < nums.length; i++) {
      stack.push(nums[i]);
      backtrace(i + 1);
      stack.pop();
    }
  };
  backtrace(0);
  return result;
}

function numSum(arr, n, m) {
  if (arr.length < n) return [];
  const res = [];
  const path = [];
  function backtracing(stratIndex) {
    if ((path.length = n - 1)) {
      const endIndex = arr.length - 1;
      while (stratIndex <= endIndex) {
        const step = path.reduce((c, n) => c + n);
        if (step + arr[stratIndex] === m) {
          res.push([...path, arr[stratIndex]]);
        }
        if (step + arr[endIndex] === m && stratIndex !== endIndex) {
          res.push([...path, arr[endIndex]]);
        }
        stratIndex++;
        endIndex--;
      }
      return;
    }

    for (let i = stratIndex; i < arr.length; i++) {
      path.push(arr[i]);
      backtracing(i + 1);
      path.pop();
    }
  }

  backtracing(0);
  return res;
}
