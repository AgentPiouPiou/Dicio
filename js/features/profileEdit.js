import { auth, db, storage } from "../core/firebase.js";

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

  input?.addEventListener("change", (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const size = 300;
      canvas.width = size;
      canvas.height = size;

      const min = Math.min(img.width, img.height);
      const sx = (img.width - min) / 2;
      const sy = (img.height - min) / 2;

      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);

      canvas.toBlob((blob) => {
        newImageBlob = blob;
        preview.src = URL.createObjectURL(blob);
      }, "image/jpeg", 0.7);
    };
  });

});

window.saveProfile = async function() {

  const user = auth.currentUser;
  if (!user || !userData) return;

  let updates = {
    username: document.getElementById("usernameInput").value.trim(),
    userId: document.getElementById("idInput").value.trim().toLowerCase()
  };

  if (newImageBlob) {
    const ref = storage.ref("profiles/" + user.email);
    await ref.put(newImageBlob);
    updates.photoURL = await ref.getDownloadURL();
  }

  await db.collection("users").doc(user.email)
    .collection("history")
    .add({ ...updates, date: new Date() });

  await db.collection("users").doc(user.email).update(updates);

  location.href = "/Dicio/profile.html?id=" + updates.userId;
};
