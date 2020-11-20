import React, { useState } from "react";
import { setUserSession } from "../utils/Tokens";

function Login() {

  const handleLogin = (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const data = { email, password };
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const response = JSON.parse(xhr.responseText);

        // alert(xhr.responseText)
        if (xhr.status === 200) {
          setUserSession(response.token);
          // Navigate to home page
        } else if (xhr.status === 401) {
          // Incorrect credentials [snackbar]
        } else {
          // Something went wrong [snackbar]
        }
      }
    };

    xhr.open("POST", "/api/login");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
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
