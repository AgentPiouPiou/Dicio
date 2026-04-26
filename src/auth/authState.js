import { auth } from "../firebase/firebase.config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function observeAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}