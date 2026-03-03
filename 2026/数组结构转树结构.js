// 根据数组中的数据关系，输出层级关系的结构
const arr = [
  { parentId: 0, id: 1, name: "节点一" },
  { parentId: 1, id: 2, name: "节点二" },
  { parentId: 1, id: 3, name: "节点三" },
  { parentId: 3, id: 4, name: "节点四" },
  { parentId: 3, id: 5, name: "节点五" },
  { parentId: 5, id: 6, name: "节点六" },
];

// 优先构建一个id: {...item}的map映射关系
const setMap = (arr) => {
  const map = {};
  arr.forEach((item) => {
    map[item.id] = {
      ...item,
      children: [],
    };
  });
  return map;
};

// 利用映射关系组装数据
function arrToTree(arr) {
  const map = setMap(arr);
  const tree = [];
  arr.forEach((item) => {
    if (map[item.parentId]) {
      map[item.parentId].children.push(item);
    } else {
      // 根节点
      tree.push(map[item.id]);
    }
  });
  return tree;
}
