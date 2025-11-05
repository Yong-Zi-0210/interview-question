// 引入所需的依赖模块
const mysql = require("mysql");

// 创建与数据库的连接
// 创建连接池
const pool = mysql.createPool({
  host: "47.103.117.97", // 数据库主机名
  user: "root", // 数据库用户名
  password: "Hyz030820", // 数据库密码
  database: "hdatabsae", // 数据库名称
});

// 从连接池中获取连接
pool.getConnection((err, connection) => {
  if (err) throw err;

  // 创建学生表
  const sql = `CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  age INT,
  class VARCHAR(255)
)`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("无法创建学生表：", err);
      return;
    }
    console.log("学生表已成功创建");
  });
});
