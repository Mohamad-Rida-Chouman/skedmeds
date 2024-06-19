import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmergencyContactList from "./EmergencyContactList";
import PostList from "./PostList";
import MedicineList from "./MedicineList";
import Navbar from "./Navbar";
import AddCaregiver from "./AddCaregiver";

function App() {
  return (
    <Router>
      <div
        className="App"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar
          style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1 }}
        />
        <div style={{ flex: 1, padding: "20px 20px 80px" }}>
          <Routes>
            <Route path="/" element={<MedicineList />} />
            <Route
              path="/emergency-contacts"
              element={<EmergencyContactList />}
            />
            <Route path="/posts" element={<PostList />} />
            <Route path="/add-caregiver" element={<AddCaregiver />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
