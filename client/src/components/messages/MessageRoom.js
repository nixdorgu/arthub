import React, {useCallback, useContext, useEffect, useState } from "react";
import {Redirect, useParams} from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import Facade from "../../utils/Facade";
import LoadingIndicator from "../LoadingIndicator";
import Message from "./Message";

function scrollLastMessageIntoView() {
  const list = document.querySelectorAll(".message");
  const element = list[list.length - 1];

  if (element) {
    element.scrollIntoView({ smooth: true });
  }
}

export default function MessageRoom() {
  let timeout;
  const {room} = useParams();
  const [data, setData] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useContext(AuthContext).user;

  const fetchMessages = useCallback((room) => {
    return new Facade().get(`/api/messages/room/${room}`, (response) => {
      setData(response);
      setLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeout = setTimeout(() => fetchMessages(room), 5000); // end-to-end communication with less requests per min than adding dep
      console.log(response)
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

      return () => {
        clearTimeout(timeout)
      }
  }, [fetchMessages, room, timeout]);

  return (
    <div className="messages">
      {/* <div> */}
      {loading ? <LoadingIndicator/> : null}
      {error ? <Redirect to="/messages"/> : null }
      <div style={{minHeight: "calc(90vh - 5rem)"}}>
      {data.map((data, index) => (
        <Message key={index} props={data} />
      ))}
      </div>
      {/* </div> */}
      <div className="message-form" style={{paddingBottom: "2vh"}}>
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
