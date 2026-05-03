import { loginGoogle, logoutUser } from "./auth.js";
import { auth } from "./firebase/config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* LOGIN */
document.getElementById("google-btn")
  ?.addEventListener("click", loginGoogle);

/* AUTH STATE */
onAuthStateChanged(auth, (user) => {

  if (!user && window.location.pathname.includes("dashboard")) {
    window.location.href = "index.html";
    return;
  }

  if (user) {

    /* USER NAME */
    const name = user.displayName || "Joueur";

    document.getElementById("user-name") &&
      (document.getElementById("user-name").textContent = name);

    /* MESSAGE RANDOM */
    const messages = [
      `Bienvenue ${name} 👋`,
      `Content de te revoir ${name}`,
      `Prêt à jouer ${name} ?`,
      `Bonne chance ${name} 🎮`,
      `Que la partie commence ${name}`
    ];

    const random = messages[Math.floor(Math.random() * messages.length)];

    document.getElementById("welcome") &&
      (document.getElementById("welcome").textContent = random);
  }

});