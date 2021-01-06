import { getToken } from "./Tokens";

export function fetch(url, { method, image, data, success, error } = {}) {
  const xhr = new XMLHttpRequest();
  const token = getToken();

  const body = {...data, ...image};

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      const xhrResponseText = xhr.responseText;
      let response;

      try {
        response = JSON.parse(xhrResponseText);
      } catch {
        response = { message: 'Something went wrong' }
      }
      
      if (xhr.status === 200) {
        return success(response);
      } else {
        return error(response);
      }
    }
  };

  
  xhr.open(method.toUpperCase(), url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  xhr.send(JSON.stringify(body));
}