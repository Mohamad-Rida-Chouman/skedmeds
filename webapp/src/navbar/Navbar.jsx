import "./navbar.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, handleLogout }) => {


  const navigate = useNavigate();

  return (
    <nav className="nav">
      <h1 className="nav-title">SkedMeds / Admin Panel</h1>
      <ul className="nav-list">
        <li className="right-margin">
          {isLoggedIn ? (
            <Link to="/" className="nav-link">
              Medicines
            </Link>
          ) : (
            <span className="nav-link-disabled">Medicines</span>
          )}
        </li>
        <li className="right-margin">
          {isLoggedIn ? (
            <Link to="/posts" className="nav-link">
              Posts
            </Link>
          ) : (
            <span className="nav-link-disabled">Posts</span>
          )}
        </li>
        <li className="right-margin">
          {isLoggedIn ? (
            <Link to="/emergency-contacts" className="nav-link">
              Emergency Contacts
            </Link>
          ) : (
            <span className="nav-link-disabled">Emergency Contacts</span>
          )}
        </li>
        <li>
          {isLoggedIn ? (
            <Link to="/add-caregiver" className="nav-link">
              Caregivers
            </Link>
          ) : (
            <span className="nav-link-disabled">Caregivers</span>
          )}
        </li>
        <li>
        {isLoggedIn ? (
          <button className="nav-link" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="nav-link" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </li>
      </ul>
    </nav>
  );
};

export default Navbar;
