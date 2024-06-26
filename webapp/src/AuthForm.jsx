import React, { useState } from 'react';
import { collection, getFirestore , query, where, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase"; // Import your Firebase config
import { useNavigate } from 'react-router-dom';

function AuthForm({ onLoginSuccess }) { // Receive onLoginSuccess prop

  const navigate = useNavigate(); // Initialize useNavigate hook
  const [loginErrorMessage, setLoginErrorMessage] = useState(null); // State for login error message

  const db = getFirestore(app); // Define db outside functions

  async function getUserData(user) {
    if (!user) {
      return null;
    }

    try {
      const querySnapshot = await getDocs(query(collection(db, "webapp_users"), where("uid", "==", user.uid)));
      if (querySnapshot.size === 1) {
        const userData = querySnapshot.docs[0].data();
        userData.role = userData.role || "user"; // Set default role if not provided
        return userData; // Get user data including role
      } else {
        console.error('User data not found in Firestore');
        return null; // Or optionally set an error message in state
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      return null; // Or handle the error differently
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully:', userCredential.user);

      const user = userCredential.user; // Get the logged-in user object

      // Fetch user data including role (optional)
      const userData = await getUserData(user);

      // Pass user data and success flag to App.js through props
      onLoginSuccess(userData, true); // Call onLoginSuccess prop with data and success flag
      const userRole = userData?.role;
      navigate(userRole === "admin" ? '/medicines' : '/posts');  // Navigate based on role
 
    } catch (error) {
      console.error('Login failed:', error.message);
      setLoginErrorMessage('Invalid email or password'); // Set error message
      onLoginSuccess(null, false); // Call onLoginSuccess prop with null data and false flag
    }
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" required />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" required />
        {loginErrorMessage && <p className="error-message">{loginErrorMessage}</p>}
        <button type="submit">Login</button>

      </form>
    </div>
  );
}

export default AuthForm;
