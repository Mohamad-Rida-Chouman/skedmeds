import "./navbar.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, handleLogout, userData }) => {
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <h1 className="nav-title">SkedMeds / Admin Panel</h1>
      <ul className="nav-list">
        <li className="right-margin">
          {isLoggedIn ? (
            <Link to="/medicines" className="nav-link">
              Medicines
            </Link>
          ) : (
            <span className="nav-link-disabled invisible">Medicines</span>
          )}
        </li>
        <li className="right-margin">
          {isLoggedIn ? (
            <Link to="/posts" className="nav-link">
              Posts
            </Link>
          ) : (
            <span className="nav-link-disabled invisible">Posts</span>
          )}
        </li>
        <li className="right-margin">
          {isLoggedIn ? (
            <Link to="/emergency-contacts" className="nav-link">
              Emergency Contacts
            </Link>
          ) : (
            <span className="nav-link-disabled invisible">Emergency Contacts</span>
          )}
        </li>
        <li className="right-margin">
          {isLoggedIn && userData?.role === "admin" ? (
            <Link to="/register" className="nav-link">
              Register
            </Link>
          ) : (
            <span className="nav-link-disabled invisible">Register</span>
          )}
        </li>
        <li>
          {isLoggedIn ? (
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="nav-button invisible">
              Logout
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
