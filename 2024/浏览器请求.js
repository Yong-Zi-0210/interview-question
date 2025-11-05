const ajax = (options) => {
  let timer, // 定时器
    xhr; // XMLHTTPRequest实例

  // 1、 创建实例
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }

  // 2、处理传惨
  const objToString = (data) => {
    data.t = Date.now();
    const res = [];
    for (let key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        res.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
      }
    }
    return res.join("&");
  };
  // 3、发起请求
  const str = objToString(options.data);
  const method = options.method.toLowerCase();
  if (method === "post") {
    xhr.open("POST", options.url, true);
    xhr.setResquestHeader("content-type", "application/x-www-form-urlendcoded");
    xhr.send(str);
  } else {
    xhr.open("GET", `${options.url}?t=${str}`, true);
    xhr.send();
  }

  // 4、监听变化
  xhr.onreadystatechange = () => {
    if (xhr.readystate === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        options.success(xhr.responseText);
      } else {
        options.error(xhr.responseText);
      }
    }
  };

  // 终端请求
  if (options.timeout) {
    timer = setTimeout(() => {
      xhr.abort();
      clearTimeout(timer);
    }, options.timeout);
  }
};
