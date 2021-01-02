import React from 'react'
import petting from "../../images/petting.svg";

export default function Error500() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: "100%",
        padding: "2rem"
      }}
    >
        <div>
        <h1 style={{textAlign: "center"}}>Something Went Wrong</h1>
        </div>
      <img
        src={petting}
        alt="Serenity"
        style={{
          width: "100%",
          display: "block",
          maxHeight: "50vh",
          margin: "2rem 0",
        }}
      />
      <i style={{ textAlign: "center" }}>
        "It's not you - it's us, try again in a little bit?"
      </i>
    </div>
  );
}
