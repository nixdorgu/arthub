import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import Facade, {fetch} from "../../utils/Facade";
import UserFlow from "../../utils/UserFlow";
import SimpleSnackbar from "../Snackbar";
import Snackbar from '../Snackbar';

export default function EditProfile() {
  const { user } = useAuth();
  const photoRef = useRef();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [firstNameError, setFirstNameError] = useState(false);
  const [firstNameHelperText, setFirstNameHelperText] = useState('');
  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameHelperText, setLastNameHelperText] = useState('');
  const [biographyError, setBiographyError] = useState(false);
  const [biographyHelperText, setBiographyHelperText] = useState('');

  const [link, setLink] = useState('');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [biography, setBiography] = useState("");
  const [focus, setFocus] = useState([]);

  const [profileData, setProfileData] = useState({});
  const [src, setSrc] = useState('#');

  const [file, setFile] = useState('');
  const [genres, setGenres] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    const file = document.querySelector('#img').files[0];
    const ACCEPTABLE_FILES = ['image/jpeg', 'image/png'];
    const MAX_SIZE = 1024 * 1024 * 3;

    const data = {link: src, firstName, lastName, biography, focus}


    if (!firstNameError && !lastNameError && !biographyError) {
      fetch('/api/profile/edit', {
        method: 'POST',
        data: data,
        success: (data) => {
          console.log(data)
        },
        error: (error) => {
          console.log(error)
        }
      });
    }
  }

  function preview(e, input) {
    e.preventDefault();
    setSrc(input);
  }

  function checkImageValidity(e, input) {
    let url = input.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g);

    if (url !== null) {
      preview(e, input);
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
      setLink(profileData.source);

      if (profileData.user_classification === "artist") {
        // new Facade().get(
        //   "/api/artists/artist/focus",
        //   (success) => {
        //     setFocus(success);
        //   },
        //   (error) => {
        //     console.log(error);
        //   }
        // );

        fetch("/api/artists/artist/focus", {
          method: "GET",
          success: (data) => {
            setFocus(data);
          },
          error: (error) => {
            // console.log(error)
            // setError(true);
          }
        });

        // new Facade().get(
        //     "/api/focus",
        //     (success) => {
        //       setGenres(success);
        //       setLoading(false);
        //     },
        //     (error) => {
        //       console.log(error);
        //       setGenres(["None"]);
        //     }
        // );

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
        {/* <SimpleSnackbar/> */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            marginBottom: "2rem",
            width: "100vw"
          }}
        >
            <p style={{fontWeight: 500 }}>Provide a Profile Image link:</p>
          <div className="initial-photo" style={{flex: "2"}}>
            <img
              id="profile"
              src={src}
              alt="profile"
              onError={() => setSrc(profileData.source)}
              style={{ maxWidth: "50vw", maxHeight: "25vh" }}
            />
            <img
              ref={photoRef}
              id="profile"
              src={file}
              alt="profile"
              onError={() => setSrc(profileData.source)}
              style={{ maxWidth: "50vw", maxHeight: "25vh" }}
            />
          </div>
            <input
              type="text"
              id="link"
              name="link"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                checkImageValidity(e, e.target.value);
              }}
              style={{fontFamily: "Montserrat, sans-serif", width: "70%", alignSelf: "center"}}
            />
            <input
              type="file"
              id="img"
              name="img"
              style={{fontFamily: "Montserrat, sans-serif", width: "70%", alignSelf: "center"}}
            />
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
            }}
          />
          {user.user_classification === "artist" ? (
            <>
            <TextField
            id="biography"
            error={biographyError}
            helperText={biographyHelperText}
            variant="outlined"
            label="Biography"
            
            placeholder={biography}
            value={biography}
            style={{ flex: "1", marginBottom: "1rem" }}
            onChange={(e) => {
              setBiography(e.target.value);
              hasChanges(e)
            }}
          />

            <Autocomplete
              multiple
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
          ) : (
            <div></div>
          )}
        </div>

        <button type="submit">Save Changes</button>
      </form>
    }
    />
  );
}
