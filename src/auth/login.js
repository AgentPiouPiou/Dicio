import { auth } from "../firebase/firebase.config.js";

import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =========================
   GOOGLE LOGIN
========================= */
const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    console.log("Google user:", result.user);

    window.location.href = "/Dicio/dashboard.html";

  } catch (error) {
    console.error("Google error:", error.code, error.message);
  }
}


/* =========================
   APPLE LOGIN (FIX STABLE)
========================= */
const appleProvider = new OAuthProvider("apple.com");

appleProvider.addScope("email");
appleProvider.addScope("name");

export async function loginWithApple() {
  try {

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 📱 MOBILE → redirect obligatoire (Apple stable)
    if (isMobile) {
      await signInWithRedirect(auth, appleProvider);
      return;
    }

    // 💻 DESKTOP → popup
    const result = await signInWithPopup(auth, appleProvider);

    console.log("Apple user:", result.user);

    window.location.href = "/Dicio/dashboard.html";

  } catch (error) {
    console.error("Apple error:", error.code, error.message);
  }
}