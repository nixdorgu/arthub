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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [biography, setBiography] = useState("");

  const [profileData, setProfileData] = useState({});
  const [src, setSrc] = useState('#');
  const [file, setFile] = useState();
  const [fileObject, setFileObject] = useState({});

  const [isDisabled, setIsDisabled] = useState(true);
  const [genres, setGenres] = useState([]);

  const ACCEPT = "image/jpeg, image/png";

  // fetch profile image url
  const initialData = {
    firstName: user.first_name,
    lastName: user.last_name,
    focus: [genres[0]] // dummy data
  };

//   function readFile(file) {
//     if (typeof file === 'undefined') return {};

//     const fileReader = new FileReader();
//     fileReader.readAsArrayBuffer(file);

//     // error here
//     fileReader.onprogress = () => {

//     }
//     fileReader.onerror = () =>  {};

//     fileReader.onload = () => {
//         const MAX_FILE_SIZE = 1000000;
//         const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
//         const result = fileReader.result;
//         const buffer = Buffer.from(result, 'utf8');
        
//         if (ALLOWED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE) {
//           // return { mimetype: file.type, buffer }
//           setFileObject({mimetype: file.type, buffer});
//         }
//     }

//     return fileReader;
// }
  function handleSubmit(e) {
    e.preventDefault();

    // ON IMAGE DISPLAY
            //         console.log(buffer.toString('base64'))
        //   setSrc(`data:image/png;base64,${buffer.toString('base64')}`)
   
    // const buffer = readFile(file);
    // console.log(fileObject)

    const data = {file: fileObject, firstName, lastName, biography, genres}

    // console.log(buffer)
    // console.log(file)
      new Facade().post('/api/profile/edit', data, (success) => {
          console.log(success)
        // alert(success.message)
      }, (error) => {
          console.log(error)
        // alert(error.message)
      })
  }

  function preview(e) {
    e.preventDefault();
    photoRef.current.style.display = "block";
    setFile(e.target.files[0]);

    // readFile(e.target.files[0]);

    setSrc(URL.createObjectURL(e.target.files[0]));
  }

  // function handleDisable() {
  //   //   due to issues with asynchronous useState
  //   const currentFirstName = document.querySelector(`#firstName`).value;
  //   const currentLastName = document.querySelector(`#lastName`).value;

  //   const noChangeFirstName = initialData.firstName.trim() === currentFirstName.trim();
  //   const noChangeLastName = initialData.lastName.trim() === currentLastName.trim();

  //   if(currentLastName.trim() === '' || currentFirstName.trim() === '') {
  //     setIsDisabled(true);
  //   } else if (!noChangeFirstName || !noChangeLastName || src !=='#') {
  //     setIsDisabled(false);
  //   } else {
  //       setIsDisabled(true);
  //   }
  // }

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

    // handleDisable();
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

      if (profileData.user_classification === "artist") {
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
      ) : <form encType="multipart/form" onSubmit={handleSubmit}
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
            <p style={{fontWeight: 500 }}>
            Provide a Profile Image link:

            </p>
          <div className="initial-photo" style={{flex: "2"}}>
            <img
              ref={photoRef}
              id="profile"
              src={src}
              alt="profile"
              style={{maxWidth: "50vw", maxHeight: "25vh", 
              // display: "none"
            }}
            />
          </div>
            <input
              type="text"
              id="avatar"
              name="avatar"
              accept={ACCEPT}
              value={src}
              onChange={(e) => {
                checkImageValidity()
                  preview(e)
                  // handleDisable()
              }}
              style={{fontFamily: "Montserrat, sans-serif"}}
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

        <button type="submit">Save Changes</button>
      </form>}
    </div>
  );
}
