auth.onAuthStateChanged(async (user) => {

  if (!user) {
    window.location.href = "/Dicio/login.html";
    return;
  }

  try {
    const doc = await db.collection("users").doc(user.email).get();

    if (!doc.exists) {
      console.log("User introuvable");
      return;
    }

    const data = doc.data();

    // DOM
    const pic = document.getElementById("profilePic");
    const name = document.getElementById("profileName");
    const email = document.getElementById("profileEmail");
    const id = document.getElementById("profileId");

    if (pic) pic.src = data.photoURL;
    if (name) name.textContent = data.username;
    if (email) email.textContent = data.email;
    if (id) id.textContent = data.userId;

  } catch (e) {
    console.error(e);
  }
});