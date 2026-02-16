
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoQtHm3baCznh-U-4FnxYT-UfKac3DNOU",
  authDomain: "budget-tracker-38ba8.firebaseapp.com",
  projectId: "budget-tracker-38ba8",
  storageBucket: "budget-tracker-38ba8.firebasestorage.app",
  messagingSenderId: "96399113962",
  appId: "1:96399113962:web:b4ce71e844bb8522512193",
  measurementId: "G-9CSNKFE1EH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
