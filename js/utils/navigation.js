import { currentUserData } from "../core/auth.js";
import { auth } from "../core/firebase.js";

export function goHome() {
  window.location.href = "/Dicio/";
}

export function goProfile() {
  if (!currentUserData) return;
  window.location.href = "/Dicio/profile.html?id=" + currentUserData.userId;
}

export function logout() {
  auth.signOut().then(() => {
    window.location.href = "/Dicio/login.html";
  });
}
