const Koa = require("koa");
const Router = require("koa-router");
// const { connection } = require("./connect");
// console.log(connection);
const app = new Koa();
const router = new Router();
const mysql = require("mysql");

// 创建与数据库的连接
const connection = mysql.createConnection({
  // host: "localhost", // 数据库主机名
  // user: "hyz", // 数据库用户名
  // password: "hyz030820", // 数据库密码
  // database: "hdatabase", // 数据库名称
  host: "47.103.117.97", // 数据库主机名
  user: "root", // 数据库用户名
  password: "Hyz030820", // 数据库密码
  database: "hdatabsae", // 数据库名称
});
connection.connect((err) => {
  if (err) {
    console.error("无法连接到数据库：", err);
  }
  console.log("已成功连接到数据库");
});

// 查询
function executeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// 新增
function executeAdd(query, student) {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
// 定义查询学生信息的接口

// 注册接口
router.get("/api/students", async (ctx, next) => {
  const query = "SELECT * FROM students";
  try {
    const res = await executeQuery(query);
    console.log("res", res);
    await next();
    ctx.body = res;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = {
      message: "失败",
    };
  }
});
router.post("/api/addStudent", async (ctx, next) => {
  try {
    // const obj = { name: "John", age: 18, className: "1107" };
    // const { name, age, className } = obj;
    const query = `INSERT INTO students (name, age, class) VALUES ( 'John', 19, '1102')`;
    const res = await executeAdd(query);
    console.log("res", res);
    await next();
    ctx.body = res;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = {
      message: "失败",
    };
  }
});
app.use(async (ctx, next) => {
  // 设置响应头，允许跨域请求
  ctx.set("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  ctx.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  ctx.set("Access-Control-Allow-Headers", "Content-Type");

  await next();
});

// 将路由中间件添加到 Koa 应用
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动，访问 http://localhost:${PORT}`);
});
