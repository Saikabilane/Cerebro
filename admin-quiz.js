import { db } from './firebaseConfig.js';
import { doc, setDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function showToast(msg) {
  const container = document.getElementById("notification-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

window.generateQuestions = function () {
  const count = parseInt(document.getElementById("questionCount").value);
  const form = document.getElementById("questionsForm");
  form.innerHTML = "";

  for (let i = 0; i < count; i++) {
    form.innerHTML += `
      <div class="question-block">
        <h4>Question ${i + 1}</h4>
        <input type="text" placeholder="Question Text" class="q-text" /><br><br>
        <input type="text" placeholder="Option A" class="optA" />
        <input type="text" placeholder="Option B" class="optB" />
        <input type="text" placeholder="Option C" class="optC" />
        <input type="text" placeholder="Option D" class="optD" /><br><br>
        <select class="correct">
          <option value="" disabled selected>Select Correct Answer</option>
          <option value="A">Option A</option>
          <option value="B">Option B</option>
          <option value="C">Option C</option>
          <option value="D">Option D</option>
        </select>
      </div>`;
  }
};

window.submitQuiz = async function () {
  const name = document.getElementById("testName").value;
  const start = document.getElementById("startTime").value;
  const duration = parseInt(document.getElementById("duration").value);
  const blocks = document.querySelectorAll(".question-block");

  if (!name || !start || !duration || blocks.length === 0) {
    showToast("Please fill all fields.");
    return;
  }

  const questions = [];
  blocks.forEach(block => {
    const q = block.querySelector(".q-text").value;
    const a = block.querySelector(".optA").value;
    const b = block.querySelector(".optB").value;
    const c = block.querySelector(".optC").value;
    const d = block.querySelector(".optD").value;
    const correct = block.querySelector(".correct").value;

    questions.push({
      question: q,
      options: [a, b, c, d],
      correctAnswer: { A: a, B: b, C: c, D: d }[correct]
    });
  });

  const startTime = Timestamp.fromDate(new Date(start));

  const testRef = doc(db, "tests", name.replace(/\s+/g, '_'));

  await setDoc(testRef, {
    name,
    startTime,
    duration,
    questions
  });

  showToast("Test successfully created!");
};
