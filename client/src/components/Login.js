import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Facade from "../utils/Facade";
import SocialLogin from "../utils/SocialLogin";
import { setToken } from "../utils/Tokens";

function Login() {
  const ctx = useAuth();
  const errorRef = useRef();
  
  const handleSocialLogin = (e, site) => {
    window.location.href = SocialLogin(site);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    errorRef.current.innerHTML = '';

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const data = { email, password };

    new Facade().post('/api/login', data, (success) => {
      setToken(success.token);
      ctx.setAuthenticated(true);
    }, (error) => {
      errorRef.current.innerHTML = error.message;
    });
  };

  return (
    <div className="form">
      <form method="POST" className="login-form" onSubmit={handleLogin}>
        <div className="form-element" ref={errorRef} style={{color: "red"}}>
        </div>
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
          <button id="login" type="submit">
            Login
          </button>
          <div className="row center user-type-selection-btn-group authentication">
            <button id="facebook" onClick={(e) => handleSocialLogin(e, 'facebook')}>
              <span>
                Login with <i className="fa fa-facebook" />
              </span>
            </button>
            <button id="google" onClick={(e) => handleSocialLogin(e, 'google')} >
              <span>
                Login with <i className="fa fa-google" />
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
