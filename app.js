/* =====================
   NAVIGATION
===================== */
function go(page){
  window.location.href = "/Dicio/" + page;
}

/* =====================
   LOGIN GOOGLE
===================== */
window.login = async () => {
  const res = await auth.signInWithPopup(provider);
  const user = res.user;

  const id = user.displayName.toLowerCase().replace(/\s/g,"");

  const doc = await db.collection("users").doc(id).get();

  if(!doc.exists){
    await db.collection("users").doc(id).set({
      name: user.displayName,
      photo: user.photoURL,
      id
    });
  }

  window.location.href = "/Dicio/index.html";
};

/* =====================
   LOGOUT
===================== */
window.logout = async () => {
  await auth.signOut();
  window.location.href = "/Dicio/login.html";
};

/* =====================
   MENU TOGGLE
===================== */
window.toggleMenu = () => {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
};

/* =====================
   AUTH CHECK (IMPORTANT)
===================== */
auth.onAuthStateChanged(async user => {

  const path = window.location.pathname;

  /* SI PAS CONNECTÉ -> LOGIN */
  if(!user && !path.includes("login")){
    window.location.href = "/Dicio/login.html";
    return;
  }

  /* SI CONNECTÉ ET SUR LOGIN -> INDEX */
  if(user && path.includes("login")){
    window.location.href = "/Dicio/index.html";
    return;
  }

  /* CHARGER USER SUR INDEX */
  if(user && document.getElementById("username")){

    const id = user.displayName.toLowerCase().replace(/\s/g,"");

    const doc = await db.collection("users").doc(id).get();
    const data = doc.data();

    document.getElementById("username").innerText = data.name;
    document.getElementById("pp").src = data.photo;
  }
});
