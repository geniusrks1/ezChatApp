import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBB4dl_VequGCTcJujYh6Ccb6qe8RqnNog",
  authDomain: "chatapp-c5fce.firebaseapp.com",
  projectId: "chatapp-c5fce",
  storageBucket: "chatapp-c5fce.appspot.com",
  messagingSenderId: "398858531443",
  appId: "1:398858531443:web:02b8a253ea8b2efb8bb006"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
