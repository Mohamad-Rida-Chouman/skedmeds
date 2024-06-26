import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import { getFirestore , setDoc, doc } from "firebase/firestore";
import { app } from "./firebase"; // Import Firebase app and firestore instance

function RegisterForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("caregiver");
  const [registerErrorMessage, setRegisterErrorMessage] = useState(null);
  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered successfully:", userCredential.user);

      const newUserData = {
        email,
        role: userRole,
        uid: userCredential.user.uid,
      };

      // Add user data to Firestore with user ID as document name
      const userRef = doc(db, "webapp_users", userCredential.user.uid);
      await setDoc(userRef, newUserData);

      setEmail(""); // Clear form fields after successful registration
      setPassword("");
      setUserRole("caregiver"); // Reset role selection
      setRegisterErrorMessage("User created successfully!");
    } catch (error) {
      console.error("Registration failed:", error.message);
      setRegisterErrorMessage("An error occurred during registration. Please try again.");
    }
  };

  const handleRoleChange = (e) => {
    setUserRole(e.target.value);
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
      {registerErrorMessage && <p className="error-message">{registerErrorMessage}</p>}
    </form>
  );
}

export default RegisterForm;
