import React from "react";

function Header() {
  return (
    <header className="row">
      <div>
        <a href="/" className="logo">
          arthub
        </a>
      </div>
      <div>
        <a href="#">Artists</a>
        <a href="#">Login</a>
      </div>
    </header>
  );
}

export default Header;
