import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// REVA Campus Lost & Found Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAhM7XZoBpDnl07DuMvjzdezBJZMMjdvM",
  authDomain: "reva-lost-and-found.firebaseapp.com",
  projectId: "reva-lost-and-found",
  storageBucket: "reva-lost-and-found.firebasestorage.app",
  messagingSenderId: "667638862723",
  appId: "1:667638862723:web:885502a6bd7ba3ef215cb6",
  measurementId: "G-G858GRME1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, query, orderBy, serverTimestamp };