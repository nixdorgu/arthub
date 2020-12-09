import React from 'react'
import Modal from './Modal';

export default function CommissionModal({show, handleClose, handleSubmit}) {
    return (
        <Modal show={show} handleClose={handleClose} header={'Commission Form'} handleSubmit={handleSubmit}>
            <input type="text" aria-label="title" placeholder="Title (maximum of 30 characters)" min="1" max="30" required/>
            <textarea className="short-description" aria-label="short description" placeholder="Short description (maximum of 80 characters)" min="1" max="80" required/>
            <textarea className="long-description" aria-label="long description" placeholder="Long description (maximum of 300 characters)" min="1" max="300" required/>
            <input id="price" name="price" type="number" min="1.00" step="any" aria-label="proposed price" placeholder="Proposed price"/>
            <p className="price-disclaimer">* We operate using USD</p>
        </Modal>
    )
}


