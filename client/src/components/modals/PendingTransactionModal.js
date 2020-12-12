import React from 'react'
import Modal from './Modal';

export default function PendingTransactionModal({isArtist, transaction, show, handleClose, handleSubmit}) {
    const buttonGroup = isArtist ? (
            <>
                <button className="modal button-group cancel" onClick={handleClose}>Decline</button>
                <button form="modal-form" type="submit" className="modal button-group submit" onClick={handleSubmit}>Accept</button>
            </>
        ) : (
            <>
                <button className="modal button-group cancel" onClick={handleClose}>Close Transaction</button>
                <button form="modal-form" type="submit" className="modal button-group submit" onClick={handleSubmit}>Cancel Transaction</button>
            </>
        )

    
    return (
        <Modal show={show} handleClose={(handleClose)} header={'Pending Transaction'} handleSubmit={handleSubmit} btnGroup={buttonGroup}>
            <div style={{width: "80%", display: "flex", flexDirection: "column"}}>
                <h3 style={{margin: ".5rem 0"}}>{transaction.title}</h3>
                <p style={{margin: ".5rem 0"}}>Short Description: <i>{transaction.short_description}</i></p>
                <p style={{margin: ".5rem 0"}}>Long Description: {transaction.description}</p>
                <p style={{margin: ".5rem 0"}}>Proposed Price: ${transaction.price}</p>
            </div>
        </Modal>
    )
}


