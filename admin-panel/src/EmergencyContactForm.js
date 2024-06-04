import React, { useState, useRef } from "react";

const EmergencyContactForm = ({
  emergencyId,
  emergencyContact,
  isEdit,
  onSubmit,
}) => {
  const [type, setType] = useState(
    emergencyContact ? emergencyContact.type : ""
  ); // Pre-fill for edit
  const [phone_number, setPhoneNumber] = useState(
    emergencyContact ? emergencyContact.phone_number : ""
  ); // Pre-fill for edit
  // const buttonRef = useRef(null); // Reference for button hover effect

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emergencyContactData = {
      type,
      phone_number,
    };

    if (isEdit) {
      emergencyContactData.id = emergencyContact.id; // Include id for update
    }

    onSubmit(emergencyContactData); // Call onSubmit with updated data

    // Clear form after submission (optional)
    setType("");
    setPhoneNumber("");
  };

  const buttonRef = useRef(null); // Reference for button hover effect

  const formStyles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center", // Center elements horizontally
      justifyContent: "center", // Center elements vertically (within modal)
      padding: 20,
    },
    label: {
      marginBottom: 5, // Add some margin below labels
    },
    input: {
      marginBottom: 15, // Add some margin below inputs
      padding: 10,
      border: "1px solid #ccc",
      borderRadius: 5,
    },
    descriptionInput: {
      height: 100, // Adjust height as needed
      resize: "none", // Prevent textarea resizing
    },
    button: {
      backgroundColor: "#e0e8f0", // Light gray button background
      padding: 10,
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
      marginTop: 15, // Add margin above button
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
