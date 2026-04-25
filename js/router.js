import { auth } from "./firebase.js";

export function route() {

  auth.onAuthStateChanged((user) => {

    const path = window.location.pathname;

    if (!user && !path.includes("login")) {
      window.location.href = "/Dicio/login/";
      return;
    }

    if (user && (path.includes("login") || path === "/Dicio/" || path.endsWith("index.html"))) {
      window.location.href = "/Dicio/acceuil.html";
      return;
    }

  });

}
