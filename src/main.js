import { loginGoogle, logoutUser } from "./auth.js";
import { auth } from "./firebase/config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* LOGIN */
document.getElementById("google-btn")
  ?.addEventListener("click", loginGoogle);

/* AUTH */
onAuthStateChanged(auth, (user) => {

  const isLoginPage = window.location.pathname.includes("login");

  if (!user && !isLoginPage) {
    window.location.href = "/Dicio/login.html";
    return;
  }

  if (user) {

    const name = user.displayName || "Joueur";

    /* USER NAME */
    const userEl = document.getElementById("user-name");
    if (userEl) userEl.textContent = name;

    /* WELCOME */
    const messages = [
      `Bienvenue ${name}`,
      `Content de te revoir ${name}`,
      `Prêt à jouer ${name} ?`,
      `Bonne chance ${name}`,
      `Que la partie commence ${name}`
    ];

    const random = messages[Math.floor(Math.random() * messages.length)];

    const welcomeEl = document.getElementById("welcome");
    if (welcomeEl) welcomeEl.textContent = random;
  }
});

/* DROPDOWN MENU */
const userMenu = document.getElementById("user-menu");

document.getElementById("user-name")?.addEventListener("click", () => {
  userMenu?.classList.toggle("show");
});

/* LOGOUT CLICK */
document.getElementById("logout")?.addEventListener("click", logoutUser);