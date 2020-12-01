import React, { useContext, useEffect, useState} from 'react';
import { Redirect, Link } from 'react-router-dom';
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
    console.log(data)
  }, []); 

    return (
      <>
        {ctx.authenticated ? null : <Redirect to="/login"/>}

        {data.length > 0 ? (
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexWrap: "wrap"}}>
            <form style={{display: "flex", width: "80%", maxWidth: "600px"}}>
            <input type="text" placeholder="Search for artists, genres, etc" style={{flex: "1", fontFamily: "Montserrat, sans-serif", padding: ".35rem"}}></input>
                
                {/* <button className="search" style={{background: "#ff5678"}}><span><i className="fa fa-search" style={{color: "#000"}}></i> Search</span></button> */}
                <button className="search" style={{background: "#ff5678", padding: ".5rem", fontFamily: "Montserrat"}}>Search</button>
            </form>
          <div id="artists" style={{margin: "2rem", display: "flex", flexWrap: "wrap"}}>
          {data.map((artist) => {
            return <div style={{padding: ".8rem", boxShadow: "1px 1px 1px 1px #ff5678", flex: "1", margin: ".2rem", borderRadius: "10px"}}>
            <div key={artist.user_id}>
                <h3>{artist.name}</h3>
                <p>{artist.biography || <span>Reach me at <a href={`mailto:${artist.email}`}>{artist.email}</a></span>}</p>
              </div> 
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