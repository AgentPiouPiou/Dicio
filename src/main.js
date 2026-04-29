import { loginWithGoogle, loginWithApple } from "./auth/login.js";
import { auth } from "./firebase/firebase.config.js";
import { getRedirectResult } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =========================
   BUTTONS
========================= */
document.getElementById("login-btn")
  ?.addEventListener("click", loginWithGoogle);

document.getElementById("apple-btn")
  ?.addEventListener("click", loginWithApple);


/* =========================
   APPLE REDIRECT HANDLER
========================= */
getRedirectResult(auth)
  .then((result) => {
    if (result?.user) {
      console.log("Apple redirect user:", result.user);
      window.location.href = "/Dicio/dashboard.html";
    }
  })
  .catch((error) => {
    console.error("Redirect error:", error.code, error.message);
  });