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
} from "firebase/firestore";
import { app } from "./firebase"; // Import Firebase app and firestore instance

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("caregiver");
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
        linkedCaregivers: [], // Array to store linked caregiver IDs
      };

      // Add user data to Firestore with user ID as document name
      const userRef = doc(db, "webapp_users", userCredential.user.uid);
      await setDoc(userRef, newUserData);

      setEmail(""); // Clear form fields after successful registration
      setPassword("");
      setUserRole("caregiver");
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

  const handleLinkUsers = async () => {
    if (!selectedUsers.length) {
      return; // No users selected, do nothing
    }

    const caregiverId = localStorage.getItem("caregiverId"); // Assuming caregiver ID is stored in localStorage

    for (const userId of selectedUsers) {
      const userRef = doc(db, "app_users", userId);
      try {
        await updateDoc(userRef, {
          linkedCaregivers: [...new Set([...userRef.data().linkedCaregivers, caregiverId])],
        });
      } catch (error) {
        console.error("Error linking user:", error);
      }
    }

    setSelectedUsers([]); // Clear selected users after linking
    console.log("Successfully linked users to caregiver!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
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
      <button type="submit">Register</button>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <input
                  type="checkbox"
                  value={user.id}
                  checked={selectedUsers.includes(user.id)}
                  onChange={handleUserSelection}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" onClick={handleLinkUsers} disabled={!selectedUsers.length}>
        Link Selected Users
      </button>
      {registerErrorMessage && <p className="error-message">{registerErrorMessage}</p>}
    </form>
  );
}

export default RegisterForm;
