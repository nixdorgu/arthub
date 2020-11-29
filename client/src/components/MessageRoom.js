import React, {useContext, useEffect, useState } from "react";
import {Redirect, useParams} from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import Facade from "../utils/Facade";
import LoadingIndicator from "./LoadingIndicator";
import Message from "./Message";

// sticky nav
// fixed position input
// wala footer dapat diri
function scrollLastMessageIntoView() {
  const list = document.querySelectorAll(".message");

  if (list.length > 0) {
    const element = list[list.length - 1];
    element.scrollIntoView({ smooth: true });
  }
}

export default function MessageRoom() {
  const {room} = useParams();
  const [data, setData] = useState([
    {
      user_id: 7,
      sender_id: 5,
      content: "I am not okay with this",
      timestamp: new Date(2020, 10, 20, 15, 30).toLocaleString(),
    },
    {
      user_id: 7,
      sender_id: 7,
      content: "How come",
      timestamp: new Date(2020, 10, 20, 15, 31).toLocaleString(),
    },
    {
      user_id: 7,
      sender_id: 5,
      content: "Di ko sure",
      timestamp: new Date(2020, 10, 20, 15, 55).toLocaleString(),
    },
    {
      user_id: 7,
      sender_id: 5,
      content:
        "Di ko sure kung gaano man gid ko sa kabuhi ko pro oks lang ina, okay?",
      timestamp: new Date(2020, 10, 20, 15, 55).toLocaleString(),
    },
    {
      user_id: 7,
      sender_id: 7,
      content:
        "Di ko sure kung gaano man gid ko sa kabuhi ko pro oks lang ina, okay?",
      timestamp: new Date(2020, 10, 20, 15, 55).toLocaleString(),
    },
    {
      user_id: 7,
      sender_id: 7,
      content:
        "Di ko sure kung gaano man gid ko sa kabuhi ko pro oks lang ina, okay?",
      timestamp: new Date(2020, 10, 20, 15, 55).toLocaleString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);

  const user = useContext(AuthContext).user;

  function sendMessage(user, content) {
    const message = {
      room_id: room,
      sender_id: user['id'],
      content: content,
      timestamp: new Date()
    }

    new Facade().post('/api/messages', message, (response) => {}, (error) => {})
    // send to database

    message.timestamp = message.timestamp.toLocaleString();
    setData([...data, message])
  }

  useEffect(() => {
      new Facade().get(`/api/messages/room/${room}`, (response) => {
          setData(response);
      }, (error) => {
      })
      scrollLastMessageIntoView()
    }, [data, room]);

  return (
    <div className="messages">
      {/* <SidePanel /> */}
      {/* <div> */}
      {data.map((data, index) => (
        <Message key={index} props={data} />
      ))}
      {/* </div> */}
      <div className="message-form">
        <input className="message-input" value={input} onChange={(e) => setInput(e.target.value)}/>
        <button
          className="send-message"
          onClick={() => sendMessage(user, input)}
        >
          Send
        </button>
      </div>
    </div>
  );
}
