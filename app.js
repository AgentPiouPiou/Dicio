// 🔐 LOGIN GOOGLE
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then(() => {
      window.location.href = "/Dicio/";
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
}

// 🚪 LOGOUT
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "/Dicio/login.html";
  });
}

// 🔤 Générer pseudo unique
async function generateUsername(name) {
  let base = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  let username = base;
  let i = 1;

  while (true) {
    const snapshot = await db.collection("users")
      .where("username", "==", username)
      .get();

    if (snapshot.empty) return username;

    username = base + i;
    i++;
  }
}

// 🎯 UI ACCUEIL
function render(user) {
  document.getElementById("app").innerHTML = `
    <header class="header">
      <div class="logo">Dicio</div>

      <div class="profile" onclick="toggleMenu()">
        <img src="${user.photo}">
        <span>${user.username}</span>

        <div id="dropdown" class="dropdown">
          <div onclick="goProfile()">Profil</div>
          <div onclick="logout()">Déconnexion</div>
        </div>
      </div>
    </header>

    <main class="main">
      <h1>Bienvenue ${user.username} sur Dicio !</h1>
    </main>
  `;
}

// 📂 MENU
function toggleMenu() {
  const menu = document.getElementById("dropdown");
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

// 👤 PROFIL (placeholder)
function goProfile() {
  alert("Page profil bientôt disponible");
}

// 🔐 Vérification connexion
firebase.auth().onAuthStateChanged(async (user) => {

  if (!user) {
    if (!window.location.pathname.includes("login")) {
      window.location.href = "/Dicio/login.html";
    }
    return;
  }

  const ref = db.collection("users").doc(user.uid);
  const doc = await ref.get();

  let userData;

  if (!doc.exists) {
    const username = await generateUsername(user.displayName);

    userData = {
      uid: user.uid,
      name: user.displayName,
      username: username,
      photo: user.photoURL
    };

    await ref.set(userData);
  } else {
    userData = doc.data();
  }

  if (window.location.pathname.includes("login")) {
    window.location.href = "/Dicio/";
    return;
  }

  render(userData);
});