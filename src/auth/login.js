import { auth } from "../firebase/firebase.config.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// const provider = new GoogleAuthProvider();

// export async function loginWithGoogle() {
//   try {
//     await signInWithPopup(auth, provider);
//   } catch (error) {
//     console.error(error);
//   }
// }


export async function loginWithGoogle() {
  try {
    console.log("Tentative login Google...");
    const result = await signInWithPopup(auth, provider);
    console.log("User connecté :", result.user);
  } catch (error) {
    console.error("Erreur login Google :", error.code, error.message);
  }
}
