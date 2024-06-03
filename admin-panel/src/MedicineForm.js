import React, { useState } from "react";

const MedicineForm = ({ medicineId, medicine, onSubmit }) => {
  const [name, setName] = useState(medicine ? medicine.name : ""); // Pre-fill for edit
  const [description, setDescription] = useState(
    medicine ? medicine.description : ""
  ); // Pre-fill for edit
  const [price, setPrice] = useState(medicine ? medicine.price : ""); // Pre-fill for edit

  const handleSubmit = async (e) => {
    e.preventDefault();

    const medicineData = {
      name,
      description,
      price,
    };

    onSubmit(medicineData); // Call the provided onSubmit function

    // Clear form after submission (optional)
    setName("");
    setDescription("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{medicineId ? "Edit Medicine" : "Add Medicine"}</h2>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label htmlFor="description">Description:</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label htmlFor="price">Price:</label>
      <input
        type="number"
        id="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit">{medicineId ? "Update" : "Add"}</button>
    </form>
  );
};

export default MedicineForm;
