// Math.random只能获取到[0, 1)之间的小数，不包含1， 先将目标数放大，即[n, m-n+1)
// 例如求1,10之前的整数,取不到10，最大也是9.9999然后向下取整得到9，再加上1可得到10
function random(n, m) {
  return Math.floor(Math.random() * (m - n + 1)) + min;
}
