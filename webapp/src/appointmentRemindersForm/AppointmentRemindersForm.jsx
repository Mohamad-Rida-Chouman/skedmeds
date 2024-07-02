import React, { useState, useRef } from "react";
// import './reminderForm.css';

const ReminderForm = ({ reminder, isEdit, onSubmit }) => {
  const [name, setName] = useState(reminder ? reminder.name : "");
  const [dateTime, setDateTime] = useState(
    reminder ? reminder.dateTime : ""
  );


  const handleSubmit = async (e) => {
    e.preventDefault();

    const reminderData = {
      name,
      dateTime,
    };

    if (isEdit) {
      reminderData.id = reminder.id;
    }

    onSubmit(reminderData);

    setName("");
    setDateTime("");
  };

  const buttonRef = useRef(null);

  return (
    <form onSubmit={handleSubmit} className="container">
      <h2>{isEdit ? "Edit Reminder" : "Add Reminder"}</h2>
      <label className="label" htmlFor="name">
        Name:
      </label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
        required
      />
      <label className="label" htmlFor="dateTime">
        DateTime:
      </label>
      <input
        id="dateTime"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        className="input"
        required
      />

      <button type="submit" ref={buttonRef} className="button">
        {isEdit ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default ReminderForm;
