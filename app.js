/* =====================
   LOGIN
===================== */
function login(){
  auth.signInWithPopup(provider);
}

/* =====================
   LOGOUT
===================== */
function logout(){
  auth.signOut().then(()=>{
    window.location.href = "/Dicio/login.html";
  });
}

/* =====================
   NAV
===================== */
function go(page){
  window.location.href = "/Dicio/" + page;
}

/* =====================
   MENU TOGGLE
===================== */
function toggleMenu(){
  const m = document.getElementById("menu");
  m.style.display = (m.style.display === "flex") ? "none" : "flex";
}

/* =====================
   AUTH SYSTEM GLOBAL
===================== */
auth.onAuthStateChanged(user => {

  const path = window.location.pathname;

  // PAS CONNECTÉ → LOGIN
  if(!user){
    if(!path.includes("login")){
      window.location.href = "/Dicio/login.html";
    }
    return;
  }

  // CONNECTÉ → INDEX
  if(user && path.includes("login")){
    window.location.href = "/Dicio/index.html";
    return;
  }

  // CHARGER HEADER
  if(user && document.getElementById("account-name")){
    document.getElementById("account-name").innerText = user.displayName;
    document.getElementById("account-icon").src = user.photoURL;
  }

});
