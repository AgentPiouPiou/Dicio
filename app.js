
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
   LOGIN GOOGLE
====================== */

function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("email");

  auth.signInWithPopup(provider).catch(console.error);
}

/* ======================
   DROPDOWN MENU
====================== */

function toggleMenu(e) {
  if (e) e.stopPropagation();

  const menu = document.getElementById("dropdown");
  if (menu) menu.classList.toggle("active");
}

document.addEventListener("click", () => {
  document.getElementById("dropdown")?.classList.remove("active");
});

/* ======================
   SAFE AVATAR
====================== */

function setAvatar(img, url) {
  if (!img) return;

  img.src = url || "https://www.gravatar.com/avatar/?d=mp";

  img.onerror = () => {
    img.src = "https://www.gravatar.com/avatar/?d=mp";
  };
}

/* ======================
   RENDER UI INSTANT
====================== */

function renderInstant(user) {

  requestAnimationFrame(() => {

    const photo = document.getElementById("userPhoto");
    const name = document.getElementById("userName");
    const welcome = document.getElementById("welcome");

    setAvatar(photo, user.photoURL);

    if (name) {
      name.textContent = user.displayName || "Utilisateur";
    }

    if (welcome) {
      welcome.textContent =
        "Bienvenue " + (user.displayName || "Utilisateur") + " sur Dicio";
    }
  });
}

/* ======================
   USER ID CLEAN
====================== */

function generateId(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
}

/* ======================
   FIRESTORE USER SAVE
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
    email: user.email,
    username: user.displayName,
    userId: finalId,
    photoURL: user.photoURL,
    displayName: user.displayName
  };

  await ref.set(data);
  return data;
}

/* ======================
   ICONS INJECTION
====================== */

function loadNavIcons() {
  const u = document.getElementById("icon-user");
  const l = document.getElementById("icon-logout");

  if (u) u.innerHTML = Icons.user;
  if (l) l.innerHTML = Icons.logout;
}

document.addEventListener("DOMContentLoaded", loadNavIcons);

/* ======================
   AUTH LISTENER (FAST)
====================== */

auth.onAuthStateChanged(async (user) => {

  if (!user) {
    if (!location.pathname.includes("login")) {
      location.href = "/Dicio/login.html";
    }
    return;
  }

  // UI instant
  renderInstant(user);

  // Firestore background
  currentUserData = await saveUserIfNeeded(user);
});