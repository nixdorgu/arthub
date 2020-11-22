import React from 'react';

function Home() {
  window.onload = () => {
    const xhr = new XMLHttpRequest();
    const artists = document.querySelector("#artists");

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const response = JSON.parse(xhr.responseText);

        if (xhr.status === 200) {
          let innerHTML = '';

          for (const artist of response) {
            innerHTML += `
              <div key=${artist.user_id}>
                <h3>${artist.name}</h3>
                <p>${artist.biography || `Reach me at <a href="mailto:${artist.email}">${artist.email}</a>`}</p>
              </div>   
            `;
          }

          artists.innerHTML = innerHTML;  
        } else {
          // Error message
          // Retry btn? On click refresh page
        }   
      }
    };

    xhr.open("GET", '/api/artists');
    xhr.send();
}

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", flexWrap: "wrap"}}>
          <div style={{display: "flex"}}>
              <input type="text" placeholder="Search for artists, genres, etc"></input>
              
              <button className="search"><span><i className="fa fa-search" style={{color: "#000"}}></i> Search</span></button>
          </div>
          <div id="artists"></div>
        </div>
    );
}

export default Home;