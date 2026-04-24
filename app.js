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

// 🎯 Affichage accueil
function render(user) {
  document.getElementById("app").innerHTML = `
    <header class="header">
      <div class="logo">Dicio</div>

      <div class="user">
        <img src="${user.photo}">
        <span>${user.username}</span>
      </div>
    </header>

    <main class="main">
      <h1>Bienvenue ${user.username} sur Dicio !</h1>
    </main>
  `;
}

// 🔐 Vérification connexion
firebase.auth().onAuthStateChanged(async (user) => {

  // ❌ PAS CONNECTÉ
  if (!user) {
    if (!window.location.pathname.includes("login")) {
      window.location.href = "/Dicio/login.html";
    }
    return;
  }

  // 🔎 Vérifie base
  const ref = db.collection("users").doc(user.uid);
  const doc = await ref.get();

  let userData;

  // 🆕 CRÉATION COMPTE
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

  // 🏠 Affichage seulement sur index
  if (window.location.pathname.includes("login")) {
    window.location.href = "/Dicio/";
    return;
  }

  render(userData);
});