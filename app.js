/* =====================
   UTILS
===================== */
function slugify(str){
  return (str || "")
    .toLowerCase()
    .replace(/\s+/g,"")
    .replace(/[^a-z0-9]/g,"");
}

/* =====================
   LOGIN
===================== */
window.login = async () => {

  const result = await auth.signInWithPopup(provider);
  const user = result.user;

  const id = slugify(user.displayName);

  const doc = await db.collection("users").doc(id).get();

  if(!doc.exists){
    await db.collection("users").doc(id).set({
      name: user.displayName,
      photo: user.photoURL,
      id: id
    });
  }

  go("/profil");
};

/* =====================
   NAVIGATION
===================== */
window.go = (p) => {
  window.location.href = "/Dicio" + p;
};

/* =====================
   AUTH
===================== */
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

  renderPage();
});

/* =====================
   ROUTING SIMPLE
===================== */
async function renderPage(){

  const path = window.location.pathname.replace("/Dicio","");

  const app = document.getElementById("app");
  if(!app) return;

  /* ===== PROFIL ===== */
  if(path === "/profil"){

    const user = auth.currentUser;
    const id = slugify(user.displayName);

    const doc = await db.collection("users").doc(id).get();
    const data = doc.data();

    app.innerHTML = `
      <h1>Mon profil</h1>
      <img src="${data.photo}" width="100">
      <p>@${data.id}</p>

      <button onclick="go('/settings')">Modifier profil</button>
      <button onclick="go('/')">Menu</button>
    `;
  }

  /* ===== SETTINGS ===== */
  else if(path === "/settings"){

    const user = auth.currentUser;
    const id = slugify(user.displayName);

    const doc = await db.collection("users").doc(id).get();
    const data = doc.data();

    app.innerHTML = `
      <h1>Modifier profil</h1>

      <input id="name" placeholder="Pseudo" value="${data.name}">
      <input id="newId" placeholder="ID" value="${data.id}">
      <input id="photo" placeholder="Photo URL" value="${data.photo}">

      <button onclick="save()">Sauvegarder</button>
      <button onclick="go('/profil')">Retour</button>
    `;
  }

  /* ===== USER PROFILE /ow81 ===== */
  else {

    const id = path.replace("/","");
    const doc = await db.collection("users").doc(id).get();

    if(doc.exists){

      const data = doc.data();

      app.innerHTML = `
        <h1>${data.name}</h1>
        <img src="${data.photo}" width="100">
        <p>@${data.id}</p>

        <button onclick="go('/profil')">Retour</button>
      `;
    }
  }
}

/* =====================
   SAVE SETTINGS
===================== */
window.save = async () => {

  const user = auth.currentUser;
  const oldId = slugify(user.displayName);

  const name = document.getElementById("name").value;
  const newId = slugify(document.getElementById("newId").value);
  const photo = document.getElementById("photo").value;

  const oldDoc = await db.collection("users").doc(oldId).get();
  const data = oldDoc.data();

  let finalId = oldId;

  if(newId && newId !== oldId){

    const check = await db.collection("users").doc(newId).get();

    if(check.exists){
      alert("ID déjà pris");
      return;
    }

    await db.collection("users").doc(newId).set({
      name,
      photo,
      id:newId
    });

    await db.collection("users").doc(oldId).delete();

    finalId = newId;
  } else {

    await db.collection("users").doc(oldId).update({
      name,
      photo
    });
  }

  go("/profil");
};

/* =====================
   LOGOUT
===================== */
window.logout = () => auth.signOut();
