import React, {useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Facade from "../utils/Facade";
import MessageRoom from "./MessageRoom";
import {Link} from "react-router-dom";

export default function Messages() {
  const [rooms, setRooms] = useState([]);
  const user = useContext(AuthContext).user;

  useEffect(() => {
    // add loading indicator
    const id = user.id;
    new Facade().get(`/api/messages/${id}`, (response) => {
      setRooms(response);
  }, (error) => {
      // show error page
      console.log(error)
  })

    return () => setRooms([])
  }, [user]); // having rooms here makes it render exponentially

  return (
    <div className="messages">
    </div>
  );
}
