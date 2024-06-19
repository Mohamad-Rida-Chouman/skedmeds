import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#333",
        padding: "10px 20px",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <h1 style={{ color: "#fff", margin: 0 }}>SkedMeds / Admin Panel</h1>
      <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
        <li style={{ marginRight: "20px" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            Medicines
          </Link>
        </li>
        <li style={{ marginRight: "20px" }}>
          <Link
            to="/emergency-contacts"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Emergency Contacts
          </Link>
        </li>
        <li style={{ marginRight: "20px" }}>
          <Link to="/posts" style={{ color: "#fff", textDecoration: "none" }}>
            Posts
          </Link>
        </li>
        <li>
          <Link
            to="/add-caregiver"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Caregivers
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
