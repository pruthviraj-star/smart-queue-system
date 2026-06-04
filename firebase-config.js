import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJTJfalMBqFK6J8kbZLDzMFv-nKJpduso",
  authDomain: "smart-queue-system-4610f.firebaseapp.com",
  projectId: "smart-queue-system-4610f",
  storageBucket: "smart-queue-system-4610f.firebasestorage.app",
  messagingSenderId: "111782943300",
  appId: "1:111782943300:web:028513d6f7f35cc0973a11"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);