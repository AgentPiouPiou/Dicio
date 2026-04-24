// 🔐 LOGIN
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then(() => {
      window.location.href = "/Dicio/";
    })
    .catch((error) => {
      alert(error.message);
    });
}

// 🚪 LOGOUT
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "/Dicio/login.html";
  });
}

// 🔍 Vérification utilisateur
firebase.auth().onAuthStateChanged((user) => {

  // ❌ pas connecté → login
  if (!user) {
    if (!window.location.pathname.includes("login")) {
      window.location.href = "/Dicio/login.html";
    }
    return;
  }

  // ✅ connecté → accueil
  if (window.location.pathname.includes("login")) {
    window.location.href = "/Dicio/";
    return;
  }

  // 🎯 Affichage nom + photo
  const div = document.getElementById("user");

  if (div) {
    div.innerHTML = `
      <h2>${user.displayName}</h2>
      <img src="${user.photoURL}">
    `;
  }

});