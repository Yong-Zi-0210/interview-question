// 获取 min~max之间的随机数
function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min) + 1;
}
console.log(random(10, 100));
