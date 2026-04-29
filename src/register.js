import { auth, db } from "./firebase/config.js";
import {
GoogleAuthProvider,
signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { generateUsername } from "./user.js";

/* GOOGLE LOGIN */
export async function loginGoogle() {

const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);

await setDoc(doc(db, "users", result.user.uid), {
pseudo: result.user.displayName,
username: await generateUsername(result.user.displayName),
email: result.user.email,
provider: "google"
});

window.location.href = "dashboard.html";
}