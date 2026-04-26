import { auth } from "../firebase/firebase.config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export async function logout() {
  try {
    await signOut(auth);
    console.log("Déconnecté");
  } catch (error) {
    console.error("Erreur logout :", error);
  }
}