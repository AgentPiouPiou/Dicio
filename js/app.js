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

  const user = auth.currentUser;

  if (user) {
    db.collection("users").doc(user.email).set({
      online: false,
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }

  auth.signOut().then(() => {
    window.location.href = "/Dicio/login.html";
  });
}

/* ======================
   LOGIN GOOGLE
====================== */

function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

/* ======================
   MENU DROPDOWN
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
   AVATAR SAFE
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

function renderHeader(data) {

  const photo = document.getElementById("userPhoto");
  const name = document.getElementById("userName");

  if (photo) setAvatar(photo, data.photoURL);
  if (name) name.textContent = data.username || "Utilisateur";
}

/* ======================
   WELCOME
====================== */

function renderWelcome(data) {

  const welcome = document.getElementById("welcome");

  if (welcome) {
    welcome.textContent = `Bienvenue ${data.username} sur Dicio !`;
  }
}

/* ======================
   USER ID UNIQUE
====================== */

async function generateUniqueUserId(name) {

  let base = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (!base) base = "user";

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
   CREATE USER IF NOT EXISTS
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
    userId: userId,
    online: true,
    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
  };

  await ref.set(data);

  return data;
}

/* ======================
   ONLINE STATUS FIX
====================== */

function setOnlineStatus(state) {

  const user = auth.currentUser;
  if (!user) return;

  return db.collection("users").doc(user.email).set({
    online: state,
    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
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

  // création si besoin
  currentUserData = await saveUserIfNeeded(user);

  // récupération Firestore (source unique)
  const snap = await db.collection("users").doc(user.email).get();
  currentUserData = snap.data();

  // UI
  renderHeader(currentUserData);
  renderWelcome(currentUserData);

  // ONLINE = TRUE
  await setOnlineStatus(true);
});

/* ======================
   OFFLINE CLEAN EXIT
====================== */

window.addEventListener("beforeunload", () => {

  const user = auth.currentUser;
  if (!user) return;

  db.collection("users").doc(user.email).set({
    online: false,
    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
});