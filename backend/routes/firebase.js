// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgT_vtMDx77mY7ZUvvT6j_WLTORlg95pI",
  authDomain: "smart-club-and-event-system.firebaseapp.com",
  projectId: "smart-club-and-event-system",
  storageBucket: "smart-club-and-event-system.firebasestorage.app",
  messagingSenderId: "207154061909",
  appId: "1:207154061909:web:1a7ec109e3155815e06adc",
  measurementId: "G-0CFD059TVX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);