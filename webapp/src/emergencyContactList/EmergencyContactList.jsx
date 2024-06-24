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
import EmergencyContactForm from "../emergencyContactForm/EmergencyContactForm";
import Modal from "../modal/Modal";
import "./emergencyContactList.css";

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

  return (
    <div className="container">
      <h2>Emergency Contacts</h2>
      <button
        className="button addButton"
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
        <table className="table">
          <thead>
            <tr>
              <th className="tableHeader">Name</th>
              <th className="tableHeader">Phone Number</th>
              <th className="tableHeader">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emergencyContacts.map((emergencyContact) => (
              <tr key={emergencyContact.id}>
                <td className="tableData">{emergencyContact.type}</td>
                <td className="tableData">
                  {emergencyContact.phone_number}
                </td>
                <td className="tableData">
                  <div className="actions">
                    <button
                      className="button editButton"
                      onClick={() =>
                        handleEditEmergencyContact(emergencyContact.id)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="button deleteButton"
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
