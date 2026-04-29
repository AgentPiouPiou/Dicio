import { auth } from "../firebase/firebase.config.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    console.log("Login Google...");

    const result = await signInWithPopup(auth, provider);

    console.log("User :", result.user);

    window.location.href = "/dashboard.html";

  } catch (error) {
    console.error(error.code, error.message);
  }
}