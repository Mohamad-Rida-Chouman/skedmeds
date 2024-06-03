import React, { useState, useEffect } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  doc,
  deleteDoc,
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
  }, [db]); // Add db as a dependency

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

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      padding: "20px",
      backgroundColor: "#f5f5f5",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      border: "1px solid #ddd",
    },
    tableHeader: {
      backgroundColor: "#e0e0e0",
      fontSize: "16px",
      fontWeight: "bold",
      padding: "10px",
    },
    tableData: {
      padding: "10px",
      border: "1px solid #ddd",
      textAlign: "left",
    },
    actions: {
      display: "flex",
      justifyContent: "space-between",
    },
    button: {
      padding: "5px 10px",
      backgroundColor: "#e0e0e0",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      margin: "5px",
    },
    editButton: {
      backgroundColor: "#a9d0f5", // Light blue for edit
    },
    deleteButton: {
      backgroundColor: "#f5a9a9", // Light red for delete
    },
  };

  return (
    <div style={styles.container}>
      <h2>Medicine List</h2>
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
      {editMedicineId && (
        <MedicineForm
          medicineId={editMedicineId}
          onUpdate={() => setEditMedicineId(null)} // Callback to clear editMedicineId after update
        />
      )}
    </div>
  );
};

export default MedicineList;
