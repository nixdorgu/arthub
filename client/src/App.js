import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';
import data from './data';

function App() {
    return (
        <Router>
            <div className="grid-container">
                <Header/>
                <main>
                    <div className="row center">
                        {data.artists.map((artist) => <Card key={artist._id} artist={artist}/>)}
                    </div> 
                </main>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;