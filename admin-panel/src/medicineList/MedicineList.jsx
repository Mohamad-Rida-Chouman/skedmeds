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
import { app } from "../firebase";
import MedicineForm from "../medicineForm/MedicineForm";
import Modal from "../modal/Modal";
import './medicineList.css';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMedicineId, setEditMedicineId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [medicineImages, setMedicineImages] = useState({});

  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "medicines"), (snapshot) => {
      const medicineData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        imageUrl: doc.data().imageUrl || "", // Set default empty string for imageUrl
      }));
      setMedicines(medicineData);
      setIsLoading(false);

      // Update medicineImages state with image URLs
      const newMedicineImages = {};
      medicineData.forEach((medicine) => {
        newMedicineImages[medicine.id] = medicine.imageUrl;
      });
      setMedicineImages(newMedicineImages);
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

  return (
    <div className="container">
      <h2>Medicine List</h2>
      <button
        className="button addButton"
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
        <table className="table">
          <thead>
            <tr>
              <th className="tableHeader">Image</th>
              <th className="tableHeader">Name</th>
              <th className="tableHeader">Description</th>
              <th className="tableHeader">Price</th>
              <th className="tableHeader">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.id}>
                <td className="tableData">
                  {medicineImages[medicine.id] && (
                    <div className="tableDataImage">
                      <img
                        src={medicineImages[medicine.id]}
                        alt={medicine.name}
                      />
                    </div>
                  )}
                </td>
                <td className="tableData">{medicine.name}</td>
                <td className="tableData">{medicine.description}</td>
                <td className="tableData">{medicine.price}</td>
                <td className="tableData">
                  <div className="actions">
                    <button
                      className="button editButton"
                      onClick={() => handleEditMedicine(medicine.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="button deleteButton"
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
