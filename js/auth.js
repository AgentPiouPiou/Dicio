import { auth, provider } from "./firebase.js";

export function loginWithGoogle() {
  auth.signInWithPopup(provider)
    .then(() => {
      window.location.href = "/Dicio/acceuil.html";
    });
}

export function logout() {
  auth.signOut().then(() => {
    window.location.href = "/Dicio/login/";
  });
}
