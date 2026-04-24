// LOGIN (si besoin plus tard)
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(() => location.reload());
}

// LOGOUT
function logout() {
  auth.signOut().then(() => {
    window.location.href = "/Dicio/login.html";
  });
}

// PROFIL (placeholder)
function goProfile() {
  alert("Page profil bientôt");
}

// DROPDOWN
const btn = document.getElementById("profileBtn");

btn.addEventListener("click", (e) => {
  e.stopPropagation();
  document.getElementById("dropdown").classList.toggle("active");
});

// fermer clic extérieur
document.addEventListener("click", () => {
  document.getElementById("dropdown").classList.remove("active");
});

// AUTH STATE
auth.onAuthStateChanged((user) => {

  if (!user) {
    window.location.href = "/Dicio/login.html";
    return;
  }

  // avatar + nom
  document.getElementById("userPhoto").src = user.photoURL;
  document.getElementById("userName").textContent = user.displayName;

  // bienvenue
  document.getElementById("welcome").textContent =
    "Bienvenue " + user.displayName + " sur Dicio";
});