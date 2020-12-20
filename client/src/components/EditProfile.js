import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Facade from "../utils/Facade";

export default function EditProfile() {
  const { user } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [genres, setGenres] = useState([]);
  
  const ACCEPT = "image/jpeg, image/png";

  // fetch profile image url
  const initialData = {
    firstName: user.first_name,
    lastName: user.last_name,
  };

  function preview(e) {
    e.preventDefault();
    const profile = document.querySelector("#profile");
    profile.src = URL.createObjectURL(e.target.files[0]);
  }

  function hasChanges(e, handler) {
    const options = {
      firstName: firstName,
      lastName: lastName,
    };

    handler(e.target.value);
    const hasChanged = initialData[e.target.id] !== options[e.target.id];
    setIsDisabled(hasChanged);
  }

  useEffect(() => {
    if (user.hasOwnProperty("id")) {
      setFirstName(user.first_name);
      setLastName(user.last_name);

      new Facade().get(
        "/api/focus",
        (success) => {
          setGenres(success);
        },
        (error) => {
          console.log(error);
          setGenres(["None"]);
        }
      );
    }
  }, [user]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("hi");
        }}
      >
        <div className="initial-photo">
          <img
            id="profile"
            src="#"
            alt="profile"
            style={{ maxWidth: "50vw" }}
          />
        </div>
        <div>
          <input
            type="file"
            name="filename"
            accept={ACCEPT}
            onChange={(e) => preview(e)}
          />
        </div>
        <div className="form-element">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => hasChanges(e, setFirstName)}
            id="firstName"
            name="firstName"
          />
        </div>
        <div className="form-element">
          <label htmlFor="lastName">Last Name</label>

          {/* <input
            type="text"
            value={lastName}
            onChange={(e) => hasChanges(e, setLastName)}
            id="lastName"
            name="lastName" */}
          {/* /> */}
        </div>
        {/* <TextField
          error={true}
          id="outlined-error-helper-text"
          label="Error"
          defaultValue="Hello World"
          helperText="Incorrect entry."
          variant="outlined"
        /> */}
        <div>
          <TextField
            variant="outlined"
            label="First Name"
            placeholder={firstName}
            value={firstName}
            onChange={(e) => hasChanges(e, setFirstName)}
          />

          <TextField
            variant="outlined"
            label="Last Name"
            placeholder={lastName}
            value={lastName}
            onChange={(e) => hasChanges(e, setLastName)}
          />
        </div>

        {user.user_classification === "artist" ? (
          <div>
            <Autocomplete
              multiple
              limitTags={3}
              id="multiple-limit-tags"
              options={genres}
              getOptionLabel={(option) => option.focus_description}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Focus"
                  placeholder="Select artist focus"
                />
              )}
            />
          </div>
        ) : (
          <div></div>
        )}
        <button disabled={isDisabled}>Save Changes</button>
      </form>
    </div>
  );
}
