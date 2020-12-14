import React, { useState, useContext } from "react";
import { Redirect, Link} from "react-router-dom";
import {AuthContext} from '../context/AuthContext'
import Facade from '../utils/Facade'

function Signup() {
  const ctx = useContext(AuthContext);
  const [artist, setArtist] = useState(false);
  const [registered, setRegistered] = useState(false);

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

    new Facade().post('/api/register', data, (success) => {
      setRegistered(true);
    },
    (error) => {
      // 409 - email in use
      // else something went wrong - snackbar/modal
      alert(error.message)
    });
  };

  const signupWithFacebook = (e) => {
    console.log(e.target)
    window.location.href = "http://localhost:5000/auth/facebook"
  };
  
  // TODO: refine regex patterns and add error message + custom styling
  // TODO: email already in use error

  return (
    <div className="form">
      {registered ? <Redirect to="/login"/> : null}
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
        </div>
      </form>
      <div className="row center user-type-selection-btn-group authentication">
              <button type="submit" id="facebook" onClick={(e) => signupWithFacebook(e)}><span>Continue with <i className="fa fa-facebook"/></span></button>
              <button type="submit" id="twitter"><span>Continue with <i className="fa fa-google"/></span></button>
          </div>
    </div>
  );
}

export default Signup;