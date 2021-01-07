import React from 'react'
import PayPal from '../PayPal';
import Modal from './Modal';

export default function PaymentPendingModal({transaction, show, handleClose, handleCancellation, handleSubmit}) {
    const buttonGroup = 
            <>
                <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                    <button style={{width: "100%", padding: ".7rem"}} form="modal-form" className="modal button-group cancel" onClick={handleCancellation}>Cancel Transaction</button>
                    <PayPal props={{transaction, handleSubmit}} onClick={handleClose}/>
                </div>
            </>
        

    
    return (
        <Modal show={show} handleClose={(handleClose)} header={'Process Payment'} btnGroup={buttonGroup}>
            <div style={{width: "80%", display: "flex", flexDirection: "column"}}>
                <h3 style={{margin: ".5rem 0"}}>{transaction.title}</h3>
                <p style={{margin: ".5rem 0"}}>Short Description: <i>{transaction.short_description}</i></p>
                <p style={{margin: ".5rem 0"}}>Long Description: {transaction.description}</p>
                <p style={{margin: ".5rem 0"}}>Proposed Price: ${transaction.price}</p>
            </div>
        </Modal>
    )
}


