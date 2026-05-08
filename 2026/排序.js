/**
 * 冒泡排序
 * 
 * 外层循环 (i 循环)
表示总共需要进行多少轮排序。
每一轮结束后，当前未排序部分的最大（或最小）元素会被“冒泡”到数组的末端（或前端）。
如果有 n 个元素，最多需要 n-1 轮。

内层循环 (j 循环)
表示在当前未排序的范围内，进行相邻元素的比较和交换。
它从数组开头（或未排序部分的起点）遍历到当前轮次结束的位置，若前一个元素比后一个元素大（升序为例），则交换它们。
随着外层循环进行，内层循环的结束范围会逐渐减少（因为尾部元素已排好）
 * @param {*} arr 
 * @returns 
 */

function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// 快速排序
function quickSort(arr) {
  const baseIndex = Math.floor(arr.length / 2);
  const base = arr[baseIndex];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > base) {
      right.push(arr[i]);
    }
    if (arr[i] < base) {
      left.push(arr[i]);
    }
  }

  return quickSort(left).concat([base], quickSort(right));
}
