import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { app } from "./firebase"; // Import Firebase app and firestore instance
import "./registerForm.css";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("caregiver"); // Default role
  const [registerErrorMessage, setRegisterErrorMessage] = useState(null);
  const [users, setUsers] = useState([]); // State for retrieved users
  const [selectedUsers, setSelectedUsers] = useState([]); // State for selected users

  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered successfully:", userCredential.user);

      const newUserData = {
        email,
        role: userRole,
        uid: userCredential.user.uid,
        linkedPatients: selectedUsers, // Array to store linked patient IDs
      };

      // Add user data to Firestore with user ID as document name
      const userRef = doc(db, "webapp_users", userCredential.user.uid);
      await setDoc(userRef, newUserData);

      setEmail(""); // Clear form fields after successful registration
      setPassword("");
      setUserRole("caregiver"); // Reset role to default
      setSelectedUsers([]);
      setRegisterErrorMessage("User created successfully!");
    } catch (error) {
      console.error("Registration failed:", error.message);
      setRegisterErrorMessage("An error occurred during registration. Please try again.");
    }
  };

  const handleRoleChange = (e) => {
    setUserRole(e.target.value);
  };

  // Fetch users from Firestore on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollectionRef = collection(db, "app_users");
      const q = query(usersCollectionRef); // Get all users

      try {
        const querySnapshot = await getDocs(q);
        const fetchedUsers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [db]); // Run only once on db change (optional dependency)

  const handleUserSelection = (e) => {
    const userId = e.target.value;
    const isSelected = e.target.checked;

    if (isSelected) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="role-selection">
          <label>
            <input
              type="radio"
              id="admin"
              name="role"
              value="admin"
              checked={userRole === "admin"}
              onChange={handleRoleChange}
            />
            Admin
          </label>
          <label>
            <input
              type="radio"
              id="caregiver"
              name="role"
              value="caregiver"
              checked={userRole === "caregiver"}
              onChange={handleRoleChange}
            />
            Caregiver
          </label>
        </div>
        <label htmlFor="patients">Select Patients (for Caregiver):</label>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <input
                type="checkbox"
                value={user.id}
                checked={selectedUsers.includes(user.id)}
                onChange={handleUserSelection}
                disabled={userRole === "admin"} // Disable admin selection
              />
              {user.username}
            </li>
          ))}
        </ul>
        <button type="submit">Register</button>
        {registerErrorMessage && <p className="error-message">{registerErrorMessage}</p>} {/* Display error message */}
      </form>
    </div>
  );
}
export default RegisterForm;