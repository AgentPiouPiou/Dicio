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
  const menu = document.getElementById("dropdown");
  if (menu) menu.classList.remove("active");
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
   EMAIL → SAFE FIRESTORE ID
====================== */

function emailToId(email) {
  return email
    .toLowerCase()
    .replace(/\./g, "_")
    .replace(/@/g, "_at_");
}

/* ======================
   CLEAN USER ID
====================== */

function generateId(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
}

/* ======================
   UI INSTANT (IMPORTANT FIX PERF)
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
   FIRESTORE USER SAVE (EMAIL BASED)
====================== */

async function saveUserIfNeeded(user) {

  const emailId = emailToId(user.email);
  const ref = db.collection("users").doc(emailId);
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
   AUTH STATE (FIX FINAL STABLE)
====================== */

auth.onAuthStateChanged(async (user) => {

  if (!user) {
    if (!location.pathname.includes("login")) {
      location.href = "/Dicio/login.html";
    }
    return;
  }

  // ⚡ UI IMMÉDIATE (plus de lag)
  renderInstant(user);

  // ⚡ FIRESTORE BACKGROUND
  currentUserData = await saveUserIfNeeded(user);
});