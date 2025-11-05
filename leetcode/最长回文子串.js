// 动态规划法

//双指针中心扩散法
function longestPalindrome(s) {
  const subStr = ""; // 记录回文子串
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }

  // 从中间往两边扩散对边两边是字符是否一样
  // 情况一：中间是基数（bab）此时让left 和 right相同
  // 情况二： 中间是偶数（baab）此时left = right -1
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    // 当不满足回文条件时， left和right都超出了i的范围，比如i是3，right此时是4，中加回文子串的长度就是right - left - 1
    // 对比上一次回文子串的长度，大于就更新最长回文子串
    if (right - left - 1 > subStr.length) {
      subStr = s.slice(left + 1, right);
    }
  }

  return subStr;
}
