import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Facade from "../utils/Facade";
import { setUserSession } from "../utils/Tokens";

function Login() {

  const [loggedIn, setLoggedIn] = useState(false); // replace upon implementation of redux
  const handleLogin = (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const data = { email, password };

    new Facade().post('/api/login', data, (success) => {
      setLoggedIn(true);
      setUserSession(success.token);
    }, (error) => {
      alert(error.message)
      // snackbar of response.message
    });
  };

  return (
    <div className="form">
        {loggedIn ? <Redirect to="/"/> : null}
      <form method="POST" className="login-form" onSubmit={handleLogin}>
        <div className="form-element">
          <label>Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-element">
          <label>Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className="user-type-selection">
          <button id="login" type="submit">
            Login
          </button>
          <div className="row center user-type-selection-btn-group authentication">
            <button type="submit" id="facebook">
              <span>
                Login with <i class="fa fa-facebook" />
              </span>
            </button>
            <button type="submit" id="twitter">
              <span>
                Login with <i class="fa fa-google" />
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
