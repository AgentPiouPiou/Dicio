import { auth } from "../firebase/firebase.config.js";

import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* GOOGLE */
const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log(result.user);
    window.location.href = "/Dicio/dashboard.html";
  } catch (error) {
    console.error("Erreur Google :", error);
  }
}

/* APPLE */
const appleProvider = new OAuthProvider("apple.com");

appleProvider.addScope("email");
appleProvider.addScope("name");

export async function loginWithApple() {
  try {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      await signInWithRedirect(auth, appleProvider);
    } else {
      const result = await signInWithPopup(auth, appleProvider);
      console.log(result.user);
      window.location.href = "/Dicio/dashboard.html";
    }

  } catch (error) {
    console.error("Erreur Apple :", error.code, error.message);
  }
}