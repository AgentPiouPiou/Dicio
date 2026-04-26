import { auth } from "../firebase/firebase.config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export async function logout() {
  await signOut(auth);
}