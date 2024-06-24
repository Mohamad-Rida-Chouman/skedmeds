import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav
    className="nav"
    >
      <h1 className="nav-title">SkedMeds / Admin Panel</h1>
      <ul className="nav-list">
        <li className="right-margin">
          <Link to="/" className="nav-link">
            Medicines
          </Link>
        </li>
        <li className="right-margin">
          <Link to="/posts" className="nav-link">
            Posts
          </Link>
        </li>
        <li className="right-margin">
          <Link
            to="/emergency-contacts"
            className="nav-link"
          >
            Emergency Contacts
          </Link>
        </li>
        <li>
          <Link
            to="/add-caregiver"
            className="nav-link"
          >
            Caregivers
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
