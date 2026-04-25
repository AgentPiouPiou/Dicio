let currentUserData = null;

/* ================= NAV ================= */

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

/* ================= MENU ================= */

function toggleMenu(e) {
  e.stopPropagation();
  document.getElementById("dropdown")?.classList.toggle("active");
}

document.addEventListener("click", () => {
  document.getElementById("dropdown")?.classList.remove("active");
});

/* ================= AVATAR ================= */

function setAvatar(img, url) {
  if (!img) return;
  img.src = url || "/img/default-avatar.png";
}

/* ================= HEADER GLOBAL ================= */

function renderHeader(data) {
  const photo = document.getElementById("userPhoto");
  const name = document.getElementById("userName");

  if (photo) setAvatar(photo, data.photoURL);
  if (name) name.textContent = data.username || "Utilisateur";
}

/* ================= USER ================= */

async function saveUserIfNeeded(user) {
  const ref = db.collection("users").doc(user.email);
  const snap = await ref.get();

  if (snap.exists) return snap.data();

  const data = {
    email: user.email,
    username: user.displayName,
    photoURL: user.photoURL,
    userId: user.displayName.toLowerCase().replace(/\s/g, ""),
    online: true
  };

  await ref.set(data);
  return data;
}

/* ================= AUTH ================= */

auth.onAuthStateChanged(async (user) => {

  if (!user) {
    if (!location.pathname.includes("login")) {
      location.href = "/Dicio/login.html";
    }
    return;
  }

  currentUserData = await saveUserIfNeeded(user);

  const snap = await db.collection("users")
    .doc(user.email)
    .get();

  currentUserData = snap.data();

  renderHeader(currentUserData);
});