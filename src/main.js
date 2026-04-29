import { loginWithGoogle, loginWithApple } from "./auth/login.js";

const googleBtn = document.getElementById("login-btn");
const appleBtn = document.getElementById("apple-btn");

if (googleBtn) {
  googleBtn.addEventListener("click", loginWithGoogle);
}

if (appleBtn) {
  appleBtn.addEventListener("click", loginWithApple);
}