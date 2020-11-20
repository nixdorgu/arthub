import React, { useState } from "react";
import { Redirect, Link} from "react-router-dom";

function Signup() {
  const [artist, setArtist] = useState(false);

  const toggleButtonElement = (activeId, inactiveId) => {
    document.querySelector(`#${activeId}`).classList.add('active');
    document.querySelector(`#${inactiveId}`).classList.remove('active');
  }

  const toggleArtistState = (isArtist) => setArtist(isArtist);

  const selectUserType = (e) => {
    const options = ["hire", "work"];
    const isCustomer = e.target.id === options[0];

    if (isCustomer) {
      toggleButtonElement(options[0], options[1])
      toggleArtistState(false);
    } else {
      toggleButtonElement(options[1], options[0]);
      toggleArtistState(true);
    }
  }

  const signup = (e) => {
    e.preventDefault();

    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const isArtist = artist;

    const data = {firstName, lastName, email, password, isArtist}
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          alert(xhr.responseText)
          // Navigate to login
        } else if (xhr.status === 409) {
          // Email in use
        } else {
          // Something went wrong
        }
      }
    }

    xhr.open('POST', '/api/register');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data))
  };

  // TODO: refine regex patterns and add error message + custom styling
  // TODO: email already in use error

  return (
    <div className="form">
      <form method="POST" className="signup-form" onSubmit={signup}>
        <div className="form-element">
          <label>First Name</label>
          <input type="text" id="firstName" name="firstName" pattern="^\D+\s*" required />
        </div>
        <div className="form-element">
          <label>Last Name</label>
          <input type="text" id="lastName" name="lastName" pattern="^\D+\s*" required />
        </div>
        <div className="form-element">
          <label>Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-element">
          <label>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            minLength="8"
            maxLength="15"
            placeholder="Create a password"
            required
          />
        </div>
        <div  className="user-type-selection">
          <p className="user-selection-prompt">I want to: </p>
          <div className="row user-type-selection-btn-group">
              <button id="hire" className="active" onClick={selectUserType}>Hire</button>
              <button id="work" onClick={selectUserType}>Work</button>
          </div>
          <Link to="/login" className="form-link">Already have an account?</Link>
          <button id="signup" type="submit">
          Create an Account
        </button>
        <div className="row center user-type-selection-btn-group authentication">
              <button type="submit" id="facebook"><span>Continue with <i class="fa fa-facebook"/></span></button>
              <button type="submit" id="twitter"><span>Continue with <i class="fa fa-google"/></span></button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signup;