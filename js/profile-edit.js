let userData = null;
let newImage = null;

auth.onAuthStateChanged(async (user) => {

  const ref = db.collection("users").doc(user.email);
  const snap = await ref.get();

  userData = snap.data();

  document.getElementById("editPic").src = userData.photoURL;

  document.getElementById("usernameInput").placeholder = userData.username;
  document.getElementById("idInput").placeholder = userData.userId;
});

/* IMAGE */

function selectImage(){
  document.getElementById("fileInput").click();
}

document.getElementById("fileInput").addEventListener("change", (e)=>{
  newImage = e.target.files[0];
});

/* SAVE */

async function save(){

  const user = auth.currentUser;

  let username = document.getElementById("usernameInput").value;
  let userId = document.getElementById("idInput").value;

  const updates = {};

  if (username && username.length <= 12) {
    updates.username = username;
  }

  if (userId && userId.length <= 12) {
    updates.userId = userId.toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  // historique
  await db.collection("users").doc(user.email)
    .collection("history")
    .add({
      oldData: userData,
      date: new Date()
    });

  await db.collection("users").doc(user.email).update(updates);

  location.href = "/Dicio/profile.html?id=" + (updates.userId || userData.userId);
}