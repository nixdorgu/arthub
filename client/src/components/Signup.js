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

  const styles = {
    backgroundColor: "#fff",
    // border: "none",
    cursor: "pointer",
    display: "inline-block",
    padding: "1.25vh 5vw",
    outline: "none",
  };

  const signup = () => {};

  // TODO: refine regex patterns and add error message + custom styling
  return (
    <div className="form">
      <div className="signup-form" style={{width: "60%", maxWidth: "500px"}}>
        <div className="form-element">
          <label>First Name</label>
          <input type="text" id="firstName" pattern="^\D+\s*" required />
        </div>
        <div className="form-element">
          <label>Last Name</label>
          <input type="text" id="lastName" pattern="^\D+\s*" required />
        </div>
        <div className="form-element">
          <label>Email</label>
          <input type="email" id="email" required />
        </div>
        <div className="form-element">
          <label>Password</label>
          <input
            type="password"
            id="password"
            minLength="8"
            maxLength="15"
            placeholder="Create a password"
            required
          />
        </div>
      </div>
      <div  className="user-type-selection" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "60%", maxWidth: "500px", paddingBottom: ".5rem"}}>
        <p style={{ textAlign: "center" }}>I want to: </p>
        <div className="row user-type-selection-btn-group">
            <button id="hire" onClick={selectUserType}>Hire</button>
            <button id="work" onClick={selectUserType}>Work</button>
        </div>
      </div>
        <button style={styles} onClick={signup}>
          Create an Account
        </button>
    </div>
  );
}

export default Signup;