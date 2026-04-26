import { loginWithGoogle } from "../auth/login.js";

export function initLoginPage() {
  const btn = document.getElementById("login-btn");

  if (!btn) return;

  btn.addEventListener("click", () => {
    loginWithGoogle();
  });
}