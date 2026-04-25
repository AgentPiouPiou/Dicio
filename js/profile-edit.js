let userData = null;
let newImage = null;

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("fileInput");
  const preview = document.getElementById("editPic");

  auth.onAuthStateChanged(async (user) => {

    if (!user) return;

    const snap = await db.collection("users")
      .doc(user.email)
      .get();

    userData = snap.data();

    preview.src = userData.photoURL || "/img/default-avatar.png";

    document.getElementById("usernameInput").value = userData.username;
    document.getElementById("idInput").value = userData.userId;
  });

  /* IMAGE */
  input.addEventListener("change", (e) => {

    const file = e.target.files[0];
    if (!file) return;

    newImage = file;

    const reader = new FileReader();
    reader.onload = (ev) => {

      preview.src = ev.target.result;

      /* 👉 si pas carré → afficher popup */
      const img = new Image();
      img.src = ev.target.result;

      img.onload = () => {
        if (img.width !== img.height) {
          document.getElementById("cropModal").style.display = "flex";
        }
      };
    };

    reader.readAsDataURL(file);
  });

});

/* SAVE */

async function saveProfile() {

  const user = auth.currentUser;
  if (!user) return;

  let updates = {};

  const username = document.getElementById("usernameInput").value;
  const userId = document.getElementById("idInput").value;

  updates.username = username;
  updates.userId = userId;

  if (newImage) {
    const ref = storage.ref("profiles/" + user.email);
    await ref.put(newImage);
    const url = await ref.getDownloadURL();
    updates.photoURL = url;
  }

  await db.collection("users")
    .doc(user.email)
    .update(updates);

  window.location.href = "/Dicio/profile.html?id=" + userId;
}