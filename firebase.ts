import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQkHm3baCznh-U-4FnxYT-UfKac3DN0U",
  authDomain: "budget-tracker-38ba8.firebaseapp.com",
  projectId: "budget-tracker-38ba8",
  storageBucket: "budget-tracker-38ba8.firebasestorage.app",
  messagingSenderId: "96399113962",
  appId: "1:96399113962:web:b4ce71e844bb8522512193"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
