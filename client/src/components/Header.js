import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Header() {
  const ctx = useContext(AuthContext);
  // add artists specific navlinks [transactions?]
  return (
    <header className="row">
      <div>
        <Link to="/" className="logo">
          arthub
        </Link>
      </div>
      {!ctx.authenticated ? (
        <div>
          <Link to="/register">Signup</Link>
          <Link to="/login">Login</Link>
        </div>
      ) : (
        <div>
          <Link to="/artists">Profile</Link>
          <Link to="/login">Messages</Link>
          <Link to="/login">Random Link Here</Link>
        </div>
      )}
    </header>
  );
}

export default Header;
