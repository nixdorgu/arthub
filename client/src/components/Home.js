import React from 'react';

function Home() {
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