import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import EmergencyContactList from "./emergencyContactList/EmergencyContactList";
import PostList from "./postList/PostList";
import MedicineList from "./medicineList/MedicineList";
import Navbar from "./navbar/Navbar";
import AuthForm from "./AuthForm"; // Import your AuthForm component
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase"; // Import your Firebase config
import RegisterForm from "./RegisterForm";
import PillRemindersList from "./pillRemindersList/PillRemindersList";
import TestReminders from "./testReminders/TestReminders";
import AppointmentRemindersList from "./appointmentRemindersList/AppointmentRemindersList";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLoginSuccess = (data, success) => {
    setIsLoggedIn(success); // Update login state based on success flag
    if (success) {
      setUserData(data); // Update user data state if login was successful
    } else {
      setUserData(null); // Reset user data on login failure
    }
  };

  const logoutUser = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      setIsLoggedIn(false); // Update local state
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle logout errors (optional: display an error message)
    }
  };

  // Check user login status on component mount
  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // Set logged in state if user object exists
      } else {
        setIsLoggedIn(false); // Set logged out state if no user object
      }
    });
  }, []); // Empty dependency array to run only on mount

  return (
    <Router>
      <div className="App">
        <Navbar
          isLoggedIn={isLoggedIn}
          handleLogout={logoutUser}
          userData={userData}
        />
        <div style={{ flex: 1, padding: "20px 20px 80px" }}>
          <Routes>
            <Route
              path="/medicines"
              element={
                isLoggedIn && userData?.role === "admin" ? (
                  <MedicineList />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/posts"
              element={
                isLoggedIn && userData?.role === "admin" ? (
                  <PostList />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/emergency-contacts"
              element={
                isLoggedIn && userData?.role === "admin" ? (
                  <EmergencyContactList />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/pill_reminders"
              element={
                isLoggedIn && userData?.role === "caregiver" ? (
                  <PillRemindersList />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/appointment_reminders"
              element={
                isLoggedIn && userData?.role === "caregiver" ? (
                  <AppointmentRemindersList />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/"
              element={<AuthForm onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/register"
              element={
                isLoggedIn && userData?.role === "admin" ? (
                  <RegisterForm />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
