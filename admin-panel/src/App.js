import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmergencyContactList from "./EmergencyContactList";
import PostList from "./PostList";
import MedicineList from "./MedicineList";
import Navbar from "./Navbar"; // Import your Navbar component

function App() {
  return (
    <Router>
      <div
        className="App"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar />
        <div style={{ flex: 1, padding: "20px" }}>
          {" "}
          {/* Content container */}
          <Routes>
            <Route path="/" element={<MedicineList />} />
            <Route
              path="/emergency-contacts"
              element={<EmergencyContactList />}
            />
            <Route path="/posts" element={<PostList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
