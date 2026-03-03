// 冒泡排序
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
