export default class Facade {
    
    post(url, data, sucess, error) {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            const response = JSON.parse(xhr.responseText);
            
            if (xhr.status === 200) return sucess(response);
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