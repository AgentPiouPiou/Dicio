import { observeAuth } from "./auth/authState.js";
import { goTo, isOn } from "./router/router.js";
import { initLoginPage } from "./pages/loginPage.js";
import { initHomePage } from "./pages/homePage.js";

observeAuth((user) => {
  // ❌ PAS CONNECTÉ
  if (!user) {
    if (!isOn("index.html")) {
      goTo("/index.html");
      return;
    }

    // On est sur la bonne page
    initLoginPage();
    return;
  }

  // ✅ CONNECTÉ
  if (!isOn("home.html")) {
    goTo("/home.html");
    return;
  }

  // On est sur la bonne page
  initHomePage(user);
});