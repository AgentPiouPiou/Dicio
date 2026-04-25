let currentUserData = null;

/* ======================
   NAVIGATION
====================== */

function goHome() {
  window.location.href = "/Dicio/";
}

function goProfile() {
  if (!currentUserData) return;
  window.location.href = "/Dicio/profile.html?id=" + currentUserData.userId;
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
  auth.signInWithPopup(provider);
}

/* ======================
   MENU
====================== */

function toggleMenu(e) {
  e.stopPropagation();
  document.getElementById("dropdown")?.classList.toggle("active");
}

document.addEventListener("click", () => {
  document.getElementById("dropdown")?.classList.remove("active");
});

/* ======================
   ICONS
====================== */

function loadIcons() {
  const userIcon = document.getElementById("icon-user");
  const logoutIcon = document.getElementById("icon-logout");

  if (userIcon) userIcon.innerHTML = Icons.user;
  if (logoutIcon) logoutIcon.innerHTML = Icons.logout;
}

document.addEventListener("DOMContentLoaded", loadIcons);

/* ======================
   AVATAR
====================== */

function setAvatar(img, url) {
  if (!img) return;

  img.src = url || "/img/default-avatar.png";

  img.onerror = () => {
    img.src = "/img/default-avatar.png";
  };
}

/* ======================
   HEADER
====================== */

function renderHeader(user) {
  setAvatar(document.getElementById("userPhoto"), user.photoURL);

  const name = document.getElementById("userName");
  if (name) name.textContent = user.displayName || "Utilisateur";
}

/* ======================
   WELCOME
====================== */

function renderWelcome(user) {
  const welcome = document.getElementById("welcome");

  if (welcome) {
    const name = user.displayName || "Utilisateur";
    welcome.textContent = `Bienvenue ${name} sur Dicio !`;
  }
}

/* ======================
   USER ID UNIQUE
====================== */

async function generateUniqueUserId(name) {

  let base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  let id = base;
  let i = 1;

  while (true) {
    const snap = await db.collection("users")
      .where("userId", "==", id)
      .get();

    if (snap.empty) break;

    id = base + i;
    i++;
  }

  return id;
}

/* ======================
   FIRESTORE
====================== */

async function saveUserIfNeeded(user) {

  const ref = db.collection("users").doc(user.email);
  const snap = await ref.get();

  if (snap.exists) return snap.data();

  const userId = await generateUniqueUserId(user.displayName);

  const data = {
    email: user.email,
    username: user.displayName,
    displayName: user.displayName,
    photoURL: user.photoURL,
    userId: userId
  };

  await ref.set(data);
  return data;
}

/* ======================
   AUTH FLOW
====================== */

auth.onAuthStateChanged(async (user) => {

  if (!user) {
    if (!location.pathname.includes("login")) {
      location.href = "/Dicio/login.html";
    }
    return;
  }

  renderHeader(user);
  renderWelcome(user);

  currentUserData = await saveUserIfNeeded(user);
});