import { auth } from "../firebase/firebase.config.js";

import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =========================
   GOOGLE LOGIN
========================= */
const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    console.log("Login Google...");

    const result = await signInWithPopup(auth, googleProvider);

    console.log("User Google :", result.user);

    window.location.href = "/Dicio/dashboard.html";

  } catch (error) {
    console.error("Erreur Google :", error.code, error.message);
  }
}


/* =========================
   APPLE LOGIN
========================= */
const appleProvider = new OAuthProvider("apple.com");

// optionnel (mais recommandé)
appleProvider.addScope("email");
appleProvider.addScope("name");

export async function loginWithApple() {
  try {
    console.log("Login Apple...");

    const result = await signInWithPopup(auth, appleProvider);

    console.log("User Apple :", result.user);

    window.location.href = "/Dicio/dashboard.html";

  } catch (error) {
    console.error("Erreur Apple :", error.code, error.message);
  }
}