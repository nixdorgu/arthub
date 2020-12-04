import React from 'react'
import Modal from './Modal';

export default function CommissionModal({show, handleClose, handleSubmit}) {
    return (
        <Modal show={show} handleClose={handleClose} header={'Commission Form'} handleSubmit={handleSubmit}>
                    <input type="text" placeholder="Title (maximum of 30 characters)" min="1" max="30" required/>
                    <textarea className="short-description" placeholder="Short description (maximum of 80 characters)" min="1" max="80" required/>
                    <textarea className="long-description" placeholder="Long description (maximum of 300 characters)" min="1" max="300" required/>
        </Modal>
    )
}


