import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Header from './components/Header';
import Home from './components/home/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext';
import PageNotFound from './components/states/PageNotFound';
import Messages from './components/messages/Messages';
import MessageRoom from './components/messages/MessageRoom';
import Transactions from './components/transactions/Transactions';
import ProtectedRoute from './components/ProtectedRoute';
import UnprotectedRoute from './components/UnprotectedRoute';
import Auth from './components/auth/Auth';

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
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
                </div>
            </Router>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;