import React from "react";
import plant from "../../images/plant.svg";
import State from "./State";

export default function NoTransactions() {
  return (
    <State style={{height: "calc(100vh - 5rem)"}} caption="No Transactions" image={plant} subtitle="Art will nurture your soul just as music does."/>
  );
}
