import React, { useState, useRef } from "react";

const PillRemindersForm = ({ reminder, isEdit, onSubmit }) => {
  const [medicationName, setMedicationName] = useState(reminder ? reminder.medicationName : "");
  const [reminderTime, setReminderTime] = useState(
    reminder ? reminder.reminderTime : ""
  );
  const [frequency, setFrequency] = useState(
    parseInt(reminder ? reminder.frequency : 0)
  );


  const handleSubmit = async (e) => {
    e.preventDefault();

    const reminderData = {
      medicationName,
      reminderTime,
      frequency,
    };

    if (isEdit) {
      reminderData.id = reminder.id;
    }

    onSubmit(reminderData);

    setMedicationName("");
    setReminderTime("");
    setFrequency(0);
  };

  const buttonRef = useRef(null);

  return (
    <form onSubmit={handleSubmit} className="container">
      <h2>{isEdit ? "Edit Reminder" : "Add Reminder"}</h2>
      <label className="label" htmlFor="medicationName">
        Name:
      </label>
      <input
        type="text"
        id="medicationName"
        value={medicationName}
        onChange={(e) => setMedicationName(e.target.value)}
        className="input"
        required
      />
      <label className="label" htmlFor="reminderTime">
        Reminder Time:
      </label>
      <input
        id="reminderTime"
        value={reminderTime}
        onChange={(e) => setReminderTime(e.target.value)}
        className="input"
        required
      />
      <label className="label" htmlFor="frequency">
        Frequency:
      </label>
      <input
        id="frequency"
        value={frequency}
        onChange={(e) =>  setFrequency(parseInt(e.target.value))}
        className="input"
        type="number"
        required
      />

      <button type="submit" ref={buttonRef} className="button">
        {isEdit ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default PillRemindersForm;
