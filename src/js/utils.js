export default function asyncRequest(method, url, data) {
  return new Promise((resolve, reject) => {
    let target = url;
    let body = null;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText);
          resolve(json);
        } catch (e) {
          resolve(xhr.responseText);
        }
      } else reject(xhr.status);
    };
    if (method.toLowerCase() === 'get') {
      const suffix = Object.keys(data).map((key) => `${key}=${encodeURIComponent(data[key])}`).join('&');
      target += `?${suffix}`;
    } else {
      body = JSON.stringify(data);
    }
    xhr.open(method.toUpperCase(), target);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(body);
  });
}
