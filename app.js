const BASE_URL = "https://agentpioupiou.github.io/dicio";

/* =======================
   UTILS
======================= */
function getPseudoId(user){
  return user.displayName.toLowerCase().replace(/\s+/g, "");
}

/* =======================
   LOGIN GOOGLE
======================= */
window.login = async () => {
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    const ref = db.collection("users").doc(user.uid);
    const doc = await ref.get();

    // création profil si inexistant
    if (!doc.exists) {

      let baseId = getPseudoId(user);
      let finalId = baseId;
      let i = 1;

      // ID unique
      while (true) {
        const check = await db.collection("ids").doc(finalId).get();
        if (!check.exists) break;
        finalId = baseId + i;
        i++;
      }

      // réserver ID
      await db.collection("ids").doc(finalId).set({
        uid: user.uid
      });

      // créer user
      await ref.set({
        name: user.displayName,
        photo: user.photoURL,
        id: finalId
      });
    }

    location.reload();

  } catch (e) {
    console.error(e);
    alert("Erreur login : " + e.message);
  }
};

/* =======================
   AUTH STATE
======================= */
auth.onAuthStateChanged(async user => {

  if (!user) {
    const login = document.getElementById("login");
    const home = document.getElementById("home");

    if (login) login.style.display = "block";
    if (home) home.style.display = "none";
    return;
  }

  const login = document.getElementById("login");
  const home = document.getElementById("home");

  if (login) login.style.display = "none";
  if (home) home.style.display = "block";

  /* ===== PROFIL ===== */
  if (window.location.pathname.includes("profil.html")) {

    const ref = db.collection("users").doc(user.uid);
    const data = (await ref.get()).data();

    document.getElementById("photo").src = data.photo;
    document.getElementById("name").innerText = data.name;
    document.getElementById("id").innerText = data.id;
  }
});

/* =======================
   NAVIGATION
======================= */
window.goProfile = () => {
  const user = auth.currentUser;
  if (!user) return;
  window.location.href = `profil.html?id=${user.uid}`;
};

window.logout = () => {
  auth.signOut();
};

/* =======================
   UPDATE PROFILE
======================= */
window.updateProfile = async () => {

  const user = auth.currentUser;
  if (!user) return;

  const ref = db.collection("users").doc(user.uid);
  const data = (await ref.get()).data();

  const newName = document.getElementById("newName").value;
  let newId = document.getElementById("newId").value;
  const error = document.getElementById("error");

  let update = {};

  /* ===== NAME ===== */
  if (newName) {
    update.name = newName;
  }

  /* ===== ID ===== */
  if (newId) {

    newId = newId.toLowerCase().replace(/\s+/g, "");

    const check = await db.collection("ids").doc(newId).get();

    if (check.exists) {

      error.innerText = "❌ ID déjà pris";

      // suggestion auto
      let i = 1;
      let suggestion = newId + i;

      while (true) {
        const test = await db.collection("ids").doc(suggestion).get();
        if (!test.exists) break;
        i++;
        suggestion = newId + i;
      }

      error.innerText += " → suggestion : " + suggestion;
      return;
    }

    // libérer ancien ID
    await db.collection("ids").doc(data.id).delete();

    // réserver nouveau ID
    await db.collection("ids").doc(newId).set({
      uid: user.uid
    });

    update.id = newId;
  }

  await ref.update(update);

  location.reload();
};
