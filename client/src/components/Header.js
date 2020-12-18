import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import { logout } from "../utils/Tokens";

function Header() {
  const ctx = useAuth();
  const hamburgerRef = useRef();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  function showLinks() {
    const navlinks = document.querySelector('.hide-mobile');
    navlinks.classList.toggle('show', !hamburgerOpen);

    const children = navlinks.firstChild.childNodes;
    children.forEach(child => child.classList.toggle('active'))
  }

  // add artists specific navlinks [transactions?]
  return (
    <header className="row">
      <div onClick={() => {
        if (hamburgerOpen) {
          showLinks();
          setHamburgerOpen(false);
        }
            
          }}>
        <Link to="/" className="logo">
          arthub
        </Link>
      </div>

      <div className="hide-mobile">
        {!ctx.authenticated ? (
          <div>
            <Link to="/register">Signup</Link>
            <Link to="/login">Login</Link>
          </div>
        ) : (
          <div onClick={() => {
            showLinks();
            setHamburgerOpen(false);
          }}>
            <Link to="/profile">Profile</Link>
            <Link to="/messages">Messages</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="#" onClick={() => {logout(ctx)}}>Logout</Link>
          </div>
        )}
      </div>
      <div className="hamburger show-mobile" ref={hamburgerRef}>
        {hamburgerOpen ? (
          <FontAwesomeIcon
            icon={faTimes}
            onClick={(e) => {
              showLinks()
              setHamburgerOpen(!hamburgerOpen)}
            }
          />
        ) : (
          <FontAwesomeIcon
            icon={faBars}
            onClick={(e) => {
              showLinks()
              setHamburgerOpen(!hamburgerOpen)}
            }
          />
        )}
      </div>
    </header>
  );
}

export default Header;
