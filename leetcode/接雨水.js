// 使用双指针方法
function trap(height) {
  let left = 0,
    ans = 0,
    right = height.length - 1;
  let leftMax, rightMax;
  while (left < right) {
    // 移动指针后计算新的最大值
    leftMax = Math.max(leftMax, height[left]);
    rightMax = Math.max(rightMax, height[right]);

    if (height[left] < height[right]) {
      ans += leftMax - height[left];
      left++;
    } else {
      ans += rightMax - height[right];
      right--;
    }
  }
  return ans;
}
