import { auth } from "./firebase/config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const provider = new GoogleAuthProvider();

/* LOGIN */
export async function loginGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result.user);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error(error);
  }
}

/* LOGOUT */
export async function logoutUser() {
  await signOut(auth);
  window.location.href = "index.html";
}