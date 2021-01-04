import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import Facade from "../../utils/Facade";
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

  const [link, setLink] = useState('');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [biography, setBiography] = useState("");
  const [focus, setFocus] = useState([]);

  const [profileData, setProfileData] = useState({});
  const [src, setSrc] = useState('#');

  const [genres, setGenres] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    const data = {link, firstName, lastName, biography, genres}

    new Facade().post('/api/profile/edit', data, (success) => {
        console.log(success)
      // alert(success.message)
    }, (error) => {
        console.log(error)
      // alert(error.message)
    })
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
    };


    if (e.target.value.trim() === '') {
        references[e.target.id].error(true);
        references[e.target.id].helperText(`${references[e.target.id].label} must not be empty`);
    } else {
        references[e.target.id].error(false);
        references[e.target.id].helperText('');
    }

  }

  useEffect(() => {
    setLoading(true);

    if (user.hasOwnProperty("id")) {
      new Facade().get(`/api/profile/${user.id}`, (success) => {
        setProfileData(() => success);
      }, (error) => {
          console.log(error)
          setError(true);
        // alert(error.message)
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
        new Facade().get(
          "/api/artists/focus",
          (success) => {
            setFocus(success);
          },
          (error) => {
            console.log(error);
          }
        );

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
      } else {
        setLoading(false);
      }
    }

    return () => {
      setLoading(false);
    }
  }, [profileData]);

  return (
    <div>
      {loading? (
          <div>Loading...</div>
      ) : <form onSubmit={handleSubmit}
      >
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
              ref={photoRef}
              id="profile"
              src={src}
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
              defaultValue={focus.map(option => option)}
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

        <button type="submit">Save Changes</button>
      </form>}
    </div>
  );
}
