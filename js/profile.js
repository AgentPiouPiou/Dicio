auth.onAuthStateChanged(async (user) => {

  if (!user) {
    window.location.href = "/Dicio/login.html";
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");

  if (!userId) {
    document.body.innerHTML = "<h1>Profil introuvable</h1>";
    return;
  }

  try {
    const snap = await db.collection("users")
      .where("userId", "==", userId)
      .get();

    if (snap.empty) {
      document.body.innerHTML = "<h1>Utilisateur introuvable</h1>";
      return;
    }

    const data = snap.docs[0].data();

    // HEADER
    const headerName = document.getElementById("userName");
    const headerPhoto = document.getElementById("userPhoto");

    if (headerName) headerName.textContent = user.displayName;
    if (headerPhoto) headerPhoto.src = user.photoURL;

    // PROFIL
    document.getElementById("profilePic").src = data.photoURL;
    document.getElementById("profileName").textContent = data.username;
    document.getElementById("profileId").textContent = data.userId;

  } catch (e) {
    console.error(e);
  }
});