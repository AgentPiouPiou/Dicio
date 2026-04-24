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
   NAVIGATION SIMPLE
===================== */
window.go = (p) => {
  window.location.href = "/Dicio" + p;
};

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
   AUTH STATE (IMPORTANT UX FIX)
===================== */
auth.onAuthStateChanged(user => {

  const login = document.getElementById("login");
  const home = document.getElementById("home");

  if(!user){
    if(login) login.style.display = "block";
    if(home) home.style.display = "none";
  } else {
    if(login) login.style.display = "none";
    if(home) home.style.display = "block";
  }

  render();
});

/* =====================
   RENDER ROUTES
===================== */
async function render(){

  const path = window.location.pathname.replace("/Dicio","");
  const app = document.getElementById("app");

  if(!app && path !== "/" && path !== "/profil") return;

  const user = auth.currentUser;
  if(!user) return;

  const id = slugify(user.displayName);

  /* ===== PROFIL ===== */
  if(path === "/profil"){

    const doc = await db.collection("users").doc(id).get();
    const data = doc.data();

    app.innerHTML = `
      <h2>Profil</h2>
      <img src="${data.photo}" width="100"><br>
      <b>${data.name}</b><br>
      @${data.id}<br><br>

      <button onclick="go('/settings')">Modifier profil</button>
      <button onclick="go('/')">Accueil</button>
    `;
  }

  /* ===== SETTINGS ===== */
  if(path === "/settings"){

    const doc = await db.collection("users").doc(id).get();
    const data = doc.data();

    app.innerHTML = `
      <h2>Settings</h2>

      Pseudo:<br>
      <input id="name" value="${data.name}"><br><br>

      ID:<br>
      <input id="newId" value="${data.id}"><br><br>

      Photo:<br>
      <input type="file" id="photoFile"><br><br>

      <button onclick="save()">Sauvegarder</button>
      <button onclick="go('/profil')">Retour</button>
    `;
  }

  /* ===== OTHER PROFILE ===== */
  const uid = path.replace("/","");
  if(uid && uid !== "profil" && uid !== "settings"){

    const doc = await db.collection("users").doc(uid).get();

    if(doc.exists){
      const data = doc.data();

      app.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${data.photo}" width="100"><br>
        @${data.id}<br><br>

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
};
