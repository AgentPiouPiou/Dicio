let userData = null;

const usernameInput = document.getElementById("usernameInput");
const idInput = document.getElementById("idInput");

const usernameCount = document.getElementById("usernameCount");
const idCount = document.getElementById("idCount");

const saveBtn = document.getElementById("saveBtn");
const successMsg = document.getElementById("successMsg");

/* LOAD USER */

auth.onAuthStateChanged(async (user) => {

  if (!user) return;

  const ref = db.collection("users").doc(user.email);
  const snap = await ref.get();

  userData = snap.data();

  document.getElementById("editPic").src = userData.photoURL;

  // ✅ PRÉREMPLI
  usernameInput.value = userData.username;
  idInput.value = userData.userId;

  updateUI();
});

/* INPUT EVENTS */

usernameInput.addEventListener("input", updateUI);
idInput.addEventListener("input", updateUI);

function updateUI(){

  const username = usernameInput.value;
  const userId = idInput.value;

  usernameCount.textContent = username.length + "/12";
  idCount.textContent = userId.length + "/12";

  const changed =
    username !== userData.username ||
    userId !== userData.userId;

  const valid =
    username.length > 0 &&
    username.length <= 12 &&
    userId.length > 0 &&
    userId.length <= 12;

  saveBtn.disabled = !(changed && valid);
}

/* SAVE */

saveBtn.addEventListener("click", async () => {

  const user = auth.currentUser;
  if (!user) return;

  let newUsername = usernameInput.value.trim();
  let newUserId = idInput.value.trim().toLowerCase();

  // nettoyage ID
  newUserId = newUserId.replace(/[^a-z0-9]/g, "");

  /* CHECK ID UNIQUE */
  if (newUserId !== userData.userId) {

    const check = await db.collection("users")
      .where("userId", "==", newUserId)
      .get();

    if (!check.empty) {
      alert("ID déjà utilisé");
      return;
    }
  }

  /* HISTORY */
  await db.collection("users")
    .doc(user.email)
    .collection("history")
    .add({
      oldUsername: userData.username,
      newUsername: newUsername,
      oldUserId: userData.userId,
      newUserId: newUserId,
      date: new Date()
    });

  /* UPDATE FIREBASE */
  await db.collection("users")
    .doc(user.email)
    .update({
      username: newUsername,
      userId: newUserId
    });

  /* UI */
  successMsg.classList.add("show");

  /* UPDATE LOCAL */
  userData.username = newUsername;
  userData.userId = newUserId;

  updateUI();

  /* REDIRECT */
  setTimeout(() => {
    location.href = "/Dicio/profile.html?id=" + newUserId;
  }, 800);
});