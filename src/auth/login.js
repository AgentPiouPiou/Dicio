import { auth } from "../firebase/firebase.config.js";

import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ======================
   GOOGLE
====================== */
const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    window.location.href = "/Dicio/dashboard.html";
  } catch (error) {
    console.error("Google error:", error.code);
  }
}

/* ======================
   APPLE (FIX STABLE)
====================== */
const appleProvider = new OAuthProvider("apple.com");

appleProvider.addScope("email");
appleProvider.addScope("name");

export async function loginWithApple() {
  try {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 🔥 FIX IMPORTANT : Apple stable = redirect uniquement
    await signInWithRedirect(auth, appleProvider);

  } catch (error) {
    console.error("Apple error:", error.code);
  }
}