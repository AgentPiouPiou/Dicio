const BASE_URL = "https://agentpioupiou.github.io/dicio";

/* =========================
   UTIL
========================= */
function slugify(str){
  return str.toLowerCase().replace(/\s+/g, "");
}

function getURLId(){
  const url = new URLSearchParams(window.location.search).get("id");
  return url ? url.split("/")[0] : null;
}

function isSettingsPage(){
  return window.location.href.includes("/settings");
}

/* =========================
   LOGIN GOOGLE
========================= */
window.login = async () => {
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    const ref = db.collection("users").doc(user.uid);
    const doc = await ref.get();

    if (!doc.exists) {

      let baseId = slugify(user.displayName || "user");
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

    const id = getURLId();
    if (!id) return;

    const snap = await db.collection("users")
      .where("id", "==", id)
      .get();

    if (snap.empty) return;

    const data = snap.docs[0].data();

    document.getElementById("photo").src = data.photo;
    document.getElementById("name").innerText = data.name;
    document.getElementById("id").innerText = data.id;

    // settings visible
    if (isSettingsPage()) {
      const settings = document.getElementById("settings");
      if (settings) settings.style.display = "block";
    }
  }
});

/* =========================
   NAVIGATION PROFIL
========================= */
window.goProfile = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const doc = await db.collection("users").doc(user.uid).get();
  const id = doc.data().id;

  window.location.href = `profil.html?id=${id}`;
};

/* =========================
   SETTINGS PAGE
========================= */
window.goSettings = () => {
  const id = getURLId();
  if (!id) return;

  window.location.href = `profil.html?id=${id}/settings`;
};

/* =========================
   UPDATE PROFILE
========================= */
window.updateProfile = async () => {

  const id = getURLId();
  if (!id) return;

  const snap = await db.collection("users")
    .where("id", "==", id)
    .get();

  if (snap.empty) return;

  const doc = snap.docs[0];
  const data = doc.data();
  const uid = doc.id;

  const newName = document.getElementById("newName")?.value;
  let newId = document.getElementById("newId")?.value;
  const newPhoto = document.getElementById("newPhoto")?.value;
  const error = document.getElementById("error");

  let update = {};

  /* NAME */
  if (newName) {
    update.name = newName;
  }

  /* PHOTO */
  if (newPhoto) {
    update.photo = newPhoto;
  }

  /* ID */
  if (newId) {

    newId = slugify(newId);

    const check = await db.collection("ids").doc(newId).get();

    if (check.exists) {
      if (error) error.innerText = "❌ ID déjà pris";
      return;
    }

    // libérer ancien ID
    await db.collection("ids").doc(data.id).delete();

    // réserver nouveau
    await db.collection("ids").doc(newId).set({
      uid
    });

    update.id = newId;
  }

  await db.collection("users").doc(uid).update(update);

  location.reload();
};

/* =========================
   LOGOUT
========================= */
window.logout = () => {
  auth.signOut();
};
