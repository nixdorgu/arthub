import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function Message({props}) {
  const {user} = useAuth();
  const {sender_id, content, timestamp } = props;

  return (
    <div className={sender_id === user.id ? "right message" : "left message"}>
      <div className="message-proper">
        <div className="message-content">{content}</div>
      </div>
      <p className="message-timestamp">{new Date(timestamp).toLocaleString()}</p>
    </div>
  );
}
