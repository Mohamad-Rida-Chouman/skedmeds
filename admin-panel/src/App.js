import React from "react";
// import MedicineList from "./MedicineList"; // Import your MedicineList component
import PostList from "./PostList";
import EmergencyContactList from "./EmergencyContactList";

function App() {
  return (
    <div className="App">
      {/* <h1>Medicine Admin Panel</h1> */}
      <EmergencyContactList /> {/* Render the MedicineList component */}
    </div>
  );
}

export default App;
