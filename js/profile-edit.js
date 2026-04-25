let userData = null;
let newImageBlob = null;

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("fileInput");
  const preview = document.getElementById("editPic");

  auth.onAuthStateChanged(async (user) => {

    if (!user) return;

    const snap = await db.collection("users").doc(user.email).get();
    userData = snap.data();

    preview.src = userData.photoURL || "/img/default-avatar.png";

    document.getElementById("usernameInput").value = userData.username;
    document.getElementById("idInput").value = userData.userId;
  });

  /* ======================
     IMAGE IMPORT + RESIZE
  ====================== */

  input.addEventListener("change", (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {

      const size = 300; // compression taille finale

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = size;
      canvas.height = size;

      /* crop centré */
      const min = Math.min(img.width, img.height);
      const sx = (img.width - min) / 2;
      const sy = (img.height - min) / 2;

      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);

      canvas.toBlob((blob) => {

        newImageBlob = blob;

        preview.src = URL.createObjectURL(blob);

      }, "image/jpeg", 0.7); // compression forte
    };

  });

});

/* ======================
   SAVE (FIX)
====================== */

async function saveProfile() {

  const user = auth.currentUser;
  if (!user || !userData) return;

  let updates = {};

  const username = document.getElementById("usernameInput").value.trim();
  const userId = document.getElementById("idInput").value.trim().toLowerCase();

  updates.username = username;
  updates.userId = userId;

  /* PHOTO */
  if (newImageBlob) {

    const ref = storage.ref("profiles/" + user.email);

    await ref.put(newImageBlob);

    const url = await ref.getDownloadURL();

    updates.photoURL = url;
  }

  /* HISTORY */
  await db.collection("users")
    .doc(user.email)
    .collection("history")
    .add({
      ...updates,
      date: new Date()
    });

  /* UPDATE */
  await db.collection("users")
    .doc(user.email)
    .update(updates);

  window.location.href = "/Dicio/profile.html?id=" + userId;
}