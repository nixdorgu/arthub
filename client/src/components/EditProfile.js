import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Facade from "../utils/Facade";

export default function EditProfile() {
  const { user } = useAuth();
  const photoRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();

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
    photoRef.current.style.display = "block";
    photoRef.current.src = URL.createObjectURL(e.target.files[0]);
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
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <div className="initial-photo">
            <img
              ref={photoRef}
              id="profile"
              src="#"
              alt="profile"
              style={{ maxWidth: "50vw", maxHeight: "25vh", display: "none" }}
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
        </div>

        {/* <TextField
          error={true}
          id="outlined-error-helper-text"
          label="Error"
          defaultValue="Hello World"
          helperText="Incorrect entry."
          variant="outlined"
        /> */}
        <div style={{display: "flex",flexDirection: "column", justifyContent: "space-evenly", marginBottom: "1rem"}}>
          <TextField
          ref={firstNameRef}
            variant="outlined"
            label="First Name"
            placeholder={firstName}
            value={firstName}
            style={{flex: "1", marginBottom: "1rem"}}
            onChange={(e) => hasChanges(e, setFirstName)}
          />

          <TextField
          ref={lastNameRef}
            variant="outlined"
            label="Last Name"
            placeholder={lastName}
            value={lastName}
            style={{flex: "1", marginBottom: "1rem"}}
            onChange={(e) => hasChanges(e, setLastName)}
          />
           {user.user_classification === "artist" ? (
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
        ) : (
          <div></div>
        )}
        </div>

       
        <button disabled={isDisabled}>Save Changes</button>
      </form>
    </div>
  );
}
