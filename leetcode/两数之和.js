// 输入一个数，在数组中找到两个数相加的和等于这个数，并返回他们的下标

// 利用哈希表
function twoNumSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (map.has(target - nums[i])) {
      return [map.get(target - nums[i]), i];
    }
    map.set(nums[i], i);
  }
}
