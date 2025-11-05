const arr = [
  { id: 1, parentId: 0, name: "节点1" },
  { id: 2, parentId: 1, name: "节点2" },
  { id: 4, parentId: 2, name: "节点4" },
  { id: 5, parentId: 1, name: "节点5" },
  { id: 3, parentId: 0, name: "节点3" },
  { id: 6, parentId: 4, name: "节点6" },
  { id: 7, parentId: 3, name: "节点7" },
];

const setMap = (arr) => {
  const map = {};
  arr.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });
  return map;
};

function arrayToTree(arr) {
  const map = setMap(arr);
  const tree = [];
  arr.forEach((item) => {
    if (map[item.parentId]) {
      map[item.parentId].children.push(item);
    } else {
      tree.push(map[item.id]);
    }
  });
  return tree;
}
