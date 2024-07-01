import React, { useState, useRef } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage functions
import { app } from "../firebase";
// import './reminderForm.css';

const ReminderForm = ({ reminder, isEdit, onSubmit }) => {
  const [name, setName] = useState(reminder ? reminder.name : "");
  const [date, setDate] = useState(
    reminder ? reminder.date : ""
  );


  const handleSubmit = async (e) => {
    e.preventDefault();

    const reminderData = {
      name,
      date,
    };

    if (isEdit) {
      reminderData.id = reminder.id;
    }

    onSubmit(reminderData);

    setName("");
    setDate("");
  };

  const handleChangePrice = (e) => {
    const priceAsNumber = parseFloat(e.target.value);
    setPrice(priceAsNumber);
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
      <label className="label" htmlFor="description">
        Description:
      </label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input descriptionInput"
        required
      />
      <label className="label" htmlFor="price">
        Price:
      </label>
      <input
        type="number"
        id="price"
        value={price}
        onChange={handleChangePrice}
        className="input"
        required
      />
      <label className="label" htmlFor="image">
        Image:
      </label>
      <input
        type="file"
        id="image"
        onChange={handleChangeImage}
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
