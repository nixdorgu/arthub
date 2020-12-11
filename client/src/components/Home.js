import React, { useContext, useEffect, useState} from 'react';
import { Redirect, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Facade from '../utils/Facade';
import LoadingIndicator from './LoadingIndicator';

function Home() {
  const ctx = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [input, setInput] = useState('');

  function searchArtists(input) {
    new Facade().get(`/api/artists/${input}`, (success) => {
      setData(success)
    }, (error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    searchArtists(input);
  }, [input]); 

    return (
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexWrap: "wrap"}}>
        {ctx.authenticated ? null : <Redirect to="/login"/>}
        {/* don't forget genres */}
        <form style={{display: "flex", width: "80%", maxWidth: "600px"}} onSubmit={(e) => {
          e.preventDefault();
          searchArtists(input)
          }}>
            <input type="text" placeholder="Search for artists, genres, etc" style={{flex: "1", fontFamily: "Montserrat, sans-serif", padding: ".35rem"}} onChange={(e) => setInput(e.target.value)} value={input}></input>
            <button type="submit" className="search" style={{background: "#ff5678", padding: ".5rem", fontFamily: "Montserrat"}}>Search</button>
        </form>
        <>
        {data.length > 0 ? (

          <div id="artists" style={{margin: "2rem", display: "flex", flexWrap: "wrap"}}>
          {data.map((artist) => {
            return <div key={artist.user_id} style={{padding: ".8rem", boxShadow: "1px 1px 1px 1px #ff5678", flex: "1", margin: ".2rem", borderRadius: "10px"}}>
              <div style={{display: "flex", justifyContent: "space-around"}}>
                <div>Image</div>
                <div>
                  <h4>{artist.name}</h4>
                  <p>Location</p>
                  {/* <p>{artist.biography || <span>Reach me at <a href={`mailto:${artist.email}`}>{artist.email}</a></span>}</p> */}
                </div> 
              </div>
            </div>  
            })}
          </div>
        ) : (
          <LoadingIndicator/>
        )}
        </> 
        </div>
    );
}

export default Home;