import React from 'react'
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({component: Component, path, ...rest}) {
    const auth = useAuth();

    return (
        <Route path={path} {...rest} render={props => {
            return auth.authenticated ? (<Component {...props}/>) : (<Redirect to="/login"/>)
        }}/>
    );
}
