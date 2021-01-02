import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import Facade from "../../utils/Facade";
import NoMessages from "../states/NoMessages";
import MessageCard from "./MessageCard";
import UserFlow from "../../utils/UserFlow";
import Error500 from "../states/Error500";

export default function Messages() {
  let timeout;
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const {user} = useAuth();
  const socket = useSocket();

  const getRooms = useCallback(() => {
    new Facade().get(
      `/api/messages/${user.id}`,
      (response) => {
        const isEmpty = response.length === 0;

        setRooms(response);
        setError(isEmpty);
        setEmpty(isEmpty);
        // ADD ON_NEW_ROOM EVENT
        // CONSIDER USING USER_ID AS LISTENER ON NEW MESSAGE

        // rooms.map(room => {
        //   const id = room.room_id;
        //   return socket.emit('join', id);
        // })
      },
      (error) => {
        // show error page
        setEmpty(false);
        setError(true);
      }
    );

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user.hasOwnProperty('id')) {
      getRooms();
    }
    return () => clearTimeout(timeout);
  }, [getRooms, user, timeout]); // having rooms here makes it render exponentially

  return (
    <div className="messages">
      <UserFlow isLoading={loading} isError={error} error={
        empty ? <NoMessages/> : <Error500/>
      }
      success={
        <>
       {rooms.map((data, index) => (
          <MessageCard key={index} props={{ data, index, user }} />
        ))}
        </>
      }/>
    </div>
  );
}
