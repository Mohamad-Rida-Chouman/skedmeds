import React from "react";
import MedicineList from "./MedicineList"; // Import your MedicineList component

function App() {
  return (
    <div className="App">
      <h1>Medicine Admin Panel</h1>
      <MedicineList /> {/* Render the MedicineList component */}
    </div>
  );
}

export default App;
