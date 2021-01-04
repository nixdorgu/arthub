import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import Facade from "../../utils/Facade";
import NoMessages from "../states/NoMessages";
import MessageCard from "./MessageCard";
import UserFlow from "../../utils/UserFlow";
import Error500 from "../states/Error500";

export default function Messages() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const {user} = useAuth();

  const getRooms = useCallback(() => {
    new Facade().get(
      `/api/messages/${user.id}`,
      (response) => {
        const isEmpty = response.length === 0;

        setRooms(response);
        setError(isEmpty);
        setEmpty(isEmpty);
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
  }, [getRooms, user]); // having rooms here makes it render exponentially

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
