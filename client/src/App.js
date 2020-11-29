import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import { AuthProvider } from './context/AuthContext';
import PageNotFound from './components/PageNotFound';
import Messages from './components/Messages';
import MessageRoom from './components/MessageRoom';

function App() {
    return (
        <Router>
            <AuthProvider>
                    <div className="grid-container">
                        <Header/>
                        <main>
                            <Switch>
                                <Route exact path="/" component={Home}></Route>
                                <Route exact path="/login" component={Login}></Route>
                                <Route exact path="/register" component={Signup}></Route>
                                <Route exact path="/profile" component={() => <Profile props={{name: "Kira"}}/>}/>
                                <Route exact path="/messages" component={Messages}/>
                                <Route path="/messages/:room" component={MessageRoom}/>
                                <Route component={PageNotFound}/>
                            </Switch>
                        </main>
                        <Footer/>
                    </div>
            </AuthProvider>
        </Router>
    );
}

export default App;