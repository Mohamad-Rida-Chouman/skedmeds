import React, { useState, useRef } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage functions
import { app } from "../firebase";
import './medicineForm.css';

const MedicineForm = ({ medicine, isEdit, onSubmit }) => {
  const [name, setName] = useState(medicine ? medicine.name : "");
  const [description, setDescription] = useState(
    medicine ? medicine.description : ""
  );
  const [price, setPrice] = useState(medicine ? medicine.price : "");
  const [image, setImage] = useState(null);

  const handleChangeImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const medicineData = {
      name,
      description,
      price,
    };

    if (isEdit) {
      medicineData.id = medicine.id;
    }

    // Image upload logic
    if (image) {
      const storageRef = ref(getStorage(app), `medicines/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);
      medicineData.imageUrl = imageUrl;
    }

    onSubmit(medicineData);

    setName("");
    setDescription("");
    setPrice(0);
    setImage(null);
  };

  const handleChangePrice = (e) => {
    const priceAsNumber = parseFloat(e.target.value);
    setPrice(priceAsNumber);
  };

  const buttonRef = useRef(null);

  return (
    <form onSubmit={handleSubmit} className="container">
      <h2>{isEdit ? "Edit Medicine" : "Add Medicine"}</h2>
      <label className="label" htmlFor="name">
        Name:
      </label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="input"
      />
      <label className="label" htmlFor="description">
        Description:
      </label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input descriptionInput"
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
      />
      <label className="label" htmlFor="image">
        Image:
      </label>
      <input
        type="file"
        id="image"
        onChange={handleChangeImage}
        className="input"
      />

      <button type="submit" ref={buttonRef} className="button">
        {isEdit ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default MedicineForm;
