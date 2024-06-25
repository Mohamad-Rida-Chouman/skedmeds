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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // User login state

  useEffect(() => {
    const auth = getAuth(app); // Get the authentication object
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Update login state based on Firebase user
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

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

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={logoutUser} />
        <div style={{ flex: 1, padding: "20px 20px 80px" }}>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? <MedicineList /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/posts"
              element={
                isLoggedIn ? <PostList /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/emergency-contacts"
              element={
                isLoggedIn ? (
                  <EmergencyContactList />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/login" element={<AuthForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
