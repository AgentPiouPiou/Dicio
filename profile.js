
auth.onAuthStateChanged(async (user) => {

  // ❌ pas connecté → login
  if (!user) {
    window.location.href = "/Dicio/login.html";
    return;
  }

  try {

    // ======================
    // FIRESTORE LOAD (EMAIL DOC)
    // ======================

    const ref = db.collection("users").doc(user.email);
    const snap = await ref.get();

    if (!snap.exists) {
      console.log("Utilisateur introuvable dans Firestore");
      return;
    }

    const data = snap.data();

    // ======================
    // DOM ELEMENTS
    // ======================

    const pic = document.getElementById("profilePic");
    const name = document.getElementById("profileName");
    const email = document.getElementById("profileEmail");
    const id = document.getElementById("profileId");

    // ======================
    // SAFE AVATAR
    // ======================

    if (pic) {
      pic.src = data.photoURL || user.photoURL;

      pic.onerror = () => {
        pic.src = "https://www.gravatar.com/avatar/?d=mp";
      };
    }

    // ======================
    // TEXT RENDER
    // ======================

    if (name) {
      name.textContent = data.username || user.displayName || "Utilisateur";
    }

    if (email) {
      email.textContent = data.email || user.email || "";
    }

    if (id) {
      id.textContent = data.userId || "ID non défini";
    }

  } catch (err) {
    console.error("Erreur profil :", err);
  }
});