import { auth } from "../firebase/firebase.config.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Utilisateur connecté :", result.user);
  } catch (error) {
    console.error("Erreur login :", error);
  }
}