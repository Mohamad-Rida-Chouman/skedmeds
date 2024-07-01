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
import Modal from "../modal/Modal";
import TestForm from "../testForm/TestForm"

const RemindersList = () => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editReminderId, setEditReminderId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "appointments_reminder"), (snapshot) => {
      const reminderData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setReminders(reminderData);
      setIsLoading(false);

    });

    return () => unsubscribe();
  }, [db]);

  const handleDeleteReminder = (id) => {
    const reminderDocRef = doc(collection(db, "appointments_reminder"), id);
    deleteDoc(reminderDocRef)
      .then(() => {
        console.log("Reminder deleted");
        setReminders(reminders.filter((reminder) => reminder.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting reminder:", error);
      });
  };

  const handleEditReminder = (id) => {
    setEditReminderId(id);
  };

  const handleAddReminder = async (reminder) => {
    try {
      await addDoc(collection(db, "appointments_reminder"), reminder);
      console.log("Reminder added");
      setEditReminderId(null);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding reminder:", error);
    }
  };

  const handleUpdateReminder = async (reminder) => {
    if (!reminder.id) {
      console.error("Error: Missing reminder ID for update");
      return;
    }
    const reminderDocRef = doc(collection(db, "appointments_reminder"), reminder.id);
    try {
      await updateDoc(reminderDocRef, reminder);
      console.log("Reminder updated");
      setEditReminderId(null);
    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  };

  return (
    <div className="container">
      <h2>Reminder List</h2>
      <button
        className="button addButton"
        onClick={() => setIsAddModalOpen(true)}
      >
        Add Reminder
      </button>
      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <TestForm onSubmit={handleAddReminder} />
        </Modal>
      )}

      {editReminderId && (
        <Modal onClose={() => setEditReminderId(null)}>
          <TestForm
            isEdit={true}
            reminderId={editReminderId}
            reminder={reminders.find(
              (reminder) => reminder.id === editReminderId
            )}
            onSubmit={handleUpdateReminder}
          />
        </Modal>
      )}
      {isLoading ? (
        <p>Loading reminders...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th className="tableHeader">Name</th>
              <th className="tableHeader">Date</th>
              <th className="tableHeader">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((reminder) => (
              <tr key={reminder.id}>
                <td className="tableData">{reminder.name}</td>
                <td className="tableData">{reminder.dateTime}</td>
                <td className="tableData">
                  <div className="actions">
                    <button
                      className="button editButton"
                      onClick={() => handleEditReminder(reminder.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="button deleteButton"
                      onClick={() => handleDeleteReminder(reminder.id)}
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

export default RemindersList;
