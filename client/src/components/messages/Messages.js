import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import Facade from "../../utils/Facade";
import { Link } from "react-router-dom";
import NoMessages from "../states/NoMessages";
import showRecipient from "../../tests/showRecipient";
import LoadingIndicator from "../LoadingIndicator";

export default function Messages() {
  let timeout;
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(false);
  const user = useContext(AuthContext).user;

  const getRooms = useCallback(() => {
    new Facade().get(
      `/api/messages/${user.id}`,
      (response) => {
        setError(false);
        setRooms(response);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        timeout = setTimeout(() => getRooms(user.id), 10000);
      },
      (error) => {
        // show error page
        setError(true);
        console.log(error);
      }
    );
  }, [user]);

  useEffect(() => {
    // add loading indicator
    getRooms();
    return () => clearTimeout(timeout);
  }, [getRooms, timeout]); // having rooms here makes it render exponentially

  return (
    <div className="messages">
      {
        rooms.length > 0 ? (
          rooms.map((data, index) => (
            <Link
              to={`/messages/${data.room_id}`}
              key={index}
              className="room-link"
            >
              {/* MessageRoom */}
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
          ))
        ) : error ? (
          <NoMessages />
        ) : (
          <LoadingIndicator />
        )
        // loading indicator if error i false else nomes
      }
    </div>
  );
}
