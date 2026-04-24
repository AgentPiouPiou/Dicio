/* =========================
   UTILS
========================= */

function slugify(str){
  return (str || "")
    .toLowerCase()
    .replace(/\s+/g,"")
    .replace(/[^a-z0-9]/g,"");
}

/* =========================
   NAVIGATION
========================= */

function go(path){
  window.location.href = "/Dicio" + path;
}

/* =========================
   LOGIN
========================= */

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

  go("/index.html");
};

/* =========================
   LOGOUT
========================= */

window.logout = async () => {
  await auth.signOut();
  go("/login.html");
};

/* =========================
   AUTH CHECK (IMPORTANT)
========================= */

auth.onAuthStateChanged(async user => {

  const path = window.location.pathname;

  if(!user && !path.includes("login")){
    go("/login.html");
    return;
  }

  if(user && path.includes("login")){
    go("/index.html");
    return;
  }

  if(user){
    loadHome(user);
    loadProfile(user);
    loadEdit(user);
  }
});

/* =========================
   HOME PAGE
========================= */

async function loadHome(user){

  if(!document.getElementById("userBox")) return;

  const id = slugify(user.displayName);
  const doc = await db.collection("users").doc(id).get();
  const data = doc.data();

  document.getElementById("pp").src = data.photo;
  document.getElementById("name").innerText = data.name;

  document.getElementById("pp").onclick = () => {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  };

  document.getElementById("userBox").style.display = "block";
}

/* =========================
   PROFIL PAGE
========================= */

async function loadProfile(user){

  if(!document.getElementById("app")) return;

  const id = slugify(user.displayName);
  const doc = await db.collection("users").doc(id).get();
  const data = doc.data();

  document.getElementById("app").innerHTML = `
    <img src="${data.photo}" width="100" style="border-radius:50%"><br><br>

    <h2>${data.name}</h2>
    <small>@${data.id}</small><br><br>

    <button onclick="go('/modification.html')">Modifier</button>
    <button onclick="go('/index.html')">Accueil</button>
  `;
}

/* =========================
   MODIFICATION PAGE
========================= */

async function loadEdit(user){

  if(!document.getElementById("app")) return;

  const id = slugify(user.displayName);
  const doc = await db.collection("users").doc(id).get();
  const data = doc.data();

  document.getElementById("app").innerHTML = `
    <h2>Modifier profil</h2>

    Pseudo:<br>
    <input id="name" value="${data.name}"><br><br>

    ID:<br>
    <input id="newId" value="${data.id}"><br><br>

    Photo:<br>
    <input type="file" id="photo"><br><br>

    <button onclick="save()">Sauvegarder</button>
  `;
}

/* =========================
   SAVE PROFILE
========================= */

window.save = async () => {

  const user = auth.currentUser;
  const oldId = slugify(user.displayName);

  const name = document.getElementById("name").value;
  const newId = slugify(document.getElementById("newId").value);
  const file = document.getElementById("photo").files[0];

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

  if(newId !== oldId){

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
  } else {
    await db.collection("users").doc(oldId).update({
      name,
      photo
    });
  }

  go("/profil.html");
};
