import React from 'react'
import {Link} from 'react-router-dom';
import showRecipient from "../../tests/showRecipient";

export default function MessageCard(props) {
    const {data, index, user} = props.props;
    return (
        <Link
              to={`/messages/${data.room_id}`}
              key={index}
              className="room-link"
            >
              <div
                className="room"
                key={index}
                style={{ width: "100%", background: "#ccc" }}
              >
                <p className="room-recipient">{showRecipient(data, user.id)}</p>
                <div className="room-content">
                  <p className="room-message">{data.last_message}</p>
                  <p className="room-timestamp">
                    {new Date(data.sent_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
    )
}
