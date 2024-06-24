import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAhT1DALG29Y0le1ecE_0FmOB4o7xmzjzE",
  authDomain: "skedmeds-v2.firebaseapp.com",
  projectId: "skedmeds-v2",
  storageBucket: "skedmeds-v2.appspot.com",
  messagingSenderId: "367102815721",
  appId: "1:367102815721:web:0c443185a7f6dc67f5ef78",
  measurementId: "G-YBGWE869QD",
};

const app = initializeApp(firebaseConfig);

export { app };
