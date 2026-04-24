let currentUserData = null;

/* NAVIGATION */
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

/* LOGIN */
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

/* MENU */
function toggleMenu(e) {
  e.stopPropagation();
  document.getElementById("dropdown")?.classList.toggle("active");
}

document.addEventListener("click", () => {
  document.getElementById("dropdown")?.classList.remove("active");
});

/* AVATAR */
function setAvatar(img, url) {
  if (!img) return;
  img.src = url || "/img/default-avatar.png";
}

/* UI HEADER */
function renderHeader(user) {
  setAvatar(document.getElementById("userPhoto"), user.photoURL);
  const name = document.getElementById("userName");
  if (name) name.textContent = user.displayName;
}

/* FIRESTORE */
async function saveUserIfNeeded(user) {
  const ref = db.collection("users").doc(user.email);
  const snap = await ref.get();

  if (snap.exists) return snap.data();

  const data = {
    email: user.email,
    username: user.displayName,
    displayName: user.displayName,
    photoURL: user.photoURL,
    userId: user.displayName.replace(/\s/g, "")
  };

  await ref.set(data);
  return data;
}

/* AUTH FLOW */
auth.onAuthStateChanged(async (user) => {

  if (!user) {
    if (!location.pathname.includes("login")) {
      location.href = "/Dicio/login.html";
    }
    return;
  }

  if (location.pathname.includes("login")) {
    location.href = "/Dicio/";
    return;
  }

  renderHeader(user);
  currentUserData = await saveUserIfNeeded(user);
});