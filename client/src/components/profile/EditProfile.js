import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {fetch} from "../../utils/fetch";
import UserFlow from "../../utils/UserFlow";
import EditProfileTextField from "./EditProfileTextField";

export default function EditProfile() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [firstNameError, setFirstNameError] = useState(false);
  const [firstNameHelperText, setFirstNameHelperText] = useState('');
  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameHelperText, setLastNameHelperText] = useState('');
  const [biographyError, setBiographyError] = useState(false);
  const [biographyHelperText, setBiographyHelperText] = useState('');

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [biography, setBiography] = useState("");
  const [focus, setFocus] = useState([]);

  const [profileData, setProfileData] = useState({});
  const [src, setSrc] = useState('#');
  const [genres, setGenres] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const file = document.querySelector('#img').files[0];
    const ACCEPTABLE_FILES = ['image/jpeg', 'image/png'];
    const MAX_SIZE = 1024 * 1024 * 3;

    const data = {link: src, firstName, lastName, biography, focus}

    if (typeof file === 'undefined' ||  !ACCEPTABLE_FILES.includes(file.type) || file.size > MAX_SIZE) {
      if (!firstNameError && !lastNameError && !biographyError) {
        fetch('/api/profile/edit', {
          method: 'POST',
          data: data,
          success: (data) => {
            console.log(data)
            setError(false);
          },
          error: (error) => {
            console.log(error)
            setError(true);
          }
        });

      }
    } else {
      const readFile = new FileReader();
      readFile.readAsArrayBuffer(file);
      readFile.onerror = () => {};
      readFile.onload = (event) => {
        const result = {result: {type: file.type, buffer: Buffer.from(event.target.result)}};

        fetch('/api/profile/edit', {
          method: 'POST',
          image: result,
          data: data,
          success: (data) => {
            setError(false);
            console.log(data)
          },
          error: (error) => {
            console.log(error)
            setError(true);
          }
        });

      }
    }

    setLoading(false);
  }

  function preview(e) {
    e.preventDefault();

    if (src !== profileData.source) {
      URL.revokeObjectURL(src)
    }

    const blob = URL.createObjectURL(e.target.files[0])
    setSrc(blob);
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
        biography: {
          label: 'Biography',
          error: setBiographyError,
          helperText: setBiographyHelperText
        }
    };

    if (e.target.value.trim() === '') {
      references[e.target.id].error(true);
      references[e.target.id].helperText(`${references[e.target.id].label} must not be empty`);
    } else if (e.target.id === 'biography' && e.target.value.length > 80) {
      references[e.target.id].error(true);
      references[e.target.id].helperText(`${references[e.target.id].label} must not exceed 80 characters.`);
    } else {
        references[e.target.id].error(false);
        references[e.target.id].helperText('');
    }

  }

  useEffect(() => {
    setLoading(true);

    if (user.hasOwnProperty("id")) {
      fetch(`/api/profile/${user.id}`, {
        method: "GET",
        success: (data) => {
          setProfileData(data);
          console.log(data)
        },
        error: (error) => {
          console.log(error)
          setError(true);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);

    if (profileData.hasOwnProperty("user_id")) {
      setFirstName(profileData.first_name);
      setLastName(profileData.last_name);
      setSrc(profileData.source);
      setBiography(profileData.biography || "");

      if (profileData.user_classification === "artist") {
        fetch(`/api/artists/${profileData.user_id}/focus`, {
          method: "GET",
          success: (data) => {
            setFocus(data);
          },
          error: (error) => {
            // console.log(error)
            setError(true);
          }
        });

        fetch("/api/focus", {
          method: "GET",
          success: (data) => {
            setGenres(data);
            setLoading(false);
          },
          error: (error) => {
            // console.log(error)
            setError(true);
            // setGenres(["None"]);
          }
        });
      }
      
      setLoading(false);
    }

    return () => {
      setLoading(false);
    }
  }, [profileData]);

  return (
    <UserFlow
      isLoading={loading}
      isError={error}
      success={
        <form onSubmit={handleSubmit}>
          <div className="profile-container">
            <p className="text-500">Provide a Profile Image link:</p>
            <div className="initial-photo flex-2">
              <img
                className="profile-image"
                id="profile"
                src={src}
                alt="profile"
                onError={() => setSrc(profileData.source)}
              />
            </div>
            <input
              type="file"
              id="img"
              className="profile-image-input"
              name="img"
              accept="image/jpeg, image/png"
              onChange={(e) => preview(e)}
            />
            <EditProfileTextField id="firstName" label="First Name" error={firstNameError} helperText={firstNameHelperText} value={firstName} onChange={(e) => {
              setFirstName(e.target.value);
              hasChanges(e)
            }} />
            <EditProfileTextField id="lastName" label="Last Name" error={lastNameError} helperText={lastNameHelperText} value={lastName} onChange={(e) => {
              setLastName(e.target.value);
              hasChanges(e)
            }} />
            {user.user_classification === "artist" ? (
              <>
                <EditProfileTextField id="biography" label="Biography" error={biographyError} helperText={biographyHelperText} value={biography}
                onChange={(e) => {
                  setBiography(e.target.value);
                  hasChanges(e)
                }} />

                <Autocomplete
                  multiple
                  style={{width: "90%", marginTop: "1.4rem"}}
                  limitTags={3}
                  id="multiple-limit-tags"
                  options={genres}
                  value={focus}
                  onChange={(e, value, reason) => {
                    if (['select-option', 'remove-option'].includes(reason)) {
                      setFocus(value);
                    }
                  }}
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
              </>
            ) : null}
            <button className="send" type="submit">Save Changes</button>
          </div>
        </form>
      }
    />
  );
}
