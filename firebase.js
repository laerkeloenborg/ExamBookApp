// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFW1JBCYMORaQWKEPEsBX35TbhtQwxXu4",
  authDomain: "bookapp-fc266.firebaseapp.com",
  projectId: "bookapp-fc266",
  storageBucket: "bookapp-fc266.firebasestorage.app",
  messagingSenderId: "664617534907",
  appId: "1:664617534907:web:00eae2cedf6abb9eb7309e",
  measurementId: "G-G714YQ4FP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app) 
export const storage = getStorage(app)