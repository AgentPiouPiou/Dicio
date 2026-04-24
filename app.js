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
   MENU DROPDOWN
========================= */

function toggleMenu(){
  const menu = document.getElementById("menu");
  if(menu){
    menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
  }
}

/* =========================
   AUTH SYSTEM GLOBAL
========================= */

auth.onAuthStateChanged(async user => {

  if(!user){
    if(!window.location.pathname.includes("login")){
      window.location.href = "/Dicio/login.html";
    }
    return;
  }

  if(user && window.location.pathname.includes("login")){
    window.location.href = "/Dicio/index.html";
    return;
  }

  /* HEADER LOAD */
  if(document.getElementById("account-name")){
    document.getElementById("account-name").innerText = user.displayName;
    document.getElementById("account-icon").src = user.photoURL;
  }

  /* PROFIL PAGE */
  if(document.getElementById("pseudo")){
    loadProfile(user);
  }

});

/* =========================
   CLEAN STRING
========================= */

function clean(str){
  return str.toLowerCase().replace(/[^a-z0-9]/g,"");
}

/* =========================
   UNIQUE ID GENERATOR
========================= */

async function generateId(base){

  let id = clean(base);
  let i = 0;

  while(true){
    const doc = await db.collection("users").doc(id).get();
    if(!doc.exists) return id;
    i++;
    id = clean(base) + i;
  }
}

/* =========================
   LOAD PROFILE
========================= */

async function loadProfile(user){

  const id = await generateId(user.displayName);

  const ref = db.collection("users").doc(id);
  const doc = await ref.get();

  if(!doc.exists){
    await ref.set({
      pseudo: user.displayName,
      photo: user.photoURL,
      id
    });
  }

  const data = (await ref.get()).data();

  document.getElementById("pp").src = data.photo;
  document.getElementById("pseudo").innerText = data.pseudo;
  document.getElementById("id").innerText = "@" + data.id;
}

/* =========================
   EDIT PROFILE (LIVE)
========================= */

window.editProfile = async () => {

  const user = auth.currentUser;

  const newPseudo = prompt("Nouveau pseudo ?", user.displayName);
  if(!newPseudo) return;

  const file = document.createElement("input");
  file.type = "file";

  file.onchange = async () => {

    let photo = user.photoURL;

    if(file.files[0]){
      photo = await new Promise(res=>{
        const reader = new FileReader();
        reader.onload = ()=>res(reader.result);
        reader.readAsDataURL(file.files[0]);
      });
    }

    const newId = await generateId(newPseudo);

    await db.collection("users").doc(newId).set({
      pseudo: newPseudo,
      photo,
      id:newId
    });

    alert("Profil mis à jour");
    location.reload();
  };

  file.click();
};
