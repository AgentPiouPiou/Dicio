document.addEventListener("DOMContentLoaded", () => {

  auth.onAuthStateChanged(async (user) => {

    if (!user) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    const snap = await db.collection("users")
      .where("userId", "==", id)
      .get();

    if (snap.empty) return;

    const data = snap.docs[0].data();

    /* DATA */
    document.getElementById("profilePic").src =
      data.photoURL || "/img/default-avatar.png";

    document.getElementById("profileName").textContent = data.username;
    document.getElementById("profileId").textContent = "@" + data.userId;

    /* EDIT BTN */
    if (user.email === data.email) {
      const btn = document.getElementById("editBtn");
      btn.style.display = "flex";
      btn.onclick = () => {
        window.location.href = "/Dicio/profile-edit.html";
      };
    }

    /* STATUS FIX (temps réel) */
    const dot = document.getElementById("statusDot");

    db.collection("users")
      .doc(data.email)
      .onSnapshot((doc) => {

        const d = doc.data();

        dot.classList.remove("status-online", "status-offline");

        if (d.online) {
          dot.classList.add("status-online");
        } else {
          dot.classList.add("status-offline");
        }

      });

  });

});