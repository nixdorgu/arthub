import React from "react";
import State from "./State";
import laying from "../../images/laying.svg";

export default function NoMessages() {
  // height: "calc(100vh - 5rem)",

  return (
    <State
      style={{ height: "calc(100vh - 5rem)" }}
      caption="No messages yet"
      image={laying}
      subtitle={
        '"Let the conversation flow at its own pace. Don’t try to rush it or control it. You need to let go and be part of the conversation."'
      }
    />
  );
}
