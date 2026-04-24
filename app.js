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
   ROUTING
===================== */
function go(p){
  history.pushState({}, "", "/Dicio" + p);
  render();
}

window.onpopstate = () => render();

/* =====================
   INIT
===================== */
window.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged(user => {
    render();
  });
  render();
});

/* =====================
   LOGIN
===================== */
window.login = async () => {
  const res = await auth.signInWithPopup(provider);
  const user = res.user;

  const id = slugify(user.displayName);

  const doc = await db.collection("users").doc(id).get();

  if(!doc.exists){
    await db.collection("users").doc(id).set({
      name: user.displayName,
      photo: user.photoURL,
      id
    });
  }

  go("/profil");
};

/* =====================
   LOGOUT
===================== */
window.logout = () => auth.signOut();

/* =====================
   RENDER
===================== */
async function render(){

  const path = window.location.pathname.replace("/Dicio","");
  const app = document.getElementById("app");

  const user = auth.currentUser;

  /* ===== HOME ===== */
  if(path === "/" || path === "/index.html"){
    const login = document.getElementById("login");
    const home = document.getElementById("home");

    if(user){
      login.style.display = "none";
      home.style.display = "block";
    } else {
      login.style.display = "block";
      home.style.display = "none";
    }
    return;
  }

  if(!app) return;

  const id = user ? slugify(user.displayName) : null;

  /* ===== PROFIL ===== */
  if(path === "/profil"){

    const doc = await db.collection("users").doc(id).get();
    const data = doc.data();

    app.innerHTML = `
      <div class="card profile-box">
        <img src="${data.photo}">
        <div>
          <h2>${data.name}</h2>
          <p>@${data.id}</p>
        </div>
      </div>

      <button class="btn-primary" onclick="go('/settings')">Modifier</button>
      <button class="btn-secondary" onclick="go('/')">Menu</button>
    `;
  }

  /* ===== SETTINGS ===== */
  if(path === "/settings"){

    const doc = await db.collection("users").doc(id).get();
    const data = doc.data();

    app.innerHTML = `
      <div class="card">

        <h2>Modifier profil</h2>

        <input id="name" value="${data.name}">
        <input id="newId" value="${data.id}">
        <input type="file" id="photoFile">

        <button class="btn-primary" onclick="save()">Sauvegarder</button>
        <button class="btn-secondary" onclick="go('/profil')">Retour</button>

      </div>
    `;
  }

  /* ===== OTHER PROFILE ===== */
  if(path !== "/profil" && path !== "/settings"){

    const uid = path.replace("/","");
    const doc = await db.collection("users").doc(uid).get();

    if(doc.exists){
      const data = doc.data();

      app.innerHTML = `
        <div class="card profile-box">
          <img src="${data.photo}">
          <div>
            <h2>${data.name}</h2>
            <p>@${data.id}</p>
          </div>
        </div>

        <button class="btn-secondary" onclick="go('/profil')">Retour</button>
      `;
    }
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

  const doc = await db.collection("users").doc(oldId).get();
  const data = doc.data();

  let photo = data.photo;

  if(file){
    photo = await new Promise(res => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.readAsDataURL(file);
    });
  }

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

    go("/profil");
    return;
  }

  await db.collection("users").doc(oldId).update({
    name,
    photo
  });

  go("/profil");
}
