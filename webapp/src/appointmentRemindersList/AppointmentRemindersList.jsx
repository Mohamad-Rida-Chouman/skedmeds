import React, { useState, useEffect } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { app } from "../firebase";
import Modal from "../modal/Modal";
import AppointmentRemindersForm from "../appointmentRemindersForm/AppointmentRemindersForm"

const AppointmentRemindersList = () => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editReminderId, setEditReminderId] = useState(null);
  // const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(getAuth(app), async (user) => {
      if (user) {
        const userDocRef = doc(db, "webapp_users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();
        const linkedPatients = userData?.linkedPatients || []; // Handle missing data
        console.log("linkedPatients: ", linkedPatients)

        console.log("Current User Details:", userData);

        const unsubscribe = onSnapshot(collection(db, "appointments_reminder"), (snapshot) => {
          const reminderData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const filteredReminders = filterRemindersByLinkedPatients(reminderData, linkedPatients);
          console.log("filteredReminders: ", filteredReminders)
          setReminders(filteredReminders);
          setIsLoading(false);
        });

        return () => {
          unsubscribe();
        };
      }
    });

    return () => unsubscribeAuth();
  }, [db]);

  const filterRemindersByLinkedPatients = (reminders, linkedPatients) => {
    return reminders.filter((reminder) => linkedPatients.includes(reminder.userId));
  };

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
      <h2>Appointment Reminders List</h2>

      {editReminderId && (
        <Modal onClose={() => setEditReminderId(null)}>
          <AppointmentRemindersForm
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

export default AppointmentRemindersList;
