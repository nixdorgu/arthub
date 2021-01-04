import React from "react";
import State from "./State";
import sitting from "../../images/sitting-reading.svg";

export default function NewConversation({ recipient }) {
  const h1Style = { textAlign: "left", color: "#FF5678", fontWeight: "300" };

  return (
    <State
      caption={`Start a conversation with ${recipient}`}
      h1Style={h1Style}
      image={sitting}
      subtitle="Art will nurture your soul just as music does."
    />
  );
}
