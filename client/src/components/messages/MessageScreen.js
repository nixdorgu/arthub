import React from 'react'
import NewConversation from '../states/NewConversation';
import Message from './Message';

export default function MessageScreen({empty, data, recipient}) {
    return (
        <div style={{minHeight: "calc(90vh - 5rem)", overflow: empty ? "hidden" : "scroll"}}>
            {
              empty ? <NewConversation recipient={recipient}/> :
              data.map((data, index) => <Message key={index} props={data} />)
            }
        </div>
    )
}
