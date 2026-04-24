/* =========================
   LOGIN GOOGLE
========================= */
function login(){
  auth.signInWithPopup(provider);
}

/* =========================
   AUTH CHECK GLOBAL
========================= */
auth.onAuthStateChanged(user => {

  const path = window.location.pathname;

  // SI PAS CONNECTÉ → LOGIN
  if(!user){
    if(!path.includes("login")){
      window.location.href = "/Dicio/login.html";
    }
    return;
  }

  // SI CONNECTÉ → INDEX
  if(user && path.includes("login")){
    window.location.href = "/Dicio/index.html";
    return;
  }

  // AFFICHAGE SUR ACCUEIL
  if(user && document.getElementById("name")){

    document.getElementById("name").innerText = user.displayName;
    document.getElementById("pp").src = user.photoURL;
  }

});
