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
import EmergencyContactForm from "./EmergencyContactForm";
import Modal from "./Modal";

const EmergencyContactList = () => {
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editEmergencyContactId, setEditEmergencyContactId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "emergency_numbers"),
      (snapshot) => {
        const contactData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmergencyContacts(contactData);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db]);

  const handleDeleteEmergencyContact = async (id) => {
    const contactDocRef = doc(collection(db, "emergency_numbers"), id);
    try {
      await deleteDoc(contactDocRef);
      console.log("Emergency contact deleted");
      setEmergencyContacts(
        emergencyContacts.filter((contact) => contact.id !== id)
      );
    } catch (error) {
      console.error("Error deleting emergency contact:", error);
    }
  };

  const handleEditEmergencyContact = (id) => {
    setEditEmergencyContactId(id);
  };

  const handleAddEmergencyContact = async (contact) => {
    try {
      await addDoc(collection(db, "emergency_numbers"), contact);
      console.log("Emergency contact added");
      setEditEmergencyContactId(null);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding emergency contact:", error);
    }
  };

  const handleUpdateEmergencyContact = async (contact) => {
    if (!contact.id) {
      console.error("Error: Missing emergency contact ID for update");
      return;
    }
    const contactDocRef = doc(collection(db, "emergency_numbers"), contact.id);
    try {
      await updateDoc(contactDocRef, contact);
      console.log("Emergency contact updated");
      setEditEmergencyContactId(null);
    } catch (error) {
      console.error("Error updating emergency contact:", error);
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
      <h2>Emergency Contacts</h2>
      <button
        style={{ ...styles.button, ...styles.addButton }}
        onClick={() => setIsAddModalOpen(true)}
      >
        Add Contact
      </button>
      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <EmergencyContactForm onSubmit={handleAddEmergencyContact} />{" "}
        </Modal>
      )}

      {editEmergencyContactId && (
        <Modal onClose={() => setEditEmergencyContactId(null)}>
          <EmergencyContactForm
            isEdit={true}
            emergencyContactId={editEmergencyContactId}
            emergencyContact={emergencyContacts.find(
              (emergencyContact) =>
                emergencyContact.id === editEmergencyContactId
            )}
            onSubmit={handleUpdateEmergencyContact}
          />
        </Modal>
      )}
      {isLoading ? (
        <p>Loading emergency contacts...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Name</th>
              <th style={styles.tableHeader}>Phone Number</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emergencyContacts.map((emergencyContact) => (
              <tr key={emergencyContact.id}>
                <td style={styles.tableData}>{emergencyContact.type}</td>
                <td style={styles.tableData}>
                  {emergencyContact.phone_number}
                </td>
                <td style={styles.tableData}>
                  <div style={styles.actions}>
                    <button
                      style={{ ...styles.button, ...styles.editButton }}
                      onClick={() =>
                        handleEditEmergencyContact(emergencyContact.id)
                      }
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.deleteButton }}
                      onClick={() =>
                        handleDeleteEmergencyContact(emergencyContact.id)
                      }
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

export default EmergencyContactList;
