function go(page){
  window.location.href = "/Dicio/" + page;
}

function login(){
  auth.signInWithPopup(provider);
}

function logout(){
  auth.signOut().then(()=>{
    go("login.html");
  });
}

function toggleMenu(){
  const m = document.getElementById("menu");
  if(!m) return;
  m.style.display = (m.style.display === "flex") ? "none" : "flex";
}

function clean(str){
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g,"");
}

/* =========================
   SAFE AUTH (IMPORTANT FIX)
========================= */

auth.onAuthStateChanged(async user => {

  if(!user){
    if(!location.pathname.includes("login")){
      go("login.html");
    }
    return;
  }

  if(location.pathname.includes("login")){
    go("index.html");
    return;
  }

  const nameEl = document.getElementById("name-header");
  const ppEl = document.getElementById("pp-header");

  if(nameEl && ppEl){
    nameEl.innerText = user.displayName;
    ppEl.src = user.photoURL;
  }

  if(document.getElementById("pseudo")){
    loadUser(user);
  }

});

/* =========================
   LOAD USER (STABLE)
========================= */

async function loadUser(user){

  const ref = db.collection("users").doc(user.email);
  const doc = await ref.get();

  if(!doc.exists){
    await ref.set({
      pseudo: user.displayName,
      id: clean(user.displayName),
      photo: user.photoURL
    });
  }

  const data = (await ref.get()).data();

  setText("pseudo", data.pseudo);
  setText("id", "@" + data.id);
  setImg("pp", data.photo);
}

/* =========================
   SAFE DOM HELPERS (IMPORTANT FIX MOBILE)
========================= */

function setText(id, text){
  const el = document.getElementById(id);
  if(el) el.innerText = text;
}

function setImg(id, src){
  const el = document.getElementById(id);
  if(el) el.src = src;
}
