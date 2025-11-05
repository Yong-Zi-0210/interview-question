const ajax = (options) => {
  const objToString = (data) => {
    const res = [];
    data.t = new Date().getTime();
    for (let key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        res.push(`${encodeURIComponent(key)}=${decodeURIComponent(date[key])}`);
      }
    }
    return res.join("&");
  };

  const str = objToString(options.data);

  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }

  if (options.type.toLowerCase() === "get") {
    xhr.open(options.type, `${options.url}?t=${str}`, true);
    xhr.send();
  } else {
    xhr.open(options.type, options.url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(str);
  }

  xhr.onreadystatechange = () => {
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
