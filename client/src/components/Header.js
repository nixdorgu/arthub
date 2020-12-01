import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./header.css";

function Header() {
  const ctx = useContext(AuthContext);
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
      <div>
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
          <div>
            <Link to="/profile">Profile</Link>
            <Link to="/messages">Messages</Link>
            <Link to="/transactions">Trnasactions</Link>
          </div>
        )}
      </div>
      <div className="hamburger show-mobile">
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
