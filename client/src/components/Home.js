import React, { useContext, useEffect, useState} from 'react';
import { Redirect } from 'react-router';
import { AuthContext } from '../AuthContext';

function Home() {
  const ctx = useContext(AuthContext);
  const [data, setData] = useState([]);

  function fetchArtists() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const response = JSON.parse(xhr.responseText);

        if (xhr.status === 200) {
          setData(response);
        } else {
          // Error message
          // Retry btn? On click refresh page
        }   
      }
    }

    xhr.open("GET", '/api/artists');
    xhr.send();
  }

  useEffect(() => {
    fetchArtists()
  }, []); 

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", flexWrap: "wrap"}}>
          {ctx.authenticated ? null : <Redirect to="/login"/>}
          <div style={{display: "flex"}}>
              <input type="text" placeholder="Search for artists, genres, etc"></input>
              
              <button className="search"><span><i className="fa fa-search" style={{color: "#000"}}></i> Search</span></button>
          </div>
          <div id="artists"></div>
        </div>
    );
}

export default Home;