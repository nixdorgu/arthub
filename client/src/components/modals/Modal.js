import React from "react";
import './modal.css';

export default function Modal({ handleClose, handleSubmit, header, show, children, btnGroup }) {
  const className = show ? "modal-body show" : "modal-body hide";
  const buttonGroup = (<><button className="modal button-group cancel" onClick={handleClose}>Cancel</button>
        <button form="modal-form" type="submit" className="modal button-group submit" onClick={handleClose}>Submit</button></>);
  return (
    <div className={className}>
        <section>
            <div className="modal main">
                <h1 className="modal header">{header}</h1>
                <form onSubmit={handleSubmit} id="modal-form">
                    {children}
                </form>
                <div className="modal button-group">
                    {btnGroup ? btnGroup : buttonGroup}
                </div>
            </div>

        </section>
    </div>
  );
}
