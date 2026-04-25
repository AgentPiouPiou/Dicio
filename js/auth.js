import { auth, provider } from "./firebase.js";

/* LOGIN */
export function loginWithGoogle() {
  auth.signInWithPopup(provider).then(() => {
    window.location.href = "/Dicio/";
  });
}

/* LOGOUT */
export function logout() {
  auth.signOut().then(() => {
    window.location.href = "/Dicio/login/";
  });
}

/* SI DEJA CONNECTE → ACCUEIL */
export function redirectIfLogged() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      window.location.href = "/Dicio/";
    }
  });
}

/* PROTEGER PAGE */
export function protectPage(callback) {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "/Dicio/login/";
    } else {
      callback(user);
    }
  });
}
