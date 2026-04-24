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
   USER ID UNIQUE
====================== */

function generateId(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
}

/* ======================
   CREATE / GET USER
====================== */

async function createOrGetUser(user) {
  const ref = db.collection("users").doc(user.uid);
  const snap = await ref.get();

  if (!snap.exists) {
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

  return snap.data();
}

/* ======================
   HEADER RENDER
====================== */

function renderHeader(data) {
  const photo = document.getElementById("userPhoto");
  const name = document.getElementById("userName");
  const welcome = document.getElementById("welcome");

  if (photo) photo.src = data.photoURL;
  if (name) name.textContent = data.username;
  if (welcome) welcome.textContent = "Bienvenue " + data.username + " sur Dicio";
}

/* ======================
   DROPDOWN MENU
====================== */

document.addEventListener("click", () => {
  document.getElementById("dropdown")?.classList.remove("active");
});

function toggleMenu(e) {
  e.stopPropagation();
  document.getElementById("dropdown").classList.toggle("active");
}

/* ======================
   AUTH LISTENER OPTIMISÉ
====================== */

auth.onAuthStateChanged(async (user) => {

  if (!user) {
    if (!location.pathname.includes("login")) {
      location.href = "/Dicio/login.html";
    }
    return;
  }

  currentUserData = await createOrGetUser(user);

  renderHeader(currentUserData);
});

/* ======================
   ICONS LOAD
====================== */

function loadIcons() {
  document.getElementById("icon-user").innerHTML = Icons.user;
  document.getElementById("icon-logout").innerHTML = Icons.logout;
}

document.addEventListener("DOMContentLoaded", loadIcons);