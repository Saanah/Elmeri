import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, addDoc, deleteDoc, setDoc, Timestamp, query, orderBy, where} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject} from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIRESTORE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Give out database and storage
const firestoreDb = getFirestore(app);
const firebaseStorage = getStorage(app);

//Firabase storage reference
const storageRef = ref(firebaseStorage, "gs://elmeri-c72f7.appspot.com")

export { firestoreDb, storageRef, collection, getDocs, query, addDoc, orderBy, where, getDownloadURL, ref, uploadBytes, deleteObject, doc, deleteDoc, setDoc, Timestamp}