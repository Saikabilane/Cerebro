import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebaseConfig.js";

const signupBtn = document.getElementById("signupBtn");

signupBtn?.addEventListener("click", async () => {
  const name = document.getElementById("nameInput").value;
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // ✅ Set the user's display name after sign-up
    await updateProfile(userCredential.user, {
      displayName: name
    });

    console.log("Signed up with name:", userCredential.user.displayName);
    document.getElementById("welcomeMsg").textContent = `Hi ${userCredential.user.displayName}`;
  } catch (error) {
    console.error("Signup failed:", error.message);
  }
});


function showLoader() {
    document.getElementById("loader").style.display = "flex";
    setTimeout(() => {
      document.getElementById("loader").style.display = "none"; 
    }, 6000);
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

function showToast(message) {
  const container = document.getElementById("notification-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  container.appendChild(toast);

  // Remove the toast after animation
  setTimeout(() => {
      toast.remove();
  }, 4000);
}

function showForm(formId) {
  const forms = document.querySelectorAll('.form');
  const buttons = document.querySelectorAll('.logBut');

  // Hide all forms
  forms.forEach(form => {
      form.style.display = 'none';
  });

  // Remove active class from all buttons
  buttons.forEach(btn => {
      btn.classList.remove('active');
  });

  // Show selected form and highlight the clicked button
  document.getElementById(formId).style.display = 'block';
  const activeButton = document.querySelector(`.logBut[onclick="showForm('${formId}')"]`);
  if (activeButton) {
      activeButton.classList.add('active');
  }
}

// User Login
document.querySelector("#user button").addEventListener("click", async () => {
    const email = document.querySelector("#user input[type='text']").value;
    const password = document.querySelector("#user input[type='password']").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showToast("User log in Successful");
        document.querySelector("#user input[type='text']").value = '';
        document.querySelector("#user input[type='password']").value = '';
        showLoader();
        setTimeout(() => {
          window.location.href = "./user-dashboard.html";
        }, 2000);
    } catch (error) {
        showToast("Login Failed: Username or Password is incorrect");
    }
});

// Admin Login (same logic, optional extra check)
document.querySelector("#admin button").addEventListener("click", async () => {
    const email = document.querySelector("#admin input[type='text']").value;
    const password = document.querySelector("#admin input[type='password']").value;

    if (email === 'admin' && password === 'PSG-2027-ECE') {
      showToast("Admin log in Successful");
      document.querySelector("#admin input[type='text']").value = '';
      document.querySelector("#admin input[type='password']").value = '';
      showLoader();
      setTimeout(() => {
        window.location.href = "./admin-dashboard.html";
      }, 2000);
    } else {
      showToast("Login Failed: Invalid admin credentials.");
    }
});
// Register New User
document.querySelector("#register button").addEventListener("click", async () => {
  const name = document.querySelector("#register input[type='text']").value;
  const email = document.querySelector("#register input[type='email']").value.trim();
  const password = document.querySelector("#register input[type='password']").value;

  // ✅ Email format: xx + l + xxx + @psgtech.ac.in
  const emailPattern = /^[a-zA-Z0-9]{2}l[a-zA-Z0-9]{3}@psgtech\.ac\.in$/i;
  if (!emailPattern.test(email)) {
    showToast("Login with College mail id.");
    return;
  }

  try {
    // Step 1: Create user with email & password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Set display name in Firebase Authentication
    await updateProfile(user, {
      displayName: name
    });

    // Step 3: Store user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email
    });

    // Step 4: Success
    showToast("User registered: " + name);
    document.querySelector("#register input[type='text']").value = '';
    document.querySelector("#register input[type='password']").value = '';
    document.getElementById('MailID').value = '';
    showForm('user');
  } catch (error) {
    console.error(error);
    showToast("Registration Failed: " + error.message);
  }
});
