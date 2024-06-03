import React, { useState, useEffect } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "./firebase"; // Assuming your firebase.js initializes app
import MedicineForm from "./MedicineForm";

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [editMedicineId, setEditMedicineId] = useState(null); // Add state for editMedicineId

  const db = getFirestore(app); // Get Firestore instance

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "medicines"), (snapshot) => {
      const medicineData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMedicines(medicineData);
      setIsLoading(false); // Set loading state to false after data arrives
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe on unmount
  }, [db]);

  const handleDeleteMedicine = (id) => {
    const medicineDocRef = doc(collection(db, "medicines"), id);
    deleteDoc(medicineDocRef)
      .then(() => {
        console.log("Medicine deleted");
        // Update medicines state to reflect deletion (optional optimization)
        setMedicines(medicines.filter((medicine) => medicine.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting medicine:", error);
      });
  };

  const handleEditMedicine = (id) => {
    setEditMedicineId(id); // Set editMedicineId when edit button is clicked
  };

  const handleAddMedicine = async (medicine) => {
    try {
      await addDoc(collection(db, "medicines"), medicine);
      console.log("Medicine added");
      setEditMedicineId(null); // Clear editMedicineId after successful addition
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };

  const handleUpdateMedicine = async (medicine) => {
    const medicineDocRef = doc(collection(db, "medicines"), medicine.id);
    try {
      await updateDoc(medicineDocRef, medicine);
      console.log("Medicine updated");
      setEditMedicineId(null); // Clear editMedicineId after successful update
    } catch (error) {
      console.error("Error updating medicine:", error);
    }
  };

  const styles = {
    container: {
      backgroundColor: "#f0f8ff", // Light blue background
      padding: 20,
      borderRadius: 5,
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    },
    button: {
      backgroundColor: "#e0e8f0", // Light gray button background
      padding: 10,
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
      margin: 5,
    },
    addButton: {
      backgroundColor: "#a5d6a7", // Light green button for adding
      color: "#fff", // White text
      marginBottom: 15, // Add some margin below the button
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      padding: 10,
      backgroundColor: "#e0e8f0", // Light gray header background
      fontWeight: "bold",
    },
    tableData: {
      padding: 10,
      border: "1px solid #ddd",
    },
    actions: {
      display: "flex",
      justifyContent: "space-between",
    },
    editButton: {
      backgroundColor: "#ffc107", // Light orange button for editing
      color: "#fff", // White text
    },
    deleteButton: {
      backgroundColor: "#dc3545", // Light red button for deleting
      color: "#fff", // White text
    },
  };

  return (
    <div style={styles.container}>
      <h2>Medicine List</h2>
      <button
        style={{ ...styles.button, ...styles.addButton }}
        onClick={() => setEditMedicineId(null)}
      >
        Add Medicine
      </button>
      {editMedicineId ? (
        <MedicineForm
          medicineId={editMedicineId}
          medicine={medicines.find(
            (medicine) => medicine.id === editMedicineId
          )} // Find medicine to edit
          onSubmit={handleUpdateMedicine} // Pass handleUpdateMedicine for editing
        />
      ) : (
        <MedicineForm
          onSubmit={handleAddMedicine} // Pass handleAddMedicine for adding
        />
      )}
      {isLoading ? (
        <p>Loading medicines...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Name</th>
              <th style={styles.tableHeader}>Description</th>
              <th style={styles.tableHeader}>Price</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.id}>
                <td style={styles.tableData}>{medicine.name}</td>
                <td style={styles.tableData}>{medicine.description}</td>
                <td style={styles.tableData}>{medicine.price}</td>
                <td style={styles.tableData}>
                  <div style={styles.actions}>
                    <button
                      style={{ ...styles.button, ...styles.editButton }}
                      onClick={() => handleEditMedicine(medicine.id)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.deleteButton }}
                      onClick={() => handleDeleteMedicine(medicine.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MedicineList;
