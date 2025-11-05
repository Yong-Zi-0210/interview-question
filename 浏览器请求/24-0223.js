const ajax = (options) => {
  // 创建xhr实例
  let xmlHttp, timer;
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.xmlHttp");
  }

  // 处理要发送的数据
  const objTostr = (obj) => {
    obj.t = new Date().getTime();
    const params = [];
    for (const key in obj) {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[ket])}`);
    }
    return params.join("&");
  };
  const data = objTostr(options.data || {});
  // post请求
  if (options.method?.toLowerCase() === "post") {
    xmlHttp.setRequstHeader(
      "Content-type",
      "application/x-wwww-form-urlencoded"
    );
    xmlHttp.open(options.method, options.url, true); // 打开链接
    xmlHttp.send(data); // 发送数据
    // get请求
  } else {
    xmlHttp.open(options.method, options.url + "?t=" + data, true);
    xmlHttp.send();
  }

  // 监听事件
  xmlHttp.onreadystatechange = function () {
    clearInterval(timer);
    if (xmlHttp.readyState === 4) {
      if (
        (xmlHttp.status >= 200 && xmlHttp.status < 300) ||
        xmlHttp.status === 304
      ) {
        options.success(xmlHttp.responseText);
      } else {
        options.error(xmlHttp.responseText);
      }
    }
  };

  // 超时处理
  if (options.timeout) {
    timer = setInterval(() => {
      xmlHttp.abort();
      clearInterval(timer);
    }, options.timeout);
  }
};

const ajax1 = (option) => {
  // 创建xhr实例
  let xmlHttp, timer;

  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.xmlHttp");
  }

  // 处理发送的数据
  const objTostr = (data) => {
    data.t = Date.now();
    const res = [];
    for (const key in data) {
      res.push(`${encodeURIComponent(key)}=${encodeURIComponent(deta[key])}`);
    }
    return res.join("&");
  };

  const str = objTostr(option.data);

  // 不同请求方法处理
  if (option.methd?.toLowerCase() === "post") {
    xmlHttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    xmlHttp.open(option.methd, option.url, true);
    xmlHttp.send(str);
  } else {
    xmlHttp.open(option.methd, option.url + "?t=" + str, true);
    xmlHttp.send();
  }

  // 监听事件
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4) {
      if ((xmlHttp.status >= 200 && xmlHttp < 300) || xmlHttp.status === 304) {
        option.success(xmlHttp.responseText);
      } else {
        option.error(xmlHttp.responseText);
      }
    }
  };

  // 超时处理
  if (option.timeout) {
    timer = setInterval(() => {
      xmlHttp.abort();
      clearInterval(timer);
    }, option.timeout);
  }
};
