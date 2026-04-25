auth.onAuthStateChanged(async (user) => {

  if (!user) {
    location.href = "/Dicio/login.html";
    return;
  }

  const params = new URLSearchParams(location.search);
  const userId = params.get("id");

  const snap = await db.collection("users")
    .where("userId", "==", userId)
    .get();

  if (snap.empty) return;

  const data = snap.docs[0].data();

  document.getElementById("profilePic").src = data.photoURL;
  document.getElementById("profileName").textContent = data.username;
  document.getElementById("profileId").textContent = data.userId;

  // header
  document.getElementById("userPhoto").src = user.photoURL;
  document.getElementById("userName").textContent = user.displayName;

  // bouton modifier si c'est toi
  if (user.email === data.email) {
    const btn = document.getElementById("editBtn");
    btn.style.display = "flex";

    btn.onclick = () => {
      location.href = "/Dicio/profile-edit.html";
    };
  }
});

function loadProfile(userEmail) {

  db.collection("users").doc(userEmail)
    .onSnapshot((doc) => {

      const data = doc.data();

      document.getElementById("profilePic").src = data.photoURL;

      const dot = document.getElementById("statusDot");

      if (!dot) return;

      if (data.online) {
        dot.className = "status-dot status-online";
      } else {
        dot.className = "status-dot status-offline";
      }
    });
}