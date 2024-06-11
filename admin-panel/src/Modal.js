import React from "react";

const Modal = ({ children, onClose }) => {
  const styles = {
    modal: {
      position: "fixed",
      top: 50,
      left: "50%",
      transform: "translate(-50%)",
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 5,
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      zIndex: 10,
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      zIndex: 9,
    },
    closeButton: {
      position: "absolute",
      top: 10,
      right: 10,
      cursor: "pointer",
    },
    formGroup: {
      marginBottom: 15,
      display: "flex",
      flexDirection: "column",
    },
  };

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          &#x2716;
        </button>
        {children}
      </div>
    </>
  );
};

export default Modal;
