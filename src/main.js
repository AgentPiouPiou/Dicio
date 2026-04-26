import { observeAuth } from "./auth/authState.js";
import { redirectTo, getCurrentPath } from "./router/router.js";
import { initLoginPage } from "./pages/loginPage.js";
import { initHomePage } from "./pages/homePage.js";

const currentPath = getCurrentPath();

observeAuth((user) => {
  // 🔒 Utilisateur NON connecté
  if (!user) {
    if (currentPath !== "/index.html") {
      redirectTo("/index.html");
    } else {
      initLoginPage();
    }
    return;
  }

  // ✅ Utilisateur connecté
  if (currentPath !== "/home.html") {
    redirectTo("/home.html");
  } else {
    initHomePage(user);
  }
});