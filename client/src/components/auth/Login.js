import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetch } from "../../utils/Facade";
import { setToken } from "../../utils/Tokens";
import SocialMediaButton from "./SocialMediaButton";

function Login() {
  const ctx = useAuth();
  const errorRef = useRef();
  
  const handleLogin = (e) => {
    e.preventDefault();
    errorRef.current.innerHTML = '';

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const data = { email, password };

    fetch('/auth/login', {
      method: "POST",
      data,
      success: (data) => {
        setToken(data.token);
        ctx.setAuthenticated(true);
      },
      error: (data) => {
        errorRef.current.innerHTML = data.message;

      }
    });
  };

  return (
    <div className="form">
      <form method="POST" className="login-form" onSubmit={handleLogin}>
        <div className="form-element" ref={errorRef} style={{color: "red"}}></div>
        <div className="form-element">
          <label>Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-element">
          <label>Password</label>
          <input type="password" id="password" name="password" required />
          <Link to="/register" className="form-link">Don't have an account?</Link>
        </div>
        <div className="user-type-selection">
          <button id="login" type="submit">Login</button>
          <div className="row center user-type-selection-btn-group authentication">
            <SocialMediaButton login={true} site={'facebook'}/>
            <SocialMediaButton login={true} site={'google'}/>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
