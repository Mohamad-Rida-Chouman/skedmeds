import React, { useState } from "react";
import {
  doc,
  updateDoc,
  addDoc,
  getFirestore,
  collection,
} from "firebase/firestore";
import { app } from "./firebase"; // Assuming your firebase.js initializes app

const MedicineForm = ({ medicineId, onUpdate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const db = getFirestore(app); // Get Firestore instance

  // ... (optional code to fetch medicine details if needed)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const medicine = { name, description, price };

    if (medicineId) {
      // Update existing medicine
      await updateDoc(doc(collection(db, "medicines"), medicineId), medicine)
        .then(() => {
          console.log("Medicine updated");
          onUpdate(); // Call callback to indicate update completion
        })
        .catch((error) => {
          console.error("Error updating medicine:", error);
        });
    } else {
      // Add new medicine
      await addDoc(collection(db, "medicines"), medicine)
        .then(() => {
          console.log("Medicine added");
          onUpdate(); // Call callback to indicate addition completion (optional)
        })
        .catch((error) => {
          console.error("Error adding medicine:", error);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{medicineId ? "Edit Medicine" : "Add Medicine"}</h2>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label>
        Price:
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>
      <button type="submit">{medicineId ? "Update" : "Add"}</button>
    </form>
  );
};

export default MedicineForm;
