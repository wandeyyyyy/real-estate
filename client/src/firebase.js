// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate2024.firebaseapp.com",
  projectId: "real-estate2024",
  storageBucket: "real-estate2024.appspot.com",
  messagingSenderId: "784002337048",
  appId: "1:784002337048:web:944050418c5076a2d3b66d"
};

// Initialize Firebase
export  const app = initializeApp(firebaseConfig);