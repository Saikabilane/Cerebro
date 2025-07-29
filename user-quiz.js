import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBCVLgeq5qH6RikgWuSR7rJk3B9kVfmCh0",
  authDomain: "cerebro-8a462.firebaseapp.com",
  projectId: "cerebro-8a462",
  storageBucket: "cerebro-8a462.appspot.com",
  messagingSenderId: "1049308363509",
  appId: "1:1049308363509:web:192d61f795435d2f81a3bc",
};

// Init Firebase services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM elements
const quizList = document.getElementById("quizList");
const nameBoard = document.getElementById("welcome");

// Main logic
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    nameBoard.textContent = "Hi Guest";
    quizList.innerHTML = "<p>🔒 Please log in to view quizzes.</p>";
    return;
  }

  let userResponses = {};

  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    console.log("Fetched user doc:", userDocSnap.exists(), userDocSnap.data());

    let displayName = "User";

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      if ("name" in userData && typeof userData.name === "string" && userData.name.trim() !== "") {
        displayName = userData.name;
      } else {
        console.warn("Name field is missing or invalid, falling back to email");
        displayName = user.email || "User";
      }
    } else {
      console.warn("User document does not exist in Firestore.");
      displayName = user.email || "User";
    }

    nameBoard.textContent = `${displayName}`;
  } catch (error) {
    console.error("Error fetching user name from Firestore:", error);
    nameBoard.textContent = `Hi ${user.email || "User"}`;
  }

  // ✅ Get completed quiz responses
  try {
    const responseRef = doc(db, "responses", user.uid);
    const responseSnap = await getDoc(responseRef);
    if (responseSnap.exists()) {
      userResponses = responseSnap.data(); // e.g. { quizId1: {...}, quizId2: {...} }
    }
  } catch (err) {
    console.warn("No existing responses found or error fetching responses.", err);
  }

  // ✅ Load quizzes and show "Completed" if done
  try {
    const snapshot = await getDocs(collection(db, "tests"));

    if (snapshot.empty) {
      quizList.innerHTML = "<p>No quizzes found.</p>";
      return;
    }

    quizList.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const quiz = docSnap.data();
      const card = document.createElement("div");
      card.className = "quiz-card";

      const startTime = quiz.startTime?.toDate?.().toLocaleString?.() || "N/A";

      const isCompleted = userResponses.hasOwnProperty(docSnap.id);

      const statusHtml = isCompleted
        ? `<div>Status: <strong style="color: gray;">🔒 Completed</strong></div>`
        : `<div>Status: <strong style="color: green;">🟢 Available</strong></div>`;

      card.innerHTML = `
        <h3>${quiz.name || docSnap.id}</h3>
        ${statusHtml}
        <small>Created on: ${startTime}</small><br/>
        <small>Duration: ${quiz.duration || "N/A"} mins</small><br/>
      `;

      const btn = document.createElement("button");
      btn.textContent = isCompleted ? "View Result" : "Start Quiz";
      btn.disabled = false;
      btn.onclick = () => {
        location.href = `student.html?quizId=${docSnap.id}`;
      };

      card.appendChild(document.createElement("br"));
      card.appendChild(btn);
      quizList.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading quizzes:", error);
    quizList.innerHTML = "<p>⚠️ Failed to load quizzes.</p>";
  }
});
