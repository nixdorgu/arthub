import React from "react";
import State from "./State";
import petting from "../../images/petting.svg";

export default function Error500() {
  return (
    <State
      style={{ padding: "2rem" }}
      caption="Something Went Wrong"
      image={petting}
      subtitle="It's not you - it's us, try again in a little bit?"
    />
  );
}
