import { auth } from "./firebase.js";

export function checkAuthAndRedirect() {
  auth.onAuthStateChanged((user) => {

    if (user) {
      window.location.href = "/Dicio/acceuil.html";
    } else {
      window.location.href = "/Dicio/login/";
    }

  });
}
