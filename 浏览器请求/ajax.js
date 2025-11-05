class Ajax {
  constructor() {
    this.createXhr();
  }

  // 创建XML对象
  createXhr() {
    if (window.XMLHttpRequest) {
      this.xhr = new XMLHttpRequest();
    } else {
      // 兼容IE6以下
      this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
  post(options) {
    // open第三的参数true表示异步，false表示同步
    this.xhr.open("POST", options.url, true);
    this.xhr.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    const data = this.objToString(options.data || {});
    this.xhr.send(data);
    options.finally = this.onreadystatechange(options.success, options.error);
    if (options.timeout) {
      this.timeout(timeout);
    }
  }
  get(options) {
    const data = this.objToString(options.data || {});
    this.xhr.open("GET", options.url + "?t=" + data, true);
    this.xhr.send();
    this.onreadystatechange(options.success, options.error);
    if (options.timeout) {
      this.timeout(timeout);
    }
  }
  onreadystatechange(success, error) {
    this.xhr.onreadystatechange = () => {
      // 当readyState为4时，表示请求完成
      if (this.xhr.readyState === 4) {
        // status HTTP状态码
        if (
          (this.xhr.status >= 200) & (this.xhr.status < 300) ||
          this.xhr.status === 304
        ) {
          success(this.xhr.responseText);
        } else {
          error(this.xhr.responseText);
        }
      }
    };
  }
  objToString(data) {
    data.t = new Date().getTime();
    let res = [];
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        res.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
      }
    }
    return res.join("&");
  }
  timeout(timeout) {
    let timer = setInterval(() => {
      this.xhr.abort(); // 中断请求
      clearInterval(timer);
    }, timeout);
  }
}

// 模仿jQuery的ajax
const ajax = (option) => {
  let xhr;
  //数据设置
  function objToString(data) {
    data.t = new Date().getTime();
    let res = [];
    for (let key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        res.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
      }
    }
    return res.join("&");
  }
  const str = objToString(option.data || {});
  // 创建XMLHttpResquest对象
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    // 兼容IE6以下
    xhr = ActiveXObject("Microsoft.XMLHTTP");
  }
  // 判断POST/GET请求方式
  if (option.type.toLowerCase() === "get") {
    xhr.open(option.type, `${option.url}?t=${str}`, true);
    xhr.send();
  } else {
    xhr.open(option.type, option.url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(str);
  }
  // 监听状态
  xhr.onreadystatechange = () => {
    timer && clearInterval(timer);
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        // 成功回调
        option.success(xhr.responseText);
      } else {
        // 失败回调
        option.error(xhe.responseText);
      }
    }
  };
  let timer = "";
  if (option.timeout) {
    timer = setInterval(() => {
      xhr.abort(); // 中断请求
    }, option.timeout);
  }
};
