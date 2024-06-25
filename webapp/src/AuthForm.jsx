import React, { useState, } from 'react';
import { collection, doc, getFirestore , query, where, getDocs, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase"; // Import your Firebase config
import { useNavigate } from 'react-router-dom';

function AuthForm() {

  const navigate = useNavigate(); // Initialize useNavigate hook
  const [isRegister, setIsRegister] = useState(false);
  const [userData, setUserData] = useState(null); // State for user data
  const [loginErrorMessage, setLoginErrorMessage] = useState(null); // State for login error message
  const [userRole, setUserRole] = useState('caregiver'); // State for user role

  const db = getFirestore(app); // Define db outside functions

  async function getUserData(user) {
    if (!user) {
      return null; // Handle case where user object is not available
    }

    try {
      const querySnapshot = await getDocs(query(collection(db, "webapp_users"), where("uid", "==", user.uid)));
      if (querySnapshot.size === 1) {
        return querySnapshot.docs[0].data(); // Get user data
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
  
      const userData = await getUserData(user);
      if (userData) {
        setUserData(userData); // Update user data state
        console.log('Retrieved user data:', userData);
        // Check user role and navigate accordingly
        if (userData.role === 'admin') {
            navigate('/medicines'); // Navigate to medicines page for admin
          } else {
            navigate('/posts'); // Navigate to posts page for caregiver
          }
      } else {
        console.error('User data not found or error fetching data');
        setLoginErrorMessage('An error occurred. Please try again.'); // Set error message
      }
  
    } catch (error) {
      console.error('Login failed:', error.message);
      setLoginErrorMessage('Invalid email or password'); // Set error message
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered successfully:', userCredential.user);
  
      const user = userCredential.user; // Get the newly created user object
  
      const userData = {
        uid: user.uid, // Use the user's unique ID
        email,
        role: userRole, // Use the selected user role
      };
  
      const docRef = doc(collection(db, "webapp_users"), user.uid); // Use the defined db instance
  
      await setDoc(docRef, userData); // Set user data in the newly created document
      console.log('User data saved successfully');
      // Check user role and navigate accordingly
      if (userData.role === 'admin') {
        navigate('/medicines'); // Navigate to medicines page for admin
      } else {
        navigate('/posts'); // Navigate to posts page for caregiver
      }
    } catch (error) {
      console.error('Registration failed:', error.message);
      setLoginErrorMessage('An error occurred during registration. Please try again.'); // Set error message
    }
  };
  

  const toggleRegister = () => {
    setIsRegister(!isRegister);
  };

  const handleRoleChange = (e) => {
    setUserRole(e.target.value);
  };

  return (
    <div className="auth-form">
      {isRegister ? (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" required />
          
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" required />
          <div className="role-selection">
            <label>
              <input
                type="radio"
                id="admin"
                name="role"
                value="admin"
                checked={userRole === 'admin'}
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
                checked={userRole === 'caregiver'}
                onChange={handleRoleChange}
              />
              Caregiver
            </label>
          </div>
          <button type="submit">Register</button>
          <p>
            Already a user? <span onClick={toggleRegister}>Login</span>
          </p>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" required />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" required />
          {loginErrorMessage && <p className="error-message">{loginErrorMessage}</p>}
          <button type="submit">Login</button>
          <p>
            Not a user? <span onClick={toggleRegister}>Register</span>
          </p>
        </form>
      )}
    </div>
  );
}

export default AuthForm;
