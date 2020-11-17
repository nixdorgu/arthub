import React, { useState } from "react";
// import { Button, ButtonGroup } from "@material-ui/core";
// import { Button, ButtonGroup } from "@material-ui/lab";

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

  const signup = () => {
    const firstName = document.querySelector('#firstName');
    const lastName = document.querySelector('#lastName').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    console.log(firstName)
    console.log(firstName.value, lastName, email, password)
  };

  // TODO: refine regex patterns and add error message + custom styling
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