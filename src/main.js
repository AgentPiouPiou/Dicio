import { loginGoogle, logoutUser } from "./auth.js";
import { auth } from "./firebase/config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* LOGIN */
document.getElementById("google-btn")
  ?.addEventListener("click", loginGoogle);

/* AUTH */
onAuthStateChanged(auth, (user) => {

  const isLogin = window.location.pathname.includes("/login");

  if (!user && !isLogin) {
    window.location.href = "/Dicio/login";
    return;
  }

  if (user) {

    const name = user.displayName || "Joueur";

    /* BOUTON USER */
    const btn = document.getElementById("user-btn");
    if (btn) btn.textContent = name;

    /* MESSAGE */
    const messages = [
      `Bienvenue ${name}`,
      `Content de te revoir ${name}`,
      `Prêt à jouer ${name} ?`,
      `Bonne chance ${name}`,
      `Que la partie commence ${name}`
    ];

    const random = messages[Math.floor(Math.random() * messages.length)];

    const welcome = document.getElementById("welcome");
    if (welcome) welcome.textContent = random;
  }

});

/* DROPDOWN */
const btn = document.getElementById("user-btn");
const menu = document.getElementById("user-menu");

btn?.addEventListener("click", () => {
  menu?.classList.toggle("show");
});

/* LOGOUT */
document.getElementById("logout")
  ?.addEventListener("click", logoutUser);