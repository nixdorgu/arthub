import React from "react";

import laying from "../../images/laying.svg";

export default function NoMessages() {
  return (
    <div
      style={{
        height: "calc(100vh - 5rem)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>No messages yet</h1>
      <img
        src={laying}
        alt="Serenity"
        style={{ width: "100%", display: "block", maxHeight: "50vh", margin: "2rem 0" }}
      />
      <i style={{textAlign: "center"}}>
        "Let the conversation flow at its own pace. Don’t try to rush it or
        control it. You need to let go and be part of the conversation."
      </i>
    </div>
  );
}
