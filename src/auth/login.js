import { auth } from "../firebase/firebase.config.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
  }
}