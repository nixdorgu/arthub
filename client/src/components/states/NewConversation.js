import React from "react";

import sitting from "../../images/sitting-reading.svg";

export default function NewConversation({recipient}) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{textAlign: "left", color: "#FF5678", fontWeight: "300"}}>Start a conversation with {recipient}</h1>
      <img
        src={sitting}
        alt="Serenity"
        style={{ width: "100%", display: "block", maxHeight: "50vh", margin: "2rem 0" }}
      />
    </div>
  );
}
