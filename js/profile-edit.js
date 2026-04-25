
let userData = null;
let newImageFile = null;

/* LOAD USER */

auth.onAuthStateChanged(async (user) => {

  if (!user) return;

  const ref = db.collection("users").doc(user.email);
  const snap = await ref.get();

  userData = snap.data();

  document.getElementById("editPic").src = userData.photoURL;

  document.getElementById("usernameInput").placeholder = userData.username;
  document.getElementById("idInput").placeholder = userData.userId;
});

/* IMAGE SELECT */

function selectImage(){
  document.getElementById("fileInput").click();
}

document.getElementById("fileInput").addEventListener("change", (e)=>{
  const file = e.target.files[0];
  if (!file) return;

  newImageFile = file;

  // preview instantané
  const reader = new FileReader();
  reader.onload = (e)=>{
    document.getElementById("editPic").src = e.target.result;
  };
  reader.readAsDataURL(file);
});

/* SAVE */

async function save(){

  const user = auth.currentUser;
  if (!user) return;

  let username = document.getElementById("usernameInput").value.trim();
  let userId = document.getElementById("idInput").value.trim();

  const updates = {};

  /* USERNAME */
  if (username && username.length <= 12) {
    updates.username = username;
  }

  /* USER ID */
  if (userId && userId.length <= 12) {

    userId = userId.toLowerCase().replace(/[^a-z0-9]/g, "");

    // vérif unicité
    const check = await db.collection("users")
      .where("userId", "==", userId)
      .get();

    if (!check.empty && userId !== userData.userId) {
      alert("ID déjà utilisé");
      return;
    }

    updates.userId = userId;
  }

  /* IMAGE UPLOAD */
  if (newImageFile) {

    const ref = storage.ref().child("profiles/" + user.email);

    await ref.put(newImageFile);

    const url = await ref.getDownloadURL();

    updates.photoURL = url;
  }

  /* SI RIEN */
  if (Object.keys(updates).length === 0) {
    alert("Aucune modification");
    return;
  }

  /* HISTORY */
  await db.collection("users")
    .doc(user.email)
    .collection("history")
    .add({
      oldData: userData,
      date: new Date()
    });

  /* UPDATE */
  await db.collection("users")
    .doc(user.email)
    .update(updates);

  /* REDIRECT */
  location.href = "/Dicio/profile.html?id=" + (updates.userId || userData.userId);
}