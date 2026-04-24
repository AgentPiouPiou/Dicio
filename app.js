function go(page){
  window.location.href = "/Dicio/" + page;
}

function login(){
  auth.signInWithPopup(provider);
}

function logout(){
  auth.signOut().then(()=>{
    window.location.href = "/Dicio/login.html";
  });
}

function toggleMenu(){
  const m = document.getElementById("menu");
  if(m){
    m.style.display = (m.style.display === "flex") ? "none" : "flex";
  }
}

function clean(str){
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g,"");
}

/* =========================
   AUTH FLOW
========================= */

auth.onAuthStateChanged(async user => {

  if(!user){
    if(!location.pathname.includes("login")){
      window.location.href = "/Dicio/login.html";
    }
    return;
  }

  if(location.pathname.includes("login")){
    window.location.href = "/Dicio/index.html";
    return;
  }

  /* HEADER */
  if(document.getElementById("name-header")){
    document.getElementById("name-header").innerText = user.displayName;
    document.getElementById("pp-header").src = user.photoURL;
  }

  /* PROFILE LOAD */
  if(document.getElementById("pseudo")){
    loadUser(user);
  }

});

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

  if(document.getElementById("pp")){
    document.getElementById("pp").src = data.photo;
    document.getElementById("pseudo").innerText = data.pseudo;
    document.getElementById("id").innerText = "@" + data.id;
  }
}
