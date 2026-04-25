let userData = null;
let newFile = null;

/* ======================
   HEADER
====================== */

function renderHeader(data) {
  document.getElementById("userPhoto").src = data.photoURL;
  document.getElementById("userName").textContent = data.username;
}

function goHome() {
  window.location.href = "/Dicio/";
}

/* ======================
   INIT USER
====================== */

auth.onAuthStateChanged(async (user) => {

  if (!user) {
    window.location.href = "/Dicio/login.html";
    return;
  }

  const ref = db.collection("users").doc(user.email);
  const snap = await ref.get();

  if (!snap.exists) return;

  userData = snap.data();

  renderHeader(userData);

  /* preload inputs */
  document.getElementById("usernameInput").value = userData.username || "";
  document.getElementById("idInput").value = userData.userId || "";

  document.getElementById("editPic").src = userData.photoURL || "/img/default-avatar.png";
});

/* ======================
   IMAGE PREVIEW
====================== */

document.getElementById("fileInput").addEventListener("change", (e) => {

  const file = e.target.files[0];
  if (!file) return;

  newFile = file;

  const reader = new FileReader();

  reader.onload = (ev) => {
    document.getElementById("editPic").src = ev.target.result;
  };

  reader.readAsDataURL(file);
});

/* ======================
   SAVE PROFILE
====================== */

document.getElementById("saveBtn").addEventListener("click", async () => {

  const user = auth.currentUser;
  if (!user || !userData) return;

  let username = document.getElementById("usernameInput").value.trim();
  let userId = document.getElementById("idInput").value.trim().toLowerCase();

  const updates = {};

  /* ======================
     USERNAME (MAX 20)
  ====================== */

  if (username) {
    username = username.slice(0, 20);

    if (username !== userData.username) {
      updates.username = username;
    }
  }

  /* ======================
     USER ID CLEAN + UNIQUE
  ====================== */

  if (userId) {

    userId = userId
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20);

    if (userId !== userData.userId) {

      const check = await db.collection("users")
        .where("userId", "==", userId)
        .get();

      if (!check.empty) {
        alert("ID déjà utilisé");
        return;
      }

      updates.userId = userId;
    }
  }

  /* ======================
     PHOTO UPLOAD
  ====================== */

  if (newFile) {

    const storageRef = storage.ref("profiles/" + user.email);

    await storageRef.put(newFile);

    const url = await storageRef.getDownloadURL();

    updates.photoURL = url;
  }

  /* ======================
     NO CHANGE
  ====================== */

  if (Object.keys(updates).length === 0) return;

  /* ======================
     HISTORY FIRESTORE
  ====================== */

  await db.collection("users")
    .doc(user.email)
    .collection("history")
    .add({
      ...updates,
      date: firebase.firestore.FieldValue.serverTimestamp()
    });

  /* ======================
     UPDATE USER
  ====================== */

  await db.collection("users")
    .doc(user.email)
    .set(updates, { merge: true });

  /* ======================
     UPDATE LOCAL STATE
  ====================== */

  userData = {
    ...userData,
    ...updates
  };

  renderHeader(userData);

  /* ======================
     SUCCESS FEEDBACK
  ====================== */

  const msg = document.getElementById("successMsg");
  msg.classList.add("show");

  setTimeout(() => {
    window.location.href = "/Dicio/profile.html?id=" + userData.userId;
  }, 800);
});