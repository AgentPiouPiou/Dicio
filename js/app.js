// ==============================
// 🧠 FICHIER PRINCIPAL
// ==============================

// Import fonctions auth
import {
  loginWithGoogle,
  logoutUser,
  onUserState
} from "./auth.js";

// ==============================
// 📍 DÉTECTION DE LA PAGE
// ==============================

// On récupère le nom de la page actuelle
const path = window.location.pathname;

// ==============================
// 🔘 BOUTON LOGIN
// ==============================
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    loginWithGoogle();
  });
}

// ==============================
// 🔘 BOUTON LOGOUT
// ==============================
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logoutUser();
  });
}

// ==============================
// 👀 SURVEILLANCE UTILISATEUR
// ==============================
onUserState((user) => {

  // ==========================
  // 📄 PAGE INDEX
  // ==========================
  if (path.includes("index.html") || path === "/") {
    if (user) {
      window.location.href = "accueil.html";
    } else {
      window.location.href = "login.html";
    }
  }

  // ==========================
  // 📄 PAGE LOGIN
  // ==========================
  if (path.includes("login.html")) {
    if (user) {
      window.location.href = "accueil.html";
    }
  }

  // ==========================
  // 📄 PAGE ACCUEIL
  // ==========================
  if (path.includes("accueil.html")) {

    // Si pas connecté → interdit
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Sinon on affiche le pseudo
    const welcome = document.getElementById("welcome");

    if (welcome) {
      welcome.textContent = `Bienvenue ${user.displayName} sur Dicio !`;
    }
  }

});