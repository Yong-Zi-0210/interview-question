// 获取 min~max之间的随机数， 包含
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}
console.log(random(10, 100));
