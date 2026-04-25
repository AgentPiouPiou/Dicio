import { auth } from "./firebase.js";
import { saveUserIfNeeded } from "../features/user.js";
import { renderHeader } from "../ui/header.js";

export let currentUserData = null;

auth.onAuthStateChanged(async (user) => {

  if (!user) {
    if (!location.pathname.includes("login")) {
      location.href = "/Dicio/login.html";
    }
    return;
  }

  currentUserData = await saveUserIfNeeded(user);
  renderHeader(currentUserData);

});
