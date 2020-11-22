import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="grid-container">
                    <Header/>
                    <main>
                        <Route exact path="/" component={Home}></Route>
                        <Route exact path="/login" component={Login}></Route>
                        <Route exact path="/register" component={Signup}></Route>
                        <Route exact path="/profile" component={() => <Profile props={{name: "Kira"}}/>}></Route>
                    </main>
                    <Footer/>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;