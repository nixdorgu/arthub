import React from "react";
import State from "./State";
import clumsy from "../../images/clumsy.svg";

export default function Error500() {
  return (
    <State
      style={{ height: "calc(100vh - 5rem)" }}
      caption="Oops Page Not Found!"
      image={clumsy}
      subtitle={`"Unfortunately we can't find the page you've requested. This could be
      because its been moved, taken down or entered incorrectly."`}
    />
  );
}
