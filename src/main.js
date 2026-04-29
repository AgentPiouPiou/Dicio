import { loginGoogle } from "./auth.js";
import { auth, db } from "./firebase/config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* LOGIN BUTTON */
document.getElementById("google-btn")
?.addEventListener("click", loginGoogle);

/* LOGOUT */
document.getElementById("logout")
?.addEventListener("click", async () => {
await signOut(auth);
window.location.href = "index.html";
});

/* DASHBOARD LOAD */
onAuthStateChanged(auth, async (user) => {

if (!user) return;

const snap = await getDoc(doc(db, "users", user.uid));
const data = snap.data();

if (!data) return;

document.getElementById("pseudo").textContent = data.pseudo;
document.getElementById("username").textContent = data.username;
document.getElementById("email").textContent = data.email;
document.getElementById("phone").textContent = data.phone;
document.getElementById("gender").textContent = data.gender;
});