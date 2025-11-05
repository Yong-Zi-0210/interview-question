function qiuckSort(arr) {
  if (arr.length <= 1) return arr;
  const base = arr[0];
  const left = [],
    rigth = [];
  for (let i = 1; i < arr.length; i++) {
    base >= arr[i] ? left.push(arr[i]) : rigth.push(arr[i]);
  }
  return quickSort(left).concat([base], quickSort(rigth));
}

function quickSort(nums) {
  if (nums.length <= 1) return nums;
  const base = nums[0];
  const left = [];
  const right = [];
  for (let i = 1; i < nums.length; i++) {
    base <= nums[i] ? right.push(nums[i]) : left.push(nums[i]);
  }
  return quickSort(left).concat([base], quickSort(right));
}
