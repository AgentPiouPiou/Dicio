let profileData = null;

/* GET ID */
function getProfileId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

/* LOAD PROFILE */
async function loadProfile(user) {

  const id = getProfileId();

  if (!id) {
    const snap = await db.collection("users").doc(user.email).get();
    profileData = snap.data();
  } else {
    const snap = await db.collection("users")
      .where("userId", "==", id)
      .get();

    if (snap.empty) {
      alert("Profil introuvable");
      return;
    }

    profileData = snap.docs[0].data();
  }

  renderProfile(user);
}

/* RENDER */
function renderProfile(user) {

  const pic = document.getElementById("profilePic");
  const name = document.getElementById("profileName");
  const id = document.getElementById("profileId");
  const editBtn = document.getElementById("editBtn");

  pic.src = profileData.photoURL || "/img/default-avatar.png";
  name.textContent = profileData.username;
  id.textContent = "@" + profileData.userId;

  if (user.email === profileData.email) {
    editBtn.style.display = "flex";
    editBtn.onclick = () => {
      window.location.href = "/Dicio/profile-edit.html";
    };
  }
}

/* AUTH */
auth.onAuthStateChanged(async (user) => {

  if (!user) {
    location.href = "/Dicio/login.html";
    return;
  }

  const snap = await db.collection("users").doc(user.email).get();
  renderHeader(snap.data());

  await loadProfile(user);
});