import { loginWithGoogle } from "../auth/login.js";

export function initLoginPage() {
  const btn = document.getElementById("login-btn");

  btn.addEventListener("click", () => {
    loginWithGoogle();
  });
}