import React, { useEffect, useState} from 'react';
import Facade, { fetch } from '../../utils/Facade';
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
    fetch(`/api/artists/${input}`, {
      method: 'GET',
      success: (data) => {
        const isEmpty = data.length > 0;

        setData(data);
        setError(!isEmpty);
        setEmpty(!isEmpty);
      },
      error: (data) => {
        setError(true);
        setEmpty(false);
      }
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
    <div className="home-container">
      {/* don't forget genres */}
      <HomeSearchBar onSubmit={onSubmit} input={input} setInput={setInput}/>
      <UserFlow isLoading={loading} isError={error} error={
        empty ? <NoSearch/> : <Error500/>
      } success={
        <div id="artists" className="home-body-container">
        {data.map(artist => <ArtistCard key={artist.user_id} props={{artist}}/>)}
        </div>
      }/>
      </div>
  );
}

export default Home;