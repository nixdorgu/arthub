import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="row">
      <div>
        <Link to="/" className="logo">arthub</Link>
      </div>
      <div>
        <Link to="/artists">Artists</Link>
        <Link to="/login">Login</Link>
      </div>
    </header>
  );
}

export default Header;
