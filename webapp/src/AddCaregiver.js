import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // Form library
import {
  collection,
  getFirestore,
  doc,
  deleteDoc,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "./firebase"; // Assuming firebaseConfig holds your Firebase config

function AddCaregiver() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [caregivers, setCaregivers] = useState([]);

  const db = getFirestore(app);

  // Function to fetch caregivers on component mount
  useEffect(() => {
    const getCaregivers = async () => {
      const caregiversCollection = collection(db, "users"); // Assuming "users" collection stores users
      const caregiversSnapshot = await getDocs(caregiversCollection);
      const caregiversList = caregiversSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCaregivers(caregiversList.filter((user) => user.role === "caregiver")); // Filter caregivers
    };
    getCaregivers();
  }, [db]);

  // Function to add a new caregiver
  const onSubmit = async (data) => {
    try {
      const caregiversCollection = collection(db, "users");
      await addDoc(caregiversCollection, { ...data, role: "caregiver" }); // Add with caregiver role
      setCaregivers([...caregivers, { ...data, id: "", role: "caregiver" }]); // Update local state (for display)
      setValue("email", ""); // Clear email field after submission
      setValue("name", ""); // Clear name field after submission
    } catch (error) {
      console.error("Error adding caregiver:", error);
    }
  };

  // Function to delete a caregiver
  const handleDelete = async (caregiverId) => {
    const caregiverDoc = doc(db, "users", caregiverId);
    try {
      await deleteDoc(caregiverDoc);
      setCaregivers(
        caregivers.filter((caregiver) => caregiver.id !== caregiverId)
      );
    } catch (error) {
      console.error("Error deleting caregiver:", error);
    }
  };

  // Function to pre-fill edit form (optional)
  const handleEdit = (caregiver) => {
    setValue("email", caregiver.email);
    setValue("name", caregiver.name);
  };

  // Function to update caregiver information (optional)
  const handleUpdate = async (caregiverId, data) => {
    const caregiverDoc = doc(db, "users", caregiverId);
    try {
      await updateDoc(caregiverDoc, data);
      const updatedCaregivers = caregivers.map((c) =>
        c.id === caregiverId ? { ...c, ...data } : c
      );
      setCaregivers(updatedCaregivers);
    } catch (error) {
      console.error("Error updating caregiver:", error);
    }
  };

  return (
    <div className="add-caregiver">
      <h2>Add Caregiver</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
          />
          {errors.email && <span className="error">Email is required</span>}
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            {...register("name", { required: true })}
          />
          {errors.name && <span className="error">Name is required</span>}
        </div>
        <button type="submit">Add Caregiver</button>
      </form>

      <h2>Current Caregivers</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {caregivers.map((caregiver) => (
            <tr key={caregiver.id}>
              <td>{caregiver.email}</td>
              <td>{caregiver.name}</td>
              <td>
                <button onClick={() => handleEdit(caregiver)}>Edit</button>{" "}
                {/* Call handleEdit */}
                <button onClick={() => handleDelete(caregiver.id)}>
                  Delete
                </button>{" "}
                {/* Call handleDelete */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddCaregiver;
