/**
 * 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度
 * @param {String} s
 */

// 窗口滑动方法
function lengthOfLongestSubstring(s) {
  const set = new Set(); // 用来标记是否有出现过的元素
  let k = 0; // 定义一个指针用来标记往右移动的下标
  let ans = 0;
  for (let i = 0; i < s.length; i++) {
    // 以首个字符依次遍历完之后把首字符删掉，以此类推
    if (i != 0) {
      set.delete(s[i - 1]);
    }
    // 分别以每一个字符从左往右开始查找，直到出现重复的字符
    // 例如 "abcabcbb" 以 i = 0,即a开始往右遍历直到出现重复的a,退出while循环，把字符串a删掉，以b开始往右继续查找，以此类推
    while (k < s.length && !set.has(s[k])) {
      set.add(s[k]);
      k++;
    }

    // 找到之后，如果比上次的值大则更新最大值
    ans = Math.max(set.size, ans);
  }
  return ans;
}
