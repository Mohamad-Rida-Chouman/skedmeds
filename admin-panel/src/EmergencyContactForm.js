import React, { useState, useRef } from "react";

const EmergencyContactForm = ({ emergencyContact, isEdit, onSubmit }) => {
  const [type, setType] = useState(
    emergencyContact ? emergencyContact.type : ""
  );
  const [phone_number, setPhoneNumber] = useState(
    emergencyContact ? emergencyContact.phone_number : ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emergencyContactData = {
      type,
      phone_number,
    };

    if (isEdit) {
      emergencyContactData.id = emergencyContact.id;
    }

    onSubmit(emergencyContactData);

    setType("");
    setPhoneNumber("");
  };

  const buttonRef = useRef(null);

  const formStyles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    label: {
      marginBottom: 5,
    },
    input: {
      marginBottom: 15,
      padding: 10,
      border: "1px solid #ccc",
      borderRadius: 5,
    },
    descriptionInput: {
      height: 100,
      resize: "none",
    },
    button: {
      backgroundColor: "#e0e8f0",
      padding: 10,
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
      marginTop: 15,
    },
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.container}>
      <h2>{isEdit ? "Edit emergency contact" : "Add emergency contact"}</h2>
      <label style={formStyles.label} htmlFor="type">
        Type:
      </label>
      <input
        type="text"
        id="type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
        style={formStyles.input}
      />
      <label style={formStyles.label} htmlFor="phone_number">
        Number:
      </label>
      <input
        type="number"
        id="phone_number"
        value={phone_number}
        onChange={(e) => setPhoneNumber(e.target.value)}
        style={{ ...formStyles.input, ...formStyles.numberInput }}
      />

      <button type="submit" ref={buttonRef} style={formStyles.button}>
        {isEdit ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default EmergencyContactForm;
