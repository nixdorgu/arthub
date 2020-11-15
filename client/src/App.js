import React from 'react';
import Card from './components/Card';
import data from './data';

function App() {
    const imgSrc = "../../../../../Pictures/2x2.jpg";

    return (
        <div className="grid-container">
        <header className="row">
            <div>
                <a href="/" className="logo">arthub</a>
            </div>
            <div>
                <a href="#">Artists</a>
                <a href="#">Login</a>
            </div>
        </header>
        <main>
            <div className="row center">
                {data.artists.map((artist) => <Card key={artist._id} props={artist}/>)}
            </div> 
        </main>
        <footer className="row center">
            <p>All rights reserved &copy; 2020</p>
        </footer>    
    </div>
    );
}

export default App;