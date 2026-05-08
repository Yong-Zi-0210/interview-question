/**
 *
 * @param {*} options
 */
const ajax = (options) => {
  let timer = null;
  // 处理post和get的参数
  const setParam = (data) => {
    let params = [];
    for (let key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        params.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`,
        );
      }
    }
    params.push(`t=${new Date().getTime()}`);
    return params.join("&");
  };

  // 1、创建XHR对象
  let xhr;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  const params = setParam(options.data);
  // 打开连接
  if (options.method.toLowerCase() === "get") {
    xhr.open(options.method, `${options.url}?${params}`, true);
    xhr.send();
  } else if (options.method.toLowerCase() === "post") {
    xhr.open(options.method, options.url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  }

  // 监听变化
  xhr.onreadystatechange = function () {
    // 判断readyState
    if (xhr.readyState === 4) {
      clearTimeout(timer);
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        options.success && options.success(xhr.responseText);
      } else {
        options.error && options.error(xhr.responseText);
      }
    }
  };

  // 判断有没有超时
  if (options.timeout) {
    timer = setTimeout(() => {
      xhr.abort();
      clearTimeout(timer);
    }, options.timeout);
  }
};
