import React from "react";

export default function Message({props}) {
  const { user_id, sender_id, content, timestamp } = props;

  return (
    <div className={sender_id === user_id ? "right message" : "left message"}>
      <div className="message-proper">
        <div className="message-content">{content}</div>
      </div>
      <p className="message-timestamp">{timestamp.toString()}</p>
    </div>
  );
}
