import { auth } from "./firebase.js";

export function route() {

  auth.onAuthStateChanged((user) => {

    const path = window.location.pathname;

    const isLogin = path.includes("/login");
    const isAccueil = path.includes("acceuil");

    // PAS connecté → login
    if (!user && !isLogin) {
      window.location.href = "/Dicio/login/";
      return;
    }

    // connecté → accueil
    if (user && (isLogin || path === "/Dicio/" || path.endsWith("index.html"))) {
      window.location.href = "/Dicio/acceuil.html";
      return;
    }

  });

}
