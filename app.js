import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 🔤 Génération pseudo unique
async function generateUsername(name) {
  let base = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  let username = base;
  let i = 1;

  while (true) {
    const q = query(collection(db, "users"), where("username", "==", username));
    const res = await getDocs(q);

    if (res.empty) return username;

    username = base + i;
    i++;
  }
}

// 🎯 Affichage UI
function render(user) {
  document.getElementById("app").innerHTML = `
    <header class="header">
      <div class="logo">Dicio</div>
      <div class="user">
        <img src="${user.photo}" />
        <span>${user.username}</span>
      </div>
    </header>

    <main class="main">
      <h1>Bienvenue ${user.username} sur Dicio !</h1>
    </main>
  `;
}

// 🔐 Auth + DB
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/Dicio/login.html";
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  let userData;

  if (!snap.exists()) {
    const username = await generateUsername(user.displayName);

    userData = {
      uid: user.uid,
      name: user.displayName,
      username: username,
      photo: user.photoURL
    };

    await setDoc(ref, userData);
  } else {
    userData = snap.data();
  }

  render(userData);
});