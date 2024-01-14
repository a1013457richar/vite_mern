// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-test-58270.firebaseapp.com",
  projectId: "mern-test-58270",
  storageBucket: "mern-test-58270.appspot.com",
  messagingSenderId: "911548836386",
  appId: "1:911548836386:web:0f99b19721ab97624bb87b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);