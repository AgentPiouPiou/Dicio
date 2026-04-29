import { loginWithGoogle, loginWithApple } from "./auth/login.js";
import { auth } from "./firebase/firebase.config.js";
import { getRedirectResult } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// boutons
document.getElementById("login-btn")?.addEventListener("click", loginWithGoogle);
document.getElementById("apple-btn")?.addEventListener("click", loginWithApple);

// gestion retour Apple mobile
getRedirectResult(auth)
  .then((result) => {
    if (result?.user) {
      console.log("Retour Apple :", result.user);
      window.location.href = "/Dicio/dashboard.html";
    }
  })
  .catch(console.error);