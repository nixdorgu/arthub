import React, { useContext, useEffect, useState} from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Facade from '../utils/Facade';
import ArtistCard from './ArtistCard';
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
          <div id="artists" style={{width: "calc(100vw - 4rem)", margin: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gridTemplateRows: "auto", gap: ".5rem"}}>
          {data.map(artist => <ArtistCard key={artist.user_id} props={{artist}}/>)}
          </div>
        ) : (
          <LoadingIndicator/>
        )}
        </> 
        </div>
    );
}

export default Home;