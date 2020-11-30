import React, {useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Facade from "../utils/Facade";
import {Link} from "react-router-dom";
import NoMessages from "./states/NoMessages";
import showRecipient from "../tests/showRecipient";

export default function Messages() {
  const [rooms, setRooms] = useState([]);
  const user = useContext(AuthContext).user;

  function getRooms(id) {
    return new Facade().get(`/api/messages/${id}`,
    (response) => {
      setRooms(response);
      setTimeout(() => getRooms(id), 3000);
    }, (error) => {
        // show error page
        console.log(error)
    })
  }
  useEffect(() => {
    // add loading indicator
    const id = user.id;
    getRooms(id);

    return () => setRooms([])
  }, [user]); // having rooms here makes it render exponentially

  return (
    <div className="messages">
      {
        rooms.length > 0 ? (
          rooms.map((data, index) => (
            <Link to={`/messages/${data.room_id}`} key={index} className="room-link">
              {/* MessageRoom */}
              <div className="room" key={index} style={{width: "100%",background: "#ccc"}}>
                <p className="room-recipient">{showRecipient(data, user.id)}</p>
                <div className="room-content">
                  <p className="room-message">{data.last_message}</p>
                  <p className="room-timestamp">{new Date(data.sent_at).toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (<NoMessages/>)
      }
    </div>
  );
}
