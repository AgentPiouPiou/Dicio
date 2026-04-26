import { observeAuth } from "./auth/authState.js";
import { redirectTo } from "./router/router.js";
import { initLoginPage } from "./pages/loginPage.js";
import { initHomePage } from "./pages/homePage.js";

const currentPage = window.location.pathname;

observeAuth((user) => {
  if (!user) {
    // Pas connecté
    if (currentPage !== "/index.html") {
      redirectTo("/index.html");
    } else {
      initLoginPage();
    }
  } else {
    // Connecté
    if (currentPage !== "/home.html") {
      redirectTo("/home.html");
    } else {
      initHomePage(user);
    }
  }
});