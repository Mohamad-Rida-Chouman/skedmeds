import React from "react";
import "./modal.css";

const Modal = ({ children, onClose }) => {

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="modal">
        <button className="closeButton" onClick={onClose}>
          &#x2716;
        </button>
        {children}
      </div>
    </>
  );
};

export default Modal;
