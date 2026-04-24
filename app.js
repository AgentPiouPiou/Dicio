function go(page){
  window.location.href = "/Dicio/" + page;
}

function login(){
  auth.signInWithPopup(provider);
}

function logout(){
  auth.signOut().then(()=>go("login.html"));
}

function toggleMenu(){
  const m = document.getElementById("menu");
  if(!m) return;
  m.style.display = (m.style.display === "flex") ? "none" : "flex";
}

/* CLEAN ID */
function clean(str){
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g,"");
}

/* =========================
   AUTH SAFE FLOW
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

  /* HEADER */
  setText("name-header", user.displayName);
  setImg("pp-header", user.photoURL);

  /* PROFILE */
  if(document.getElementById("pseudo")){
    loadUser(user);
  }

});

/* =========================
   LOAD USER
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

/* SAFE DOM */
function setText(id, val){
  const el = document.getElementById(id);
  if(el) el.innerText = val;
}

function setImg(id, val){
  const el = document.getElementById(id);
  if(el) el.src = val;
}
