const BASE_URL = "https://agentpioupiou.github.io/Dicio";

/* =========================
   UTIL
========================= */
function slugify(str){
  return (str || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function getProfileId(){
  const id = new URLSearchParams(window.location.search).get("id");
  return id ? id.split("/")[0] : null;
}

/* =========================
   LOGIN GOOGLE
========================= */
window.login = async () => {
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    const baseId = slugify(user.displayName || "user");
    let finalId = baseId;
    let i = 1;

    // vérifier si ID existe déjà
    while (true) {
      const doc = await db.collection("users").doc(finalId).get();
      if (!doc.exists) break;
      finalId = baseId + i;
      i++;
    }

    await db.collection("users").doc(finalId).set({
      name: user.displayName,
      photo: user.photoURL,
      id: finalId
    });

    location.reload();

  } catch (e) {
    alert("Erreur login : " + e.message);
  }
};

/* =========================
   AUTH STATE
========================= */
auth.onAuthStateChanged(async user => {

  const login = document.getElementById("login");
  const home = document.getElementById("home");

  if (!user) {
    if (login) login.style.display = "block";
    if (home) home.style.display = "none";
    return;
  }

  if (login) login.style.display = "none";
  if (home) home.style.display = "block";

  /* =========================
     PROFIL PAGE
  ========================= */
  if (window.location.pathname.includes("profil.html")) {

    const id = getProfileId();
    if (!id) return;

    const doc = await db.collection("users").doc(id).get();
    if (!doc.exists) return;

    const data = doc.data();

    const photo = document.getElementById("photo");
    const name = document.getElementById("name");
    const uid = document.getElementById("id");

    if (photo) photo.src = data.photo;
    if (name) name.innerText = data.name;
    if (uid) uid.innerText = data.id;

    if (window.location.href.includes("/settings")) {
      const settings = document.getElementById("settings");
      if (settings) settings.style.display = "block";
    }
  }
});

/* =========================
   PROFIL NAVIGATION
========================= */
window.goProfile = async () => {
  const user = auth.currentUser;
  if (!user) return;

  // on récupère son doc par UID via recherche
  const snap = await db.collection("users")
    .where("name", "==", user.displayName)
    .limit(1)
    .get();

  if (snap.empty) return;

  const data = snap.docs[0].data();

  window.location.href = `profil.html?id=${data.id}`;
};

/* =========================
   SETTINGS PAGE
========================= */
window.goSettings = () => {
  const id = getProfileId();
  window.location.href = `profil.html?id=${id}/settings`;
};

/* =========================
   UPDATE PROFILE (FIX BOUTON)
========================= */
window.updateProfile = async () => {

  const id = getProfileId();
  if (!id) return;

  const ref = db.collection("users").doc(id);
  const doc = await ref.get();

  if (!doc.exists) return;

  const data = doc.data();

  const newName = document.getElementById("newName")?.value;
  const newId = document.getElementById("newId")?.value;
  const newPhoto = document.getElementById("newPhoto")?.value;
  const error = document.getElementById("error");

  let update = {};

  if (newName) update.name = newName;
  if (newPhoto) update.photo = newPhoto;

  /* =========================
     CHANGE ID
  ========================= */
  if (newId && newId !== id) {

    const clean = slugify(newId);

    const check = await db.collection("users").doc(clean).get();

    if (check.exists) {
      if (error) error.innerText = "❌ ID déjà pris";
      return;
    }

    // créer nouveau doc
    await db.collection("users").doc(clean).set({
      ...data,
      id: clean,
      name: newName || data.name,
      photo: newPhoto || data.photo
    });

    // supprimer ancien
    await db.collection("users").doc(id).delete();

    window.location.href = `profil.html?id=${clean}`;
    return;
  }

  await ref.update(update);
  location.reload();
};

/* =========================
   LOGOUT
========================= */
window.logout = () => {
  auth.signOut();
};
