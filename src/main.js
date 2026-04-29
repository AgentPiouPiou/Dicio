import { loginWithGoogle } from "./auth/login.js";

const btn = document.getElementById("login-btn");

if (btn) {
  btn.addEventListener("click", () => {
    loginWithGoogle();
  });
}