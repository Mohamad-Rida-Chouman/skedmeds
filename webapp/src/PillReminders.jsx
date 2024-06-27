import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getFirestore,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "./firebase"; // Import Firebase app and firestore instance

function PillReminders() {
  const [currentUser, setCurrentUser] = useState(null);
  const [linkedPatients, setLinkedPatients] = useState([]); // No need to initialize
  const [patientReminders, setPatientReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(false);

  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const fetchPillReminders = async (patientId) => {
    setLoadingReminders(true);
    try {
      const reminderCollectionRef = collection(db, "pill_reminders", patientId);
      const q = query(reminderCollectionRef, where("userId", "==", patientId));

      const querySnapshot = await getDocs(q);
      const reminders = [];
      querySnapshot.forEach((doc) => {
        reminders.push({ ...doc.data(), patientId });
      });

      setPatientReminders((prevReminders) => [...prevReminders, ...reminders]);
    } catch (error) {
      console.error("Error fetching pill reminders:", error);
    } finally {
      setLoadingReminders(false);
    }
  };

  return (
    <div>
      <h2>Pill Reminders</h2>
      {currentUser && (
        <>
          {currentUser?.data?.linkedPatients?.length > 0 && (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Medication Name</th>
                    <th>Frequency</th>
                    <th>Reminder Time</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingReminders && (
                    <tr>
                      <td colSpan="...">Loading reminders...</td>
                    </tr>
                  )}
                  {patientReminders.length === 0 && !loadingReminders && (
                    <tr>
                      <td colSpan="...">No pill reminders found.</td>
                    </tr>
                  )}
                  {patientReminders.length > 0 && !loadingReminders && (
                    currentUser?.data?.linkedPatients?.map((patientId) => (
                      <tr key={patientId}>
                        <td>
                          {linkedPatients.find((p) => p.id === patientId)?.username ||
                            "Username not found"}
                        </td>
                        <td>
                          {linkedPatients.find((p) => p.id === patientId)?.medicationName ||
                            "Username not found"}
                        </td>
                        <td>
                          {linkedPatients.find((p) => p.id === patientId)?.frequency ||
                            "Username not found"}
                        </td>
                        <td>
                          {linkedPatients.find((p) => p.id === patientId)?.reminderTime ||
                            "Username not found"}
                        </td>
                        {/* ... display pill reminder details from patientReminders */}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
          {currentUser?.data?.linkedPatients?.length === 0 && (
            <p>No linked patients yet.</p>
          )}
        </>
      )}
      {!currentUser && <p>Please log in to view reminders.</p>}
    </div>
  );
}

export default PillReminders;
