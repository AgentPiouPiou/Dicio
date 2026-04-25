let userData = null;

const input = document.getElementById("usernameInput");
const saveBtn = document.getElementById("saveBtn");
const charCount = document.getElementById("charCount");
const successMsg = document.getElementById("successMsg");

/* LOAD USER */

auth.onAuthStateChanged(async (user) => {

  if (!user) return;

  const ref = db.collection("users").doc(user.email);
  const snap = await ref.get();

  userData = snap.data();

  document.getElementById("editPic").src = userData.photoURL;

  input.value = userData.username;

  updateUI();
});

/* INPUT LOGIC */

input.addEventListener("input", updateUI);

function updateUI(){

  const value = input.value;

  charCount.textContent = value.length + "/12";

  // active bouton si changement
  if (value !== userData.username && value.length > 0 && value.length <= 12){
    saveBtn.disabled = false;
  } else {
    saveBtn.disabled = true;
  }
}

/* SAVE */

saveBtn.addEventListener("click", async () => {

  const user = auth.currentUser;
  if (!user) return;

  const newUsername = input.value.trim();

  if (!newUsername || newUsername.length > 12) return;

  /* historique */
  await db.collection("users")
    .doc(user.email)
    .collection("history")
    .add({
      oldUsername: userData.username,
      newUsername: newUsername,
      date: new Date()
    });

  /* update */
  await db.collection("users")
    .doc(user.email)
    .update({
      username: newUsername
    });

  /* UI feedback */
  successMsg.classList.add("show");

  userData.username = newUsername;
  updateUI();

  /* retour auto */
  setTimeout(() => {
    location.href = "/Dicio/profile.html?id=" + userData.userId;
  }, 800);
});