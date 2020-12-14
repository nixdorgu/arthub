import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import { AuthProvider } from './context/AuthContext';
import PageNotFound from './components/PageNotFound';
import Messages from './components/messages/Messages';
import MessageRoom from './components/messages/MessageRoom';
import Transactions from './components/Transactions';
import ProtectedRoute from './components/ProtectedRoute';
import UnprotectedRoute from './components/UnprotectedRoute';
import Auth from './components/Auth';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="grid-container">
                    <Header/>
                        <main>
                            <Switch>
                                <ProtectedRoute exact path="/" component={Home}/>
                                <UnprotectedRoute exact path="/login" component={Login}/>
                                <UnprotectedRoute exact path="/register" component={Signup}/>
                                <Route path="/success/:token" component={Auth}/>
                                <ProtectedRoute exact path="/profile" component={Profile}/>
                                <ProtectedRoute exact path="/profile/:id" component={Profile}/>
                                <ProtectedRoute exact path="/edit/profile/" component={EditProfile}/>
                                <ProtectedRoute exact path="/messages" component={Messages}/>
                                <ProtectedRoute exact path="/transactions" component={Transactions}/>
                                <ProtectedRoute path="/messages/:room" component={MessageRoom}/>
                                <Route component={PageNotFound}/>
                            </Switch>
                        </main>
                    <Footer/>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;