import React, { useEffect, useState} from 'react';
import Facade from '../../utils/Facade';
import ArtistCard from './ArtistCard';
import UserFlow from '../../utils/UserFlow';
import NoSearch from '../states/NoSearch';
import Error500 from '../states/Error500';
import HomeSearchBar from './HomeSearchBar';

function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false)
  const [data, setData] = useState([]);
  const [input, setInput] = useState('');

  function searchArtists(input) {
    new Facade().get(`/api/artists/${input}`, (success) => {
      const isEmpty = success.length > 0;

      setData(success);
      setError(!isEmpty);
      setEmpty(!isEmpty);
    }, (error) => {
      setError(true);
      setEmpty(false);
    });
  }

  function onSubmit(e, input) {
    e.preventDefault();
    searchArtists(input)
  }

  useEffect(() => {
    setLoading(true);
    searchArtists(input);
    setLoading(false);
  }, [input]); 

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexWrap: "wrap"}}>
      {/* don't forget genres */}
      <HomeSearchBar onSubmit={onSubmit} input={input} setInput={setInput}/>
      <UserFlow isLoading={loading} isError={error} error={
        empty ? <NoSearch/> : <Error500/>
      } success={
        <div id="artists" style={{width: "calc(100vw - 8rem)", margin: "2rem", display: "grid", justifyContent: "center", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gridTemplateRows: "auto", gap: ".5rem"}}>
        {data.map(artist => <ArtistCard key={artist.user_id} props={{artist}}/>)}
        </div>
      }/>
      </div>
  );
}

export default Home;