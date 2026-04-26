// ==============================
// 🧠 MAIN APP
// ==============================

import {
  loginWithGoogle,
  logoutUser,
  onUserState
} from "./auth.js";

// ==============================
// BOUTONS
// ==============================

document.getElementById("loginBtn")?.addEventListener("click", loginWithGoogle);
document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);

// ==============================
// AUTH STATE
// ==============================

onUserState((user) => {

  const path = window.location.pathname;

  // 🔒 PAS CONNECTÉ
  if (!user) {
    if (!path.includes("login.html")) {
      window.location.href = "login.html";
    }
    return;
  }

  // 🔁 REDIRECTION LOGIN
  if (path.includes("login.html")) {
    window.location.href = "accueil.html";
  }

  // 🏠 ACCUEIL
  if (path.includes("accueil.html")) {
    const welcome = document.getElementById("welcome");

    if (welcome) {
      welcome.textContent = `Bienvenue ${user.username} sur Dicio !`;
    }
  }

});