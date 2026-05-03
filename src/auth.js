import { auth } from "./firebase/config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const provider = new GoogleAuthProvider();

/* LOGIN */
export async function loginGoogle() {
  const result = await signInWithPopup(auth, provider);

  // 🔥 redirection vers HOME ROOT
  window.location.href = "/Dicio/";
}

/* LOGOUT */
export async function logoutUser() {
  await signOut(auth);
  window.location.href = "/Dicio/login.html";
}