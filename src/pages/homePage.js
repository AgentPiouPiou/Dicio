import { logout } from "../auth/logout.js";

export function initHomePage(user) {
  const welcome = document.getElementById("welcome");
  const logoutBtn = document.getElementById("logout-btn");

  if (welcome) {
    welcome.textContent = `Bienvenue ${user.displayName} sur Dicio !`;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout();
    });
  }
}