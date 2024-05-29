// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Import getStorage function

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtT3puRYEInb_InFq2Ep23omNmgLoisE4",
  authDomain: "elmeri-firebase.firebaseapp.com",
  databaseURL: "https://elmeri-firebase-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "elmeri-firebase",
  storageBucket: "elmeri-firebase.appspot.com",
  messagingSenderId: "31585257057",
  appId: "1:31585257057:web:6025937e038a8b9a5d8c20",
  measurementId: "G-B0LXQEJW63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const storage = getStorage(app); // Initialize Firebase Storage

export {database, storage};