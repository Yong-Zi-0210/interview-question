// 依次比较相邻的两个元素，如果前一个比后一个大，则交换位置
function bubbleSort(arr) {
  if (arr.length <= 1) return arr;
  for (let i = 0; i < arr.length; i++) {
    // 表示需要比较多少轮
    for (let j = 0; j < arr.length; j++) {
      // 每轮比较两个相邻的元素
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

function bubbleSort(arr) {
  if (arr.length <= 1) return arr;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
