var arr = [
  { id: 1, parentId: 0, name: "节点1" },
  { id: 2, parentId: 1, name: "节点2" },
  { id: 4, parentId: 2, name: "节点4" },
  { id: 5, parentId: 1, name: "节点5" },
  { id: 3, parentId: 0, name: "节点3" },
  { id: 6, parentId: 4, name: "节点6" },
  { id: 7, parentId: 3, name: "节点7" },
];

// 转变成tree格式
// [{{id: 1, parentId: 0, name: '节点1',
//    children: [
//      {id: 2, parentId: 1, name: '节点2'},
//      {id: 5, parentId: 1, name: '节点5'}
//  ]},}]
//
//

// 1、先整理成{id: item}结构方便做映射
const setMap = (arr) => {
  const map = {};
  arr.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });
  return map;
};

// 2、遍历原有数据
const listToTree = (arr) => {
  const map = setMap(arr);
  const tree = [];
  arr.forEach((item) => {
    const parent = map[item.parentId]; // 利用id和parentId做映射
    if (parent) {
      parent.children.push(item);
    } else {
      // 没找到父节点说明是根结点数据
      tree.push(map[item.id]);
    }
  });
  return tree;
};

console.log(listToTree(arr));
