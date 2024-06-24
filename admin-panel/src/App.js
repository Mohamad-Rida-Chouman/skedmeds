import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmergencyContactList from "./emergencyContactList/EmergencyContactList";
import PostList from "./postList/PostList";
import MedicineList from "./medicineList/MedicineList";
import Navbar from "./navbar/Navbar";
import AddCaregiver from "./AddCaregiver";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar
          style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1 }}
        />
        <div style={{ flex: 1, padding: "20px 20px 80px" }}>
          <Routes>
            <Route path="/" element={<MedicineList />} />
            <Route path="/posts" element={<PostList />} />
            <Route
              path="/emergency-contacts"
              element={<EmergencyContactList />}
            />
            <Route path="/add-caregiver" element={<AddCaregiver />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
