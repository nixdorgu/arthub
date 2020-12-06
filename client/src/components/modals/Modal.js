import React from "react";
import './modal.css';

export default function Modal({ handleClose, handleSubmit, header, show, children }) {
  const className = show ? "modal-body show" : "modal-body hide";

  return (
    <div className={className}>
        <section>
            <div className="modal main">
                <h1 className="modal header">{header}</h1>
                <form onSubmit={handleSubmit} id="modal-form">
                    {children}
                </form>
                <div className="modal button-group">
                    <button className="modal button-group cancel" onClick={handleClose}>Cancel</button>
                    <button form="modal-form" type="submit" className="modal button-group submit">Submit</button>
                </div>
            </div>

        </section>
    </div>
  );
}