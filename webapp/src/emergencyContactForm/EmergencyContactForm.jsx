import React, { useState, useRef } from "react";
import "./emergencyContactForm.css";

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

  return (
    <form onSubmit={handleSubmit} className="container">
      <h2>{isEdit ? "Edit emergency contact" : "Add emergency contact"}</h2>
      <label className="label" htmlFor="type">
        Type:
      </label>
      <input
        type="text"
        id="type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
        className="input"
      />
      <label className="label" htmlFor="phone_number">
        Number:
      </label>
      <input
        type="number"
        id="phone_number"
        value={phone_number}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="input numberInput"
      />

      <button type="submit" ref={buttonRef} className="button">
        {isEdit ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default EmergencyContactForm;
