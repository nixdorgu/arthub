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
  const element = list[list.length - 1];

  if (element) {
    element.scrollIntoView({ smooth: true });
  }
}

export default function MessageRoom() {
  const {room} = useParams();
  const [data, setData] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);

  const user = useContext(AuthContext).user;

  function fetchMessages(room) {
    return new Facade().get(`/api/messages/room/${room}`, (response) => {
      setData(response);
      setLoading(false);
      setTimeout(() => fetchMessages(room), 3000); // end-to-end communication with less requests per min than adding dep
      console.log(response)
    }, (error) => {
      // show message
      console.log(error)
      setError(error);
    });
  }

  function sendMessage(user, content) {
    const message = {
      room_id: room,
      sender_id: user['id'],
      content: content,
      timestamp: new Date()
    }

    new Facade().post('/api/messages', message, (response) => {
      console.log(response)
    }, (error) => {
      console.log(error)
    })
    // send to database

    scrollLastMessageIntoView()
    message.timestamp = message.timestamp.toLocaleString();
    setData([...data, message])
  }

  useEffect(() => {
      fetchMessages(room);
      scrollLastMessageIntoView()
  }, [room]);

  return (
    <div className="messages">
      {/* <div> */}
      {loading ? <LoadingIndicator/> : null}
      {error ? <Redirect to="/messages"/> : null }
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
