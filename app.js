/* =========================
   NAVIGATION
========================= */

function go(page){
  window.location.href = "/Dicio/" + page;
}

/* =========================
   LOGIN GOOGLE
========================= */

function login(){
  auth.signInWithPopup(provider);
}

/* =========================
   LOGOUT
========================= */

function logout(){
  auth.signOut().then(()=>{
    window.location.href = "/Dicio/login.html";
  });
}

/* =========================
   MENU
========================= */

function toggleMenu(){
  const m = document.getElementById("menu");
  if(m){
    m.style.display = (m.style.display === "flex") ? "none" : "flex";
  }
}

/* =========================
   CLEAN ID
========================= */

function clean(str){
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g,"");
}

/* =========================
   AUTH FLOW STABLE
========================= */

auth.onAuthStateChanged(async user => {

  const path = window.location.pathname;

  /* ❌ PAS CONNECTÉ */
  if(!user){
    if(!path.includes("login")){
      window.location.href = "/Dicio/login.html";
    }
    return;
  }

  /* 🔁 CONNECTÉ → LOGIN BLOQUÉ */
  if(user && path.includes("login")){
    window.location.href = "/Dicio/index.html";
    return;
  }

  /* HEADER LOAD (SAFE) */
  const nameEl = document.getElementById("account-name");
  const ppEl = document.getElementById("account-icon");

  if(nameEl && ppEl){
    nameEl.innerText = user.displayName;
    ppEl.src = user.photoURL;
  }

  /* PROFIL */
  if(document.getElementById("pseudo")){
    await loadOrCreateUser(user);
  }

});

/* =========================
   CREATE / LOAD USER (IMPORTANT FIX)
========================= */

async function loadOrCreateUser(user){

  const emailId = clean(user.email); // UNIQUE STABLE KEY

  const ref = db.collection("users").doc(emailId);
  const doc = await ref.get();

  let data;

  if(!doc.exists){

    // 🔥 FIRST LOGIN → CREATE USER
    data = {
      pseudo: user.displayName,
      photo: user.photoURL,
      id: emailId,
      createdAt: Date.now()
    };

    await ref.set(data);

  } else {
    data = doc.data();
  }

  // 🔥 SAFE RENDER (ANTI BUG MOBILE)
  renderProfile(data);
}

/* =========================
   RENDER PROFILE (SAFE DOM)
========================= */

function renderProfile(data){

  const pp = document.getElementById("pp");
  const pseudo = document.getElementById("pseudo");
  const id = document.getElementById("id");

  if(pp) pp.src = data.photo;
  if(pseudo) pseudo.innerText = data.pseudo;
  if(id) id.innerText = "@" + data.id;
}

/* =========================
   EDIT PROFILE (SAFE + REAL TIME)
========================= */

window.editProfile = async () => {

  const user = auth.currentUser;
  if(!user) return;

  const emailId = clean(user.email);
  const ref = db.collection("users").doc(emailId);

  const doc = await ref.get();
  const data = doc.data();

  const newPseudo = prompt("Nouveau pseudo :", data.pseudo);
  if(!newPseudo) return;

  const fileInput = document.createElement("input");
  fileInput.type = "file";

  fileInput.onchange = async () => {

    let photo = data.photo;

    if(fileInput.files[0]){
      photo = await toBase64(fileInput.files[0]);
    }

    await ref.update({
      pseudo: newPseudo,
      photo: photo
    });

    location.reload();
  };

  fileInput.click();
};

/* =========================
   FILE → BASE64
========================= */

function toBase64(file){
  return new Promise(res=>{
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsDataURL(file);
  });
}
