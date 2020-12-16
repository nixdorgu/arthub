import React from "react";
import clumsy from "../images/clumsy.svg";

export default function PageNotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        height: "calc(100vh - 5rem)",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Oops Page Not Found!</h1>
      <img
        src={clumsy}
        alt="Error 404"
        style={{ width: "100%", display: "block", maxHeight: "50vh" }}
      />
      <i style={{ textAlign: "center" }}>
        Unfortunately we can't find the page you've requested. This could be
        because its been moved, taken down or entered incorrectly.
      </i>
    </div>
  );
}
