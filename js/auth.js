// ==============================
// 🔐 GESTION AUTHENTIFICATION
// ==============================

// Import auth depuis firebase.js
import { auth } from "./firebase.js";

// Import fonctions Firebase Auth
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Création du provider Google
const provider = new GoogleAuthProvider();

// ==============================
// 🔑 CONNEXION GOOGLE
// ==============================
export function loginWithGoogle() {
  // On lance la popup Google
  signInWithPopup(auth, provider)
    .then(() => {
      // Une fois connecté → redirection
      window.location.href = "accueil.html";
    })
    .catch((error) => {
      console.error("Erreur de connexion :", error);
    });
}

// ==============================
// 🚪 DÉCONNEXION
// ==============================
export function logoutUser() {
  signOut(auth)
    .then(() => {
      // Une fois déconnecté → retour login
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Erreur de déconnexion :", error);
    });
}

// ==============================
// 👤 SURVEILLANCE UTILISATEUR
// ==============================
export function onUserState(callback) {
  // Permet d'exécuter du code quand l'utilisateur change
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}