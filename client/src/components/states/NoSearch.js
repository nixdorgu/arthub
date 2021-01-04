import React from "react";
import State from "./State";
import clumsy from "../../images/clumsy.svg";

export default function NoSearch() {
  return (
    <State
      style={{ padding: "2rem" }}
      caption="No Artists Found"
      image={clumsy}
      subtitle={`"We couldn't find artists, want to try a different keyword?"`}
    />
  );
}
