import React from 'react';
import logo from '../logo.svg';

export default function LoadingIndicator() {
    return (
        <div className="loading-indicator">
            <img src={logo} className="app-logo" alt="loading indicator"/>
        </div>
    );
}