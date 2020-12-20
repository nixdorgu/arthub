import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Facade from "../utils/Facade";

export default function EditProfile() {
  const { user } = useAuth();
  const photoRef = useRef();

  const [firstNameError, setFirstNameError] = useState(false);
  const [firstNameHelperText, setFirstNameHelperText] = useState('');
  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameHelperText, setLastNameHelperText] = useState('');

  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [genres, setGenres] = useState([]);

  const ACCEPT = "image/jpeg, image/png";

  // fetch profile image url
  const initialData = {
    firstName: user.first_name,
    lastName: user.last_name,
    focus: [genres[0]] // dummy data
  };

  function preview(e) {
    e.preventDefault();
    photoRef.current.style.display = "block";
    photoRef.current.src = URL.createObjectURL(e.target.files[0]);
  }

  function handleDisable() {
    //   due to issues with asynchronous useState
    const currentFirstName = document.querySelector(`#firstName`).value;
    const currentLastName = document.querySelector(`#lastName`).value;

    const noChangeFirstName = initialData.firstName.trim() === currentFirstName.trim();
    const noChangeLastName = initialData.lastName.trim() === currentLastName.trim();

    if(currentLastName.trim() === '' || currentFirstName.trim() === '') {
      setIsDisabled(true);
    } else if (!noChangeFirstName || !noChangeLastName) {
      setIsDisabled(false);
    } else {
        setIsDisabled(true);
    }
  }

  function hasChanges(e) {
    const references = {
        firstName: {
            label: 'First name',
            error: setFirstNameError,
            helperText: setFirstNameHelperText
        },
        lastName: {
            label: 'Last name',
            error: setLastNameError,
            helperText: setLastNameHelperText
        },
    };


    if (e.target.value.trim() === '') {
        references[e.target.id].error(true);
        references[e.target.id].helperText(`${references[e.target.id].label} must not be empty`);
    } else {
        references[e.target.id].error(false);
        references[e.target.id].helperText('');
    }

    handleDisable();
  }

  useEffect(() => {
      setLoading(true);
    if (user.hasOwnProperty("id")) {
      setFirstName(user.first_name);
      setLastName(user.last_name);

      new Facade().get(
        "/api/focus",
        (success) => {
          setGenres(success);
          setLoading(false);
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
      {loading? (
          <div>Loading...</div>
      ) : <form
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            marginBottom: "1rem",
          }}
        >
          <TextField
            id="firstName"
            error={firstNameError}
            helperText={firstNameHelperText}
            variant="outlined"
            label="First Name"
            placeholder={firstName}
            value={firstName}
            style={{ flex: "1", marginBottom: "1rem" }}
            onChange={(e) => {
                setFirstName(e.target.value);
                hasChanges(e)
            }}
          />

          <TextField
            id="lastName"
            error={lastNameError}
            helperText={lastNameHelperText}
            variant="outlined"
            label="Last Name"
            placeholder={lastName}
            value={lastName}
            style={{ flex: "1", marginBottom: "1rem" }}
            onChange={(e) => {
                setLastName(e.target.value);
                hasChanges(e)
            }
            }
          />
          {user.user_classification === "artist" ? (
            <Autocomplete
              multiple
              limitTags={3}
              id="multiple-limit-tags"
              options={genres}
              defaultValue={initialData.focus.map(option => option)}
              getOptionLabel={(option) => option.focus_description}
              getOptionSelected={(option, value) => option.id === value.id}
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
      </form>}
    </div>
  );
}
