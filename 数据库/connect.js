// 引入所需的依赖模块
const mysql = require("mysql");

// 创建与数据库的连接
const connection = mysql.createConnection({
  host: "localhost", // 数据库主机名
  user: "hyz", // 数据库用户名
  password: "hyz030820", // 数据库密码
  database: "hdatabase", // 数据库名称
});

// 连接到数据库
function getConnection() {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error("无法连接到数据库：", err);
        reject();
      }
      resolve(connection);
      console.log("已成功连接到数据库");
    });
  });
}
// 关闭与数据库的连接
function connectionEnd() {
  connection.end((err) => {
    if (err) {
      console.error("关闭数据库连接时出错：", err);
      return;
    }
    console.log("已成功关闭数据库连接");
  });
}
module.exports = {
  connection: getConnection(),
  connectionEnd,
};
