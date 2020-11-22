import React, { useContext } from "react";
import { Redirect, Link} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Facade from "../utils/Facade";
import { setUserSession } from "../utils/Tokens";

function Login() {
  const ctx = useContext(AuthContext);
  const handleLogin = (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const data = { email, password };

    new Facade().post('/api/login', data, (success) => {
      ctx.setAuthenticated(true);
      setUserSession(success.token);
    }, (error) => {
      alert(error.message)
      // snackbar of response.message
    });
  };

  return (
    <div className="form">
        {ctx.authenticated ? <Redirect to="/"/> : null}
      <form method="POST" className="login-form" onSubmit={handleLogin}>
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
            <button type="submit" id="facebook">
              <span>
                Login with <i className="fa fa-facebook" />
              </span>
            </button>
            <button type="submit" id="twitter">
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
