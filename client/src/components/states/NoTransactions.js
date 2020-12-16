import React from "react";
import plant from "../../images/plant.svg";

export default function NoTransactions() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: "calc(100vh - 5rem"
      }}
    >
        <div>
        <h1 style={{textAlign: "center"}}>No Transactions</h1>
{/* <button className="button">Hi</button> */}
        </div>
      <img
        src={plant}
        alt="Serenity"
        style={{
          width: "100%",
          display: "block",
          maxHeight: "50vh",
          margin: "2rem 0",
        }}
      />
      <i style={{ textAlign: "center" }}>
        "Art will nurture your soul just as music does."
      </i>
    </div>
  );
}
