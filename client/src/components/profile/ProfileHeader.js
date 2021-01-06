import React from "react";
import formatAsDate from "../../tests/formatAsDate";
import showFullName from "../../tests/showFullName";
import ProfileInteractions from "./ProfileInteractions";

export default function ProfileHeader({
  isMe,
  user,
  setShowHireModal,
  profileData,
  src,
  setShowSnackbar,
  setSnackbarMessage,
}) {

  const locale = navigator.language;

  return (
    <div className="profile-header">
      <div className="image" style={{ marginRight: "3vw" }}>
        <img className="profile-header-image" src={src}  alt="profile" />
      </div>
      <div
        className="bio"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "100%",
          width: "100%",
        }}
      >
        <p style={{fontSize: '1.7vh'}}>{showFullName(profileData)}</p>
        <i
          style={{ padding: ".5rem 0", fontSize: "1.5vh" }}
        >{formatAsDate(profileData, locale)}</i>
        <ProfileInteractions
          props={{ isMe, user, setShowHireModal, setShowSnackbar,
            setSnackbarMessage, profileData }}
        />
      </div>
    </div>
  );
}
