import React from 'react'
import clumsy from "../../images/clumsy.svg";

export default function NoSearch() {
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
          <h1 style={{textAlign: "center"}}>No Artists Found</h1>
          </div>
        <img
          src={clumsy}
          alt="Serenity"
          style={{
            width: "100%",
            display: "block",
            maxHeight: "50vh",
            margin: "2rem 0",
          }}
        />
        <i style={{ textAlign: "center" }}>
          "We couldn't find artists, want to try a different keyword?"
        </i>
      </div>
    )
}