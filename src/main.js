import { loginGoogle, logoutUser } from "./auth.js";
import { auth } from "./firebase/config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* LOGIN BUTTON */
document.getElementById("google-btn")
  ?.addEventListener("click", loginGoogle);

/* LOGOUT BUTTON */
document.getElementById("logout")
  ?.addEventListener("click", logoutUser);

/* DASHBOARD USER */
onAuthStateChanged(auth, (user) => {

  if (!user && window.location.pathname.includes("dashboard")) {
    window.location.href = "index.html";
    return;
  }

  if (user) {
    document.getElementById("user-name") &&
      (document.getElementById("user-name").textContent = user.displayName);

    document.getElementById("user-email") &&
      (document.getElementById("user-email").textContent = user.email);
  }

});