import React, { useEffect, useState, useRef } from "react";
import {Redirect, useParams} from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import Facade from "../../utils/Facade";
import LoadingIndicator from "../LoadingIndicator";
import Message from "./Message";

function scrollLastMessageIntoView(inputRef) {
  inputRef.current?.scrollIntoView({ smooth: true });
}

export default function MessageRoom() {
  const {room} = useParams();
  const [data, setData] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef();

  const socket = useSocket();
  const {user} = useAuth();

  function sendMessage(user, content) {
    const message = {
      room_id: room,
      sender_id: user['id'],
      content: content,
      timestamp: new Date()
    }

    new Facade().post('/api/messages', message, (response) => {
      socket.emit('send-message', message);
      setInput('');
    }, (error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    socket.emit('join', room);

    new Facade().get(`/api/messages/room/${room}`, (response) => {
      setData(response);
      setLoading(false);
      scrollLastMessageIntoView(inputRef)
    }, (error) => {
      // show message
      // console.log(error)
      setError(error);
    });

    socket.on('new-message', (message) => {
      const updated = {...message, timestamp: message.timestamp.toLocaleString()};
      setData(data => [...data, updated])
      scrollLastMessageIntoView(inputRef)
    });

    return () => {
      socket.emit('leave', room);
    }
  }, [socket, room]);

  return (
    <div className="messages">
      {/* <div> */}
      {loading ? <LoadingIndicator/> : null}
      {error ? <Redirect to="/messages"/> : null }
      <div style={{minHeight: "calc(90vh - 5rem)", overflow: "scroll"}}>
      {data.map((data, index) => (
        <Message key={index} props={data} />
      ))}
      </div>
      {/* </div> */}
      <div className="message-form" ref={inputRef} style={{paddingBottom: "2vh"}}>
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
