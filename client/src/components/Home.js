import React, { useContext, useEffect, useState} from 'react';
import { Redirect } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import LoadingIndicator from './LoadingIndicator';

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
      <>
        {ctx.authenticated ? null : <Redirect to="/login"/>}

        {data.length > 0 ? (
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", flexWrap: "wrap"}}>
          <div style={{display: "flex"}}>
              <input type="text" placeholder="Search for artists, genres, etc"></input>
              
              <button className="search"><span><i className="fa fa-search" style={{color: "#000"}}></i> Search</span></button>
          </div>
          <div id="artists">
          {data.map((artist) => {
            return <div key={artist.user_id}>
                <h3>{artist.name}</h3>
                <p>{artist.biography || <span>Reach me at <a href={`mailto:${artist.email}`}>{artist.email}</a></span>}</p>
              </div>   
            })}
          </div>
          </div>
        ) : (
          <LoadingIndicator/>
        )}
        
        </>
    );
}

export default Home;