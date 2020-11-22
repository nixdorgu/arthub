import React, { useState } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Card from './components/Card';

import data from './data';
import { AuthContext } from './AuthContext';

function App() {
    const [authenticated, setAuthenticated] = useState(false);
    return (
        <Router>
            <AuthContext.Provider value={{authenticated, setAuthenticated}}>
                <div className="grid-container">
                    <Header/>
                    <main>
                        <Route exact path="/" component={Home}></Route>
                        <Route exact path="/login" component={Login}></Route>
                        <Route exact path="/register" component={Signup}></Route>
                        <Route exact path="/profile" component={() => <Profile props={data.artists[0]}/>}></Route>
                        {/* <div className="row center">
                            {data.artists.map((artist) => <Card key={artist._id} artist={artist}/>)}
                        </div>  */}
                    </main>
                    <Footer/>
                </div>
            </AuthContext.Provider>
        </Router>
    );
}

export default App;