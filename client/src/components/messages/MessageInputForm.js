import React from 'react'

export default function MessageInputForm({sendNewMessage, user, input, setInput, inputRef}) {
    const send = () => sendNewMessage(user, input);
    const handleEnterKey = (e) => {
        if (e.code === 'Enter') {
            send()
        }
    }

    return (
        <div className="message-form" ref={inputRef} style={{paddingBottom: "2vh"}}>
            <input style={{whiteSpace: "pre-wrap"}} className="message-input" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleEnterKey}
            />
            <button
              className="send-message"
              onClick={send}
            >
              Send
            </button>
        </div>
    )
}
