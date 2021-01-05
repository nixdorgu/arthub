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

export default class Facade {
    post(url, data, success, error) {
      const xhr = new XMLHttpRequest();
      const token = getToken();


      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const response = JSON.parse(xhr.responseText);
          
          if (xhr.status === 200) return success(response);
          else return error(response);
        }
      };
  
      
      xhr.open("POST", url);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(JSON.stringify(data));
    }

    get(url, success, error) {
      const xhr = new XMLHttpRequest();
      const token = getToken();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          // add error handling
          // const response = typeof xhr.responseText === "object" ? JSON.parse(xhr.responseText) : xhr.responseText;
          const response = JSON.parse(xhr.responseText);
          
          if (xhr.status === 200) return success(response);
          else return error(response);
        }
      };
  
      xhr.open("GET", url);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send();
    }

    patch(url, data, success, error) {
      const xhr = new XMLHttpRequest();
      const token = getToken();


      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const response = JSON.parse(xhr.responseText);
          
          if (xhr.status === 200) return success(response);
          else return error(response);
        }
      };
  
      
      xhr.open("PATCH", url);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(JSON.stringify(data));
    }
}