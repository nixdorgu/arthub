import React from 'react'
import SimpleSnackbar from "../Snackbar";
import MessageInputForm from "./MessageInputForm";
import MessageScreen from "./MessageScreen";

export default function MessageRoomComponent(props) {
    const {message, snackbarRef, showSnackbar, setShowSnackbar, empty, data, recipient, sendNewMessage, user, input, setInput, inputRef} = props.props;
    return (
        <div className="messages">
          {showSnackbar ? <SimpleSnackbar props={{message, snackbarRef, error: true, showSnackbar, setShowSnackbar}}/> : <></>}
          <MessageScreen empty={empty} recipient={recipient} data={data}/>
          <MessageInputForm sendNewMessage={sendNewMessage} user={user} input={input} setInput={setInput} inputRef={inputRef}/>
        </div>
    )
}
