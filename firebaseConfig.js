import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBCVLgeq5qH6RikgWuSR7rJk3B9kVfmCh0",
    authDomain: "cerebro-8a462.firebaseapp.com",
    projectId: "cerebro-8a462",
    storageBucket: "cerebro-8a462.firebasestorage.app",
    messagingSenderId: "1049308363509",
    appId: "1:1049308363509:web:192d61f795435d2f81a3bc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
