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
import { app } from "./firebase";
import MedicineForm from "./MedicineForm";
import Modal from "./Modal";

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMedicineId, setEditMedicineId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "medicines"), (snapshot) => {
      const medicineData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMedicines(medicineData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const handleDeleteMedicine = (id) => {
    const medicineDocRef = doc(collection(db, "medicines"), id);
    deleteDoc(medicineDocRef)
      .then(() => {
        console.log("Medicine deleted");
        setMedicines(medicines.filter((medicine) => medicine.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting medicine:", error);
      });
  };

  const handleEditMedicine = (id) => {
    setEditMedicineId(id);
  };

  const handleAddMedicine = async (medicine) => {
    try {
      await addDoc(collection(db, "medicines"), medicine);
      console.log("Medicine added");
      setEditMedicineId(null);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };

  const handleUpdateMedicine = async (medicine) => {
    if (!medicine.id) {
      console.error("Error: Missing medicine ID for update");
      return;
    }
    const medicineDocRef = doc(collection(db, "medicines"), medicine.id);
    try {
      await updateDoc(medicineDocRef, medicine);
      console.log("Medicine updated");
      setEditMedicineId(null);
    } catch (error) {
      console.error("Error updating medicine:", error);
    }
  };

  const styles = {
    container: {
      backgroundColor: "#f0f8ff",
      padding: 20,
      borderRadius: 5,
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    },
    button: {
      backgroundColor: "#e0e8f0",
      padding: 10,
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
      margin: 5,
    },
    addButton: {
      backgroundColor: "#a5d6a7",
      color: "#fff",
      marginBottom: 15,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      padding: 10,
      backgroundColor: "#e0e8f0",
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
      backgroundColor: "#ffc107",
      color: "#fff",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "#fff",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Medicine List</h2>
      <button
        style={{ ...styles.button, ...styles.addButton }}
        onClick={() => setIsAddModalOpen(true)}
      >
        Add Medicine
      </button>
      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <MedicineForm onSubmit={handleAddMedicine} />
        </Modal>
      )}

      {editMedicineId && (
        <Modal onClose={() => setEditMedicineId(null)}>
          <MedicineForm
            isEdit={true}
            medicineId={editMedicineId}
            medicine={medicines.find(
              (medicine) => medicine.id === editMedicineId
            )}
            onSubmit={handleUpdateMedicine}
          />
        </Modal>
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
