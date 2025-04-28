import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0hk-30IzVlN7yDZA9fcnDDlY22L2VwTE",
  authDomain: "atemate-d140d.firebaseapp.com",
  projectId: "atemate-d140d",
  storageBucket: "atemate-d140d.appspot.com",
  messagingSenderId: "288066861446",
  appId: "1:288066861446:web:4e4ddb2974617654639407",
  measurementId: "G-GCQDF6JPBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth & Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
