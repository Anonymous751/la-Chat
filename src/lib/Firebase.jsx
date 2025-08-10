import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; //

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchatapp-b085b.firebaseapp.com",
  projectId: "reactchatapp-b085b",
  storageBucket: "reactchatapp-b085b.firebasestorage.app",
  messagingSenderId: "675392340294",
  appId: "1:675392340294:web:6aa774b84569393bede547",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const rtdb = getDatabase(); // ✅
