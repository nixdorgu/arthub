import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({component: Component, path, ...rest}) {
    const auth = useContext(AuthContext);

    return (
        <Route path={path} {...rest} render={props => {
            return auth.authenticated ? (
                <Component {...props}/>
            ) : (
                <Redirect to="/login"/>
            )
        }}/>
    );
}
