import React, { useState, useRef } from "react";

const MedicineForm = ({ medicineId, medicine, isEdit, onSubmit }) => {
  const [name, setName] = useState(medicine ? medicine.name : "");
  const [description, setDescription] = useState(
    medicine ? medicine.description : ""
  );
  const [price, setPrice] = useState(medicine ? medicine.price : "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const medicineData = {
      name,
      description,
      price,
    };

    if (isEdit) {
      medicineData.id = medicine.id;
    }

    onSubmit(medicineData);

    setName("");
    setDescription("");
    setPrice("");
  };

  const handleChangePrice = (e) => {
    const priceAsNumber = parseFloat(e.target.value);
    setPrice(priceAsNumber);
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
      <h2>{isEdit ? "Edit Medicine" : "Add Medicine"}</h2>
      <label style={formStyles.label} htmlFor="name">
        Name:
      </label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={formStyles.input}
      />
      <label style={formStyles.label} htmlFor="description">
        Description:
      </label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ ...formStyles.input, ...formStyles.descriptionInput }}
      />
      <label style={formStyles.label} htmlFor="price">
        Price:
      </label>
      <input
        type="number"
        id="price"
        value={price}
        onChange={handleChangePrice}
        style={formStyles.input}
      />
      <button type="submit" ref={buttonRef} style={formStyles.button}>
        {isEdit ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default MedicineForm;
