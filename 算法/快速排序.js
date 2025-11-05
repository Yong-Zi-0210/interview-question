// 思路 从数组中取出一个数作为基准，
// 然后拿去何和别的数进行比较，比他大的放在它右边，比他小的放在它左边

function quickSort(arr) {
  // 这里的判断必须要有小于1的情况判断，因为递归到最后的时候是[]，不然会堆栈溢出
  if (arr.length <= 1) return arr;
  const left = [],
    right = [];
  let baseNum = arr[0];
  for (let i = 1; i < arr.length; i++) {
    baseNum >= arr[i] ? left.push(arr[i]) : right.push(arr[i]);
  }
  return quickSort(left).concat([baseNum], quickSort(right));
}

function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const base = arr[0];
  const left = [],
    right = [];
  for (let i = 1; i < arr.length; i++) {
    if (base >= arr[i]) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([base], qiuckSort(right));
}
