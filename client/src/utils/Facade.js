export default class Facade {
    
    post(url, data, success, error) {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            const response = JSON.parse(xhr.responseText);
            
            if (xhr.status === 200) return success(response);
            else return error(response);
          }
        };
    
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    }

    get() {

    }
}