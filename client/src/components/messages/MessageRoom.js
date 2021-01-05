import React, { useEffect, useState, useRef } from "react";
import {Redirect, useParams} from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { fetch } from "../../utils/Facade";
import UserFlow from "../../utils/UserFlow";
import MessageRoomComponent from "./MessageRoomComponent";

function scrollLastMessageIntoView(inputRef) {
  inputRef.current?.scrollIntoView({ smooth: true });
}

export default function MessageRoom() {
  const {room} = useParams();
  const [data, setData] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [empty, setEmpty] = useState(false);

  const inputRef = useRef();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const snackbarRef = useRef();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage] = useState('');

  const socket = useSocket();
  const {user} = useAuth();

  function sendNewMessage(user, content) {
    const newMessage = {
      room_id: room,
      sender_id: user['id'],
      content: content,
      timestamp: new Date()
    }

    fetch('/api/messages', {
      method: "POST",
      data: newMessage,
      success: (response) => {
        setMessage(response.message);
        setShowSnackbar(true);
        setError(false);
        setEmpty(false);
        socket.emit('send-message', newMessage);
        setData(data => [...data, newMessage]);
        setInput('');
      },
      error: (error) => {
        setMessage(error.message);
        setShowSnackbar(true);
      }
    });
  }

  useEffect(() => {
    socket.emit('join', room);

    fetch(`/api/messages/room/${room}`, {
      method: "GET",
      success: (response) => {
        const isEmpty = response.data.length === 0;

        setRecipient(response.name)
        setData(response.data);
        setLoading(false);
        setEmpty(isEmpty);
        setError(isEmpty);

        scrollLastMessageIntoView(inputRef)
      },
      error: (error) => {
        setLoading(false);
        setError(error);
        setEmpty(false);
      }
    });

    socket.on('new-message', (message) => {
      const updated = {...message, timestamp: message.timestamp.toLocaleString()};

      setData(data => [...data, updated])
      setError(false);
      setEmpty(false);

      scrollLastMessageIntoView(inputRef)
    });

    return () => socket.emit('leave', room);
  }, [socket, room]);

  return (
      <UserFlow
      isLoading={loading}
      isError={error}
      error={!empty ? <Redirect to="/messages"/> :( 
        <MessageRoomComponent props={{empty, recipient, data, sendNewMessage, user, input, setInput, inputRef, message, snackbarRef, error: true, showSnackbar, setShowSnackbar}}/>
      )  
    }
      success={
        <MessageRoomComponent props={{empty, recipient, data, sendNewMessage, user, input, setInput, inputRef, message, snackbarRef, error: true, showSnackbar, setShowSnackbar}}/>
      }/>
  );
}
