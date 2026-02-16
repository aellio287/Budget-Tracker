import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtU...",   // မင်း API key
  authDomain: "budget-tracker-7cef2.firebaseapp.com",
  projectId: "budget-tracker-7cef2",
  storageBucket: "budget-tracker-7cef2.firebasestorage.app",
  messagingSenderId: "622212622310",
  appId: "1:622212622310:web:79bb...",
  measurementId: "G-S49RGYDH2S"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
