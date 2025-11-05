// 求子集
function subSet(arr) {
  const result = [];
  const path = [];
  function backtracing(startIndex) {
    result.push([...path]);
    if (startIndex > arr.length) return;
    for (let i = startIndex; i < arr.length; i++) {
      path.push(arr[i]);
      backtracing(i + 1);
      path.pop();
    }
  }
  backtracing(0);
  return result;
}

// 从数组中取出n个数，他们的和为m 的组合

function sum(arr, n, m) {
  const result = [];
  const path = [];
  function backtracing(startIndex) {
    if (path.length === n - 1) {
      let endStart = arr.length - 1;
      while (startIndex <= endStart) {
        const step = path.reduce((p, n) => {
          p + n;
        });
        if (step + arr[startIndex] === m) {
          result.push([...path, arr[startIndex]]);
        }
        if (step + arr[endStart] === m && endStart !== startIndex) {
          result.push([...path, arr[endStart]]);
        }
        startIndex++;
        endStart--;
      }
      return;
    }
    for (let i = startIndex; i < arr.length; i++) {
      path.push(arr[i]);
      backtracing(i + 1);
      path.pop();
    }
  }
  backtracing(0);
  return result;
}
