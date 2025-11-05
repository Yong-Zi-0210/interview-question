const ajax = (options) => {
  const objToString = (data) => {
    const arr = [];
    data.t = new Date().getTime();
    for (let key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        arr.push(`${encodeURIComponent(key)}=${decodeURIComponent[data[key]]}`);
      }
    }
    return arr.join("&");
  };
  const str = objToString(options.data || {});
  // 创建xhr实例
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Micosoft.XMLHTTP");
  }
  // 打开连接
  if (options.type.toLowerCase() === "get") {
    xhr.open(options.type, `${options.url}?t=${str}`, true);
    xhr.send();
  } else {
    xhr.open(options.type, options.url, true);
    xhr.setRequestHeader("Content-type", "application/www-x-form-urlencoded");
    xhr.send(str);
  }
  xhr.onreadstatechange = () => {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        options.success(xhr.responseText);
      } else {
        options.error(xhr.responseText);
      }
    }
  };
  if (options.timeout) {
    const timer = setTimeout(() => {
      xhr.abort();
      clearTimeout(timer);
    }, options.timeout);
  }
};
