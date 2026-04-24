let currentUserData = null;

/* ======================
   NAVIGATION
====================== */

function goHome() {
  window.location.href = "/Dicio/";
}

function goProfile() {
  window.location.href = "/Dicio/profile.html";
}

function logout() {
  auth.signOut().then(() => {
    window.location.href = "/Dicio/login.html";
  });
}

/* ======================
   LOGIN
====================== */

function login() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider).catch(console.error);
}

/* ======================
   ID UNIQUE SIMPLE
====================== */

function generateId(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
}

/* ======================
   FIRESTORE (background only)
====================== */

async function saveUserIfNeeded(user) {
  const ref = db.collection("users").doc(user.uid);
  const snap = await ref.get();

  if (snap.exists) return snap.data();

  const baseId = generateId(user.displayName);

  const all = await db.collection("users").get();

  let finalId = baseId;
  let i = 1;

  all.forEach(doc => {
    if (doc.data().userId === finalId) {
      finalId = baseId + i;
      i++;
    }
  });

  const data = {
    username: user.displayName,
    userId: finalId,
    photoURL: user.photoURL,
    displayName: user.displayName
  };

  await ref.set(data);
  return data;
}

/* ======================
   UI IMMÉDIATE (IMPORTANT FIX)
====================== */

function renderInstant(user) {

  const photo = document.getElementById("userPhoto");
  const name = document.getElementById("userName");
  const welcome = document.getElementById("welcome");

  if (photo) photo.src = user.photoURL;
  if (name) name.textContent = user.displayName;
  if (welcome) welcome.textContent = "Bienvenue " + user.displayName + " sur Dicio";
}

/* ======================
   AUTH LISTENER (FIX LAG)
====================== */

auth.onAuthStateChanged(async (user) => {

  if (!user) {
    if (!location.pathname.includes("login")) {
      location.href = "/Dicio/login.html";
    }
    return;
  }

  // ⚡ 1. AFFICHAGE IMMÉDIAT (Google Auth direct)
  renderInstant(user);

  // ⚡ 2. FIRESTORE EN ARRIÈRE-PLAN (non bloquant UI)
  currentUserData = await saveUserIfNeeded(user);
});