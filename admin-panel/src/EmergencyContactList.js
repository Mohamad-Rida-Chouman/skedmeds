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
import { app } from "./firebase"; // Import Firebase instance
import EmergencyContactForm from "./EmergencyContactForm";
import Modal from "./Modal"; // Import your Modal component

const EmergencyContactList = () => {
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [editEmergencyContactId, setEditEmergencyContactId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const db = getFirestore(app); // Get Firestore instance

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "emergency_numbers"),
      (snapshot) => {
        const contactData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmergencyContacts(contactData);
        setIsLoading(false); // Set loading state to false after data arrives
      }
    );

    return () => unsubscribe(); // Cleanup function to unsubscribe on unmount
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
    setEditEmergencyContactId(id); // Set editEmergencyContactId when edit button is clicked
  };

  const handleAddEmergencyContact = async (contact) => {
    try {
      await addDoc(collection(db, "emergency_numbers"), contact);
      console.log("Emergency contact added");
      setEditEmergencyContactId(null); // Clear edit state after successful addition
      setIsAddModalOpen(false); // Close add modal after successful addition
    } catch (error) {
      console.error("Error adding emergency contact:", error);
    }
  };

  const handleUpdateEmergencyContact = async (contact) => {
    if (!contact.id) {
      console.error("Error: Missing emergency contact ID for update");
      return; // Exit the function if contactId is missing
    }
    const contactDocRef = doc(collection(db, "emergency_numbers"), contact.id);
    try {
      await updateDoc(contactDocRef, contact);
      console.log("Emergency contact updated");
      setEditEmergencyContactId(null); // Clear edit state after successful update
    } catch (error) {
      console.error("Error updating emergency contact:", error);
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

      {editEmergencyContactId && ( // Check if editPostId has a value (edit button clicked)
        <Modal onClose={() => setEditEmergencyContactId(null)}>
          {" "}
          {/* Close modal on close */}
          <EmergencyContactForm
            isEdit={true} // Set isEdit prop to true for edit functionality
            emergencyContactId={editEmergencyContactId}
            emergencyContact={emergencyContacts.find(
              (emergencyContact) =>
                emergencyContact.id === editEmergencyContactId
            )} // Find Post to edit
            onSubmit={handleUpdateEmergencyContact} // Pass handleUpdatePost for editing
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
