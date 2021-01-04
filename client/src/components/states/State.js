import React from "react";
import "./state.css";

export default function State({ style, image, caption, subtitle, h1Style }) {
  return (
    <div className="state" style={style}>
      <div>
        <h1 className="state-text" style={h1Style}>{caption}</h1>
      </div>
      <img className="state-image" alt="" src={image} />
      <i className="state-text">{subtitle}</i>
    </div>
  );
}
