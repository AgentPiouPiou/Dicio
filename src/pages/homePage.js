import { logout } from "../auth/logout.js";

export function initHomePage(user) {
  const welcome = document.getElementById("welcome");
  const logoutBtn = document.getElementById("logout-btn");

  welcome.textContent = `Bienvenue ${user.displayName} sur Dicio !`;

  logoutBtn.addEventListener("click", () => {
    logout();
  });
}