import { db } from "./firebase/config.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function generateUsername(pseudo) {

let base = pseudo.toLowerCase().replace(/\s/g, "_");
let username = base;

while (true) {

const q = query(collection(db, "users"), where("username", "==", username));
const snap = await getDocs(q);

if (snap.empty) break;

username = base + "_" + Math.floor(Math.random() * 9999);
}

return username;
}