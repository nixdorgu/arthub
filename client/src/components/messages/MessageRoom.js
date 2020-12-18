import React, {useCallback, useEffect, useState, useRef } from "react";
import {Redirect, useParams} from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import Facade from "../../utils/Facade";
import LoadingIndicator from "../LoadingIndicator";
import Message from "./Message";

function scrollLastMessageIntoView(inputRef) {
  inputRef.current.scrollIntoView({ smooth: true });
}

export default function MessageRoom() {
  let timeout;
  const {room} = useParams();
  const [data, setData] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef();

  const user = useAuth().user;

  const fetchMessages = useCallback((room) => {
    return new Facade().get(`/api/messages/room/${room}`, (response) => {
      setData(response);
      setLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeout = setTimeout(() => fetchMessages(room), 9000); // end-to-end communication with less requests per min than adding dep
      console.log(response)
      scrollLastMessageIntoView(inputRef)
    }, (error) => {
      // show message
      console.log(error)
      setError(error);
    });
  }, []);

  function sendMessage(user, content) {
    const message = {
      room_id: room,
      sender_id: user['id'],
      content: content,
      timestamp: new Date()
    }

    new Facade().post('/api/messages', message, (response) => {
      setData([...data, message])
      message.timestamp = message.timestamp.toLocaleString();
      scrollLastMessageIntoView(inputRef)
    }, (error) => {
      console.log(error)
    })
  }

  useEffect(() => {
      fetchMessages(room);
      return () => clearTimeout(timeout);
  }, [fetchMessages, room, timeout]);

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
