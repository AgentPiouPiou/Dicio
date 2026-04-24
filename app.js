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
   NAVIGATION SPA
===================== */
function go(p){
  history.pushState({}, "", "/Dicio" + p);
  renderPage();
}

window.onpopstate = () => renderPage();

/* =====================
   INIT AUTO LOAD
===================== */
window.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged(user => {
    if(user) renderPage();
  });

  renderPage();
});

/* =====================
   LOGIN GOOGLE
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
   LOGOUT
===================== */
window.logout = () => auth.signOut();

/* =====================
   ROUTER
===================== */
async function renderPage(){

  const path = window.location.pathname.replace("/Dicio","");
  const app = document.getElementById("app");

  if(!app && path !== "/" && path !== "/profil") return;

  /* ===== PROFIL ===== */
  if(path === "/profil"){

    const user = auth.currentUser;
    if(!user) return;

    const id = slugify(user.displayName);

    const doc = await db.collection("users").doc(id).get();
    const data = doc.data();

    app.innerHTML = `
      <h1>Mon profil</h1>
      <img src="${data.photo}" width="120" style="border-radius:50%">
      <p>@${data.id}</p>

      <button onclick="go('/settings')">Modifier profil</button>
      <button onclick="go('/')">Menu</button>
    `;

    return;
  }

  /* ===== SETTINGS ===== */
  if(path === "/settings"){

    const user = auth.currentUser;
    const id = slugify(user.displayName);

    const doc = await db.collection("users").doc(id).get();
    const data = doc.data();

    app.innerHTML = `
      <h1>Modifier profil</h1>

      <input id="name" value="${data.name}">
      <input id="newId" value="${data.id}">

      <input type="file" id="photoFile" accept="image/*">

      <button onclick="save()">Enregistrer</button>
      <button onclick="go('/profil')">Retour</button>
    `;

    return;
  }

  /* ===== PROFIL AUTRE USER ===== */
  const id = path.replace("/","");
  const doc = await db.collection("users").doc(id).get();

  if(doc.exists){

    const data = doc.data();

    app.innerHTML = `
      <h1>${data.name}</h1>
      <img src="${data.photo}" width="120" style="border-radius:50%">
      <p>@${data.id}</p>

      <button onclick="go('/profil')">Retour</button>
    `;
  }
}

/* =====================
   SAVE PROFILE
===================== */
window.save = async () => {

  const user = auth.currentUser;
  const oldId = slugify(user.displayName);

  const name = document.getElementById("name").value;
  const newId = slugify(document.getElementById("newId").value);

  const file = document.getElementById("photoFile").files[0];

  const oldDoc = await db.collection("users").doc(oldId).get();
  const data = oldDoc.data();

  let photo = data.photo;

  /* IMAGE CONVERT */
  if(file){
    photo = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  /* ID CHANGE */
  if(newId && newId !== oldId){

    const check = await db.collection("users").doc(newId).get();

    if(check.exists){
      alert("ID déjà pris");
      return;
    }

    await db.collection("users").doc(newId).set({
      name,
      photo,
      id: newId
    });

    await db.collection("users").doc(oldId).delete();

    go("/profil");
    return;
  }

  /* SIMPLE UPDATE */
  await db.collection("users").doc(oldId).update({
    name,
    photo
  });

  go("/profil");
};

/* =====================
   NAV FIX
===================== */
window.go = go;
