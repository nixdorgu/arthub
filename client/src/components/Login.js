import React, { useState } from "react";
import { setUserSession } from "../utils/Tokens";

function Login(props) {
  
  const handleLogin = (e) => {
  };

  return (
    <div className="form">
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
