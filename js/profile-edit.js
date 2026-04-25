let userData = null;

/* INIT */
auth.onAuthStateChanged(async (user) => {

  if (!user) {
    location.href = "/Dicio/login.html";
    return;
  }

  const snap = await db.collection("users").doc(user.email).get();
  userData = snap.data();

  renderHeader(userData);

  document.getElementById("usernameInput").value = userData.username;
  document.getElementById("idInput").value = userData.userId;
  document.getElementById("editPic").src = userData.photoURL;
});

/* SAVE */
document.getElementById("saveBtn").onclick = async () => {

  const user = auth.currentUser;

  let username = document.getElementById("usernameInput").value.trim();
  let userId = document.getElementById("idInput").value.trim().toLowerCase();

  userId = userId.replace(/[^a-z0-9]/g, "");

  await db.collection("users").doc(user.email).update({
    username,
    userId
  });

  window.location.href = "/Dicio/profile.html?id=" + userId;
};