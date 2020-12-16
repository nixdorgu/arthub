import React, { useState, useRef } from "react";
import { Redirect, Link } from "react-router-dom";
import Facade from '../utils/Facade'
import SocialLogin from "../utils/SocialLogin";

function Signup() {
  const errorRef = useRef();
  const [artist, setArtist] = useState(null);
  const [registered, setRegistered] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const OPTIONS = ['firstName', 'lastName', 'email', 'password', 'artist'];
  const NAME_REGEX = /([a-zA-Z])+\s*/;
  const EMAIL_REGEX = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9-.]+\.[a-zA-Z]{2,4})/;
  const MIN_LENGTH = 8, MAX_LENGTH = 15;
  
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
      errorRef.current.innerHTML = error.message;
    });
  };


  const validate = (targetId) => {
    let message = '';

    if (targetId === 'artist') {
      message = typeof artist !== 'boolean' ? 'Must select type of account' : '';
    } else {
      const target = document.querySelector(`#${targetId}`);
      const id = target.id;
      const value = target.value;

      if (OPTIONS.indexOf(id) < 2) {
        message = !NAME_REGEX.test(value) ?'Name must contain only letters and spaces.': '';
      } else if (OPTIONS.indexOf(id) === 2) {
        message = !EMAIL_REGEX.test(value) ? 'Email must be a valid email.' : '';
      } else if (OPTIONS.indexOf(id) === 3) {
        message = (value.length < MIN_LENGTH || value.length > MAX_LENGTH) ? 'Password must be between 8 and 15 characters.' : '';
      }
    }
    
    errorRef.current.innerHTML = message;
    return message === '';
  }

  const validateAll = (e) => {
    e.preventDefault();
    const validator = OPTIONS.map(option => validate(option));
    validator.every(message => message === true) ? console.log('solid') : console.log(validator.findIndex(item => item === false))
  }


  const handleSocialLogin = (e, site) => window.location.href = SocialLogin(site);

  const handleOnChange = (e, handler) => {
    handler(e.target.value);
    validate(e.target.id);
  }
  
  return (
    <div className="form">
      {registered ? <Redirect to="/login"/> : null}
      <form className="signup-form" onSubmit={(e) => validateAll(e)}>
        <div className="form-element" ref={errorRef} style={{color: "red", fontSize: ".5rem"}}></div>
        <div className="form-element">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" value={firstName} onChange={(e) => handleOnChange(e, setFirstName)} />
        </div>
        <div className="form-element">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" value={lastName} onChange={(e) => handleOnChange(e, setLastName)} />
        </div>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={(e) => handleOnChange(e, setEmail)} />
        </div>
        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => handleOnChange(e, setPassword)}
          />
        </div>
        <div  className="user-type-selection">
          <p className="user-selection-prompt">I want to: </p>
          <div className="row user-type-selection-btn-group">
              <button id="hire" onClick={selectUserType}>Hire</button>
              <button id="work" onClick={selectUserType}>Work</button>
          </div>
          <Link to="/login" className="form-link">Already have an account?</Link>
          <button id="signup" type="submit">
          Create an Account
        </button>
        </div>
      </form>
      <div className="row center user-type-selection-btn-group authentication">
              <button type="submit" id="facebook" onClick={(e) => handleSocialLogin(e, 'facebook')}><span>Continue with <i className="fa fa-facebook"/></span></button>
              <button type="submit" id="google" onClick={(e) => handleSocialLogin(e, 'google')}><span>Continue with <i className="fa fa-google"/></span></button>
          </div>
    </div>
  );
}

export default Signup;