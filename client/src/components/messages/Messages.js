import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import Facade from "../../utils/Facade";
import NoMessages from "../states/NoMessages";
import LoadingIndicator from "../LoadingIndicator";
import MessageCard from "./MessageCard";

export default function Messages() {
  let timeout;
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const {user} = useAuth();

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

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user.hasOwnProperty('id')) {
      getRooms();
    }
    return () => clearTimeout(timeout);
  }, [getRooms, timeout, user]); // having rooms here makes it render exponentially

  return (
    <div className="messages">
      {loading ? <LoadingIndicator /> : null}
      {rooms.length > 0 && !error ? (
        rooms.map((data, index) => (
          <MessageCard key={index} props={{ data, index, user }} />
        ))
      ) : error ? (
        <div>Something went wrong!</div>
      ) : (
        <NoMessages />
      )}
    </div>
  );
}
