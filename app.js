/* ======================
   UTIL ROUTER
====================== */
function path(){
  return window.location.pathname.replace("/Dicio","") || "/";
}

function slugify(str){
  return (str || "")
    .toLowerCase()
    .replace(/\s+/g,"")
    .replace(/[^a-z0-9]/g,"");
}

function go(p){
  history.pushState({}, "", "/Dicio" + p);
  route();
}

window.onpopstate = () => route();

/* ======================
   LOGIN GOOGLE
====================== */
window.login = async () => {

  const result = await auth.signInWithPopup(provider);
  const user = result.user;

  const baseId = slugify(user.displayName);
  let finalId = baseId;
  let i = 1;

  while(true){
    const doc = await db.collection("users").doc(finalId).get();
    if(!doc.exists) break;
    finalId = baseId + i;
    i++;
  }

  await db.collection("users").doc(finalId).set({
    name: user.displayName,
    photo: user.photoURL,
    id: finalId
  });

  route();
};

/* ======================
   AUTH
====================== */
auth.onAuthStateChanged(user => {

  const login = document.getElementById("login");
  const home = document.getElementById("home");

  if(!user){
    if(login) login.style.display = "block";
    if(home) home.style.display = "none";
    return;
  }

  if(login) login.style.display = "none";
  if(home) home.style.display = "block";

  route();
});

/* ======================
   ROUTER
====================== */
async function route(){

  const p = path();
  const app = document.getElementById("app");

  if(!app && p !== "/" && p !== "/profil") return;

  /* ===== HOME ===== */
  if(p === "/" || p === "/index.html"){
    return;
  }

  /* ===== MON PROFIL ===== */
  if(p === "/profil"){

    const user = auth.currentUser;
    if(!user) return;

    const snap = await db.collection("users")
      .where("name","==",user.displayName)
      .limit(1)
      .get();

    const data = snap.docs[0].data();

    app.innerHTML = `
      <h1>Mon profil</h1>
      <img src="${data.photo}" width="100">
      <p>@${data.id}</p>

      <button onclick="go('/profil/settings')">Modifier</button>
      <button onclick="go('/')">Menu</button>
    `;
    return;
  }

  /* ===== SETTINGS ===== */
  if(p === "/profil/settings"){

    const user = auth.currentUser;

    const snap = await db.collection("users")
      .where("name","==",user.displayName)
      .limit(1)
      .get();

    const data = snap.docs[0].data();

    app.innerHTML = `
      <h1>Settings</h1>

      <input id="newName" placeholder="Pseudo">
      <input id="newId" placeholder="ID">
      <input id="newPhoto" placeholder="URL photo">

      <button onclick="save()">Sauvegarder</button>
      <button onclick="go('/profil')">Retour</button>
    `;
    return;
  }

  /* ===== PROFIL USER /ow81 ===== */
  const id = p.replace("/","");

  const doc = await db.collection("users").doc(id).get();

  if(doc.exists){

    const data = doc.data();

    app.innerHTML = `
      <h1>${data.name}</h1>
      <img src="${data.photo}" width="100">
      <p>@${data.id}</p>

      <button onclick="go('/')">Menu</button>
    `;
  }
}

/* ======================
   SAVE PROFILE
====================== */
window.save = async () => {

  const user = auth.currentUser;

  const snap = await db.collection("users")
    .where("name","==",user.displayName)
    .limit(1)
    .get();

  const doc = snap.docs[0];
  const data = doc.data();

  const newName = document.getElementById("newName").value;
  const newId = document.getElementById("newId").value;
  const newPhoto = document.getElementById("newPhoto").value;

  let update = {};

  if(newName) update.name = newName;
  if(newPhoto) update.photo = newPhoto;

  if(newId && newId !== data.id){

    const clean = slugify(newId);

    const check = await db.collection("users").doc(clean).get();

    if(check.exists){
      alert("ID déjà pris");
      return;
    }

    await db.collection("users").doc(clean).set({
      ...data,
      id: clean,
      name: newName || data.name,
      photo: newPhoto || data.photo
    });

    await db.collection("users").doc(data.id).delete();

    go("/" + clean);
    return;
  }

  await db.collection("users").doc(data.id).update(update);

  go("/profil");
};

/* ======================
   NAV
====================== */
window.go = go;

window.logout = () => auth.signOut();
