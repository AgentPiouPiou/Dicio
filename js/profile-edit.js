
let userData = null;
let newFile = null;

/* ================= HEADER ================= */

function renderHeader(data){
  document.getElementById("userPhoto").src = data.photoURL;
  document.getElementById("userName").textContent = data.username;
}

function goHome(){
  window.location.href = "/Dicio/";
}

/* ================= INIT ================= */

auth.onAuthStateChanged(async (user) => {

  if (!user) return;

  const ref = db.collection("users").doc(user.email);
  const snap = await ref.get();

  userData = snap.data();

  renderHeader(userData);

  // preload inputs
  document.getElementById("usernameInput").value = userData.username;
  document.getElementById("idInput").value = userData.userId;

  document.getElementById("editPic").src = userData.photoURL;
});

/* ================= IMAGE ================= */

document.getElementById("fileInput").addEventListener("change", (e) => {
  newFile = e.target.files[0];

  if (!newFile) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    document.getElementById("editPic").src = ev.target.result;
  };

  reader.readAsDataURL(newFile);
});

/* ================= SAVE ================= */

document.getElementById("saveBtn").addEventListener("click", async () => {

  const user = auth.currentUser;
  if (!user) return;

  let username = document.getElementById("usernameInput").value.trim();
  let userId = document.getElementById("idInput").value.trim().toLowerCase();

  userId = userId.replace(/[^a-z0-9]/g, "");

  const updates = {};

  /* USERNAME */
  if (username && username !== userData.username) {
    updates.username = username;
  }

  /* ID UNIQUE */
  if (userId && userId !== userData.userId) {

    const check = await db.collection("users")
      .where("userId", "==", userId)
      .get();

    if (!check.empty) {
      alert("ID déjà utilisé");
      return;
    }

    updates.userId = userId;
  }

  /* PHOTO UPLOAD */
  if (newFile) {

    const storageRef = storage.ref("profiles/" + user.email);
    await storageRef.put(newFile);

    const url = await storageRef.getDownloadURL();
    updates.photoURL = url;
  }

  if (Object.keys(updates).length === 0) return;

  /* 🔥 HISTORIQUE */
  await db.collection("users")
    .doc(user.email)
    .collection("history")
    .add({
      ...updates,
      date: new Date()
    });

  /* UPDATE USER */
  await db.collection("users")
    .doc(user.email)
    .update(updates);

  /* REFRESH HEADER GLOBAL */
  userData = { ...userData, ...updates };
  renderHeader(userData);

  document.getElementById("successMsg").style.opacity = 1;

  setTimeout(() => {
    window.location.href = "/Dicio/profile.html?id=" + userData.userId;
  }, 800);
});